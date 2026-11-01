<?php
/**
 * Kopieren nach config.php und Werte anpassen. config.php NICHT ins Git-Repository einchecken.
 */
return [
    // Empfänger der Anfragen (laut Briefing)
    'to'   => 'kontakt@osobau.de',
    // Absender: echtes Postfach der eigenen Domain (sonst landen Mails im Spam)
    'from' => 'website@osobau.de',
    // Erlaubte Herkunft(en) des Formulars
    'allowed_origins' => ['https://www.osobau.de', 'https://osobau.de'],
    // Zufälliger String zum Hashen der IP-Adressen (Rate-Limit)
    'salt' => 'BITTE-ERSETZEN-durch-zufaelligen-String',
    'max_per_hour' => 5,
    'max_files'    => 5,
    'max_file_mb'  => 10,
    'max_total_mb' => 20,
];
