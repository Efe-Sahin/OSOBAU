<?php
/**
 * OSOBAU – Versand des Projektanfrage-Formulars
 * ------------------------------------------------------------
 * Voraussetzungen: PHP ≥ 8.1, mail() bzw. Sendmail beim Hoster aktiv,
 * Absenderadresse (FROM) als echtes Postfach der Domain eingerichtet (SPF/DKIM!).
 * Konfiguration: api/config.php (Vorlage: config.example.php).
 *
 * Schutzmaßnahmen: nur POST, Honeypot, Mindest-Ausfüllzeit, Rate-Limit pro IP,
 * Header-Injection-Schutz, Längenlimits, Dateiendung + MIME-Prüfung via finfo,
 * Größenlimits. Uploads werden nur als Mail-Anhang versendet, nicht gespeichert.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $code, bool $ok, string $message): never {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    respond(500, false, 'Der Formularversand ist noch nicht konfiguriert.');
}
$config = require $configFile;

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, false, 'Methode nicht erlaubt.');
}

// Optional: Herkunft prüfen (Schutz vor Fremdeinbindung)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !empty($config['allowed_origins']) && !in_array($origin, $config['allowed_origins'], true)) {
    respond(403, false, 'Anfrage nicht erlaubt.');
}

// ---------- Spam-Schutz ----------
if (!empty($_POST['website'])) {
    respond(200, true, 'Vielen Dank.'); // Honeypot gefüllt → stillschweigend verwerfen
}
if ((int)($_POST['elapsed'] ?? 0) < 4) {
    respond(422, false, 'Bitte versuchen Sie es erneut.');
}

// Einfaches Rate-Limit: max. N Anfragen je IP und Stunde (IP wird nur gehasht gespeichert)
$rateDir = sys_get_temp_dir() . '/osobau-rate';
@mkdir($rateDir, 0700, true);
$ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . ($config['salt'] ?? ''));
$rateFile = "$rateDir/$ipHash";
$hits = array_filter(
    is_file($rateFile) ? (array)json_decode((string)file_get_contents($rateFile), true) : [],
    fn($t) => is_int($t) && $t > time() - 3600
);
if (count($hits) >= (int)($config['max_per_hour'] ?? 5)) {
    respond(429, false, 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.');
}

// ---------- Eingaben ----------
function field(string $key, int $max): string {
    $v = trim((string)($_POST[$key] ?? ''));
    $v = str_replace(["\r\n", "\r"], "\n", $v);
    return mb_substr($v, 0, $max);
}
function oneLine(string $v): string {
    return trim(preg_replace('/[\r\n\t]+/', ' ', $v) ?? '');
}

$data = [
    'Name'          => oneLine(field('name', 120)),
    'Unternehmen'   => oneLine(field('company', 160)),
    'E-Mail'        => oneLine(field('email', 200)),
    'Telefon'       => oneLine(field('phone', 60)),
    'Leistung'      => oneLine(field('service', 80)),
    'Standort'      => oneLine(field('location', 160)),
    'Zeitraum'      => oneLine(field('timeframe', 80)),
    'Auftraggeber'  => oneLine(field('clientType', 80)),
    'Beschreibung'  => field('message', 6000),
];

$errors = [];
if (mb_strlen($data['Name']) < 2) $errors[] = 'Name';
if (!filter_var($data['E-Mail'], FILTER_VALIDATE_EMAIL)) $errors[] = 'E-Mail';
if ($data['Leistung'] === '') $errors[] = 'Leistung';
if (mb_strlen($data['Standort']) < 2) $errors[] = 'Standort';
if (mb_strlen($data['Beschreibung']) < 20) $errors[] = 'Projektbeschreibung';
if (empty($_POST['privacy'])) $errors[] = 'Datenschutz';
if ($errors) {
    respond(422, false, 'Bitte prüfen Sie: ' . implode(', ', $errors) . '.');
}

// ---------- Dateien ----------
$allowed = [
    'pdf'  => ['application/pdf'],
    'jpg'  => ['image/jpeg'],
    'jpeg' => ['image/jpeg'],
    'png'  => ['image/png'],
    'webp' => ['image/webp'],
    'heic' => ['image/heic', 'image/heif', 'application/octet-stream'],
    'dwg'  => ['image/vnd.dwg', 'application/acad', 'application/octet-stream', 'image/x-dwg'],
    'dxf'  => ['image/vnd.dxf', 'application/dxf', 'text/plain', 'application/octet-stream'],
    'zip'  => ['application/zip', 'application/x-zip-compressed'],
];
$maxFiles = (int)($config['max_files'] ?? 5);
$maxFile  = (int)($config['max_file_mb'] ?? 10) * 1024 * 1024;
$maxTotal = (int)($config['max_total_mb'] ?? 20) * 1024 * 1024;

$attachments = [];
$total = 0;
if (!empty($_FILES['attachments']['name']) && is_array($_FILES['attachments']['name'])) {
    $f = $_FILES['attachments'];
    $count = count($f['name']);
    if ($count > $maxFiles) respond(422, false, "Maximal $maxFiles Dateien erlaubt.");
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    for ($i = 0; $i < $count; $i++) {
        if ($f['error'][$i] === UPLOAD_ERR_NO_FILE) continue;
        if ($f['error'][$i] !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'][$i])) {
            respond(422, false, 'Eine Datei konnte nicht hochgeladen werden.');
        }
        $name = basename((string)$f['name'][$i]);
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        $size = (int)$f['size'][$i];
        $mime = (string)$finfo->file($f['tmp_name'][$i]);
        if (!isset($allowed[$ext]) || !in_array($mime, $allowed[$ext], true)) {
            respond(422, false, "Dateityp nicht erlaubt: $name");
        }
        if ($size > $maxFile) respond(422, false, "$name ist zu groß.");
        $total += $size;
        if ($total > $maxTotal) respond(422, false, 'Die Dateien sind insgesamt zu groß.');
        $safeName = preg_replace('/[^A-Za-z0-9._-]+/', '_', $name) ?: "anhang-$i.$ext";
        $attachments[] = ['name' => $safeName, 'mime' => $mime, 'data' => (string)file_get_contents($f['tmp_name'][$i])];
    }
}

// ---------- Mail aufbauen ----------
$to      = (string)$config['to'];
$from    = (string)$config['from'];
$subject = 'Projektanfrage: ' . $data['Leistung'] . ' – ' . $data['Standort'];
$encSubject = '=?UTF-8?B?' . base64_encode(mb_substr($subject, 0, 150)) . '?=';

$text = "Neue Projektanfrage über die Website\n" . str_repeat('=', 40) . "\n\n";
foreach ($data as $label => $value) {
    if ($value === '') continue;
    $text .= $label === 'Beschreibung' ? "\n$label:\n$value\n" : str_pad("$label:", 15) . "$value\n";
}
$text .= "\nAnhänge: " . (count($attachments) ?: 'keine') . "\n";
$text .= 'Gesendet: ' . date('d.m.Y H:i') . " Uhr\n";

$boundary = 'osobau_' . bin2hex(random_bytes(12));
$headers = [
    'MIME-Version: 1.0',
    'From: OSOBAU Website <' . $from . '>',
    'Reply-To: ' . $data['E-Mail'],
    'X-Mailer: OSOBAU-Website',
    "Content-Type: multipart/mixed; boundary=\"$boundary\"",
];

$body  = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n";
$body .= chunk_split(base64_encode($text)) . "\r\n";
foreach ($attachments as $a) {
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: {$a['mime']}; name=\"{$a['name']}\"\r\n";
    $body .= "Content-Disposition: attachment; filename=\"{$a['name']}\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($a['data'])) . "\r\n";
}
$body .= "--$boundary--";

$sent = mail($to, $encSubject, $body, implode("\r\n", $headers), '-f' . $from);

if (!$sent) {
    error_log('[OSOBAU] Kontaktformular: mail() fehlgeschlagen');
    respond(500, false, 'Die Anfrage konnte nicht gesendet werden.');
}

$hits[] = time();
@file_put_contents($rateFile, json_encode(array_values($hits)), LOCK_EX);

respond(200, true, 'Vielen Dank für Ihre Anfrage.');
