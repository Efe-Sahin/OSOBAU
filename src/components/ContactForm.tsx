import { useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

import Button from './Button';
import { getServices } from '../data/services';
import { site } from '../config/site';
import { clientTypeLabel, getClientTypeLabel } from '../data/audiences';
import { useLang, useT, type Lang } from '../i18n';

/**
 * Projektanfrage-Formular
 * ------------------------------------------------------------
 * Versand: POST (multipart/form-data, ohne Dateianhänge) an VITE_CONTACT_ENDPOINT
 * → mitgeliefertes Skript public/api/contact.php (siehe README).
 * Ist kein Endpunkt gesetzt, zeigt das Formular deutlich an, dass der
 * Versand noch nicht angebunden ist – es wird nichts vorgetäuscht.
 */

const ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT ?? '/api/contact.php').trim();

type Field = 'name' | 'email' | 'phone' | 'service' | 'location' | 'message' | 'privacy';
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'sending' | 'success' | 'error';

/** Vorauswahl aus ?auftraggeber=… (funktioniert mit Browser- und Hash-Routing) */
function presetClientType(lang: Lang): string {
  if (typeof window === 'undefined') return '';
  // BrowserRouter: ?auftraggeber=… in location.search; Hash-Vorschau: im Hash vor dem Anker
  const q = window.location.search || '?' + ((window.location.hash.split('?')[1] ?? '').split('#')[0]);
  const v = new URLSearchParams(q).get('auftraggeber') as keyof typeof clientTypeLabel | null;
  return v && v in clientTypeLabel ? getClientTypeLabel(lang)[v] : '';
}

/** Vorauswahl der Leistung aus ?leistung=<slug> */
function presetService(lang: Lang): string {
  if (typeof window === 'undefined') return '';
  const q = window.location.search || '?' + ((window.location.hash.split('?')[1] ?? '').split('#')[0]);
  const slug = new URLSearchParams(q).get('leistung');
  return getServices(lang).find((s) => s.slug === slug)?.title ?? '';
}


export default function ContactForm() {
  const location = useLocation();
  const lang = useLang();
  const t = useT();
  const f = t.form;
  const services = getServices(lang);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const preset = useMemo(() => presetClientType(lang), [location]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const presetSvc = useMemo(() => presetService(lang), [location]);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [startedAt] = useState(() => Date.now());

  const validate = (fd: FormData): Errors => {
    const e: Errors = {};
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    if (name.length < 2) e.name = f.err.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = f.err.email;
    if (phone && !/^[+()\d\s/-]{6,}$/.test(phone)) e.phone = f.err.phone;
    if (!fd.get('service')) e.service = f.err.service;
    if (String(fd.get('location') ?? '').trim().length < 2) e.location = f.err.location;
    if (String(fd.get('message') ?? '').trim().length < 20)
      e.message = f.err.message;
    if (!fd.get('privacy')) e.privacy = f.err.privacy;
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const errs = validate(fd);
    setErrors(errs);

    if (Object.keys(errs).length) {
      setStatus('idle');
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    if (!ENDPOINT) {
      setStatus('error');
      setServerMessage(
        f.notConnectedShort,
      );
      return;
    }

    fd.set('lang', lang);
    fd.set('elapsed', String(Math.round((Date.now() - startedAt) / 1000)));

    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) throw new Error(data.message || f.failed);
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setServerMessage(
        err instanceof Error && err.message !== 'Failed to fetch'
          ? err.message
          : f.failed,
      );
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        role="status"
        className="border border-line bg-white p-8 sm:p-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CheckCircle2 className="size-10 text-bronze-ink" strokeWidth={1.5} aria-hidden="true" />
        <h3 className="display-md mt-6">{f.thanksTitle}</h3>
        <p className="lead mt-4">
          {f.thanksText}
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="link-underline mt-8 text-sm font-semibold">
          {f.another}
        </button>
      </motion.div>
    );
  }

  const errorList = Object.entries(errors).filter(([, v]) => v) as [Field, string][];

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-8" aria-describedby="form-hint">
      {!ENDPOINT && (
        <div className="flex gap-3 border border-dashed border-orange-700 bg-orange-50 p-4 text-sm text-orange-900">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            <strong>{f.note}</strong> {f.notConnected}
          </p>
        </div>
      )}

      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="border-l-2 border-red-700 bg-red-50 p-5 text-sm text-red-900 outline-none"
        >
          <p className="font-semibold">{f.checkFields}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorList.map(([field, msg]) => (
              <li key={field}>
                <a
                  href={`#f-${field}`}
                  className="underline underline-offset-2"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`f-${field}`)?.focus();
                  }}
                >
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p id="form-hint" className="text-sm text-stone">
        {f.requiredHint} <span className="text-bronze-ink">*</span> {f.requiredHint2}
      </p>

      <fieldset className="grid gap-6 sm:grid-cols-2">
        <legend className="mb-6 font-sans text-[0.76rem] font-semibold tracking-[0.22em] text-stone uppercase">
          {f.yourContact}
        </legend>
        <TextField id="name" label={f.name} required autoComplete="name" error={errors.name} />
        <TextField id="company" label={f.company} autoComplete="organization" optional />
        <TextField id="email" label={f.email} type="email" required autoComplete="email" error={errors.email} />
        <TextField id="phone" label={f.phone} type="tel" autoComplete="tel" optional error={errors.phone} />
      </fieldset>

      <fieldset className="grid gap-6 sm:grid-cols-2">
        <legend className="mb-6 font-sans text-[0.76rem] font-semibold tracking-[0.22em] text-stone uppercase">
          {f.yourProject}
        </legend>
        <FieldShell id="service" label={f.service} required error={errors.service}>
          {(p) => (
            <select {...p} key={presetSvc} name="service" defaultValue={presetSvc} className={inputCls(!!errors.service)}>
              <option value="" disabled>
                {f.choose}
              </option>
              {services.map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
              <option value={f.multiple}>{f.multiple}</option>
              <option value={f.other}>{f.other}</option>
            </select>
          )}
        </FieldShell>
        <TextField id="location" label={f.location} required placeholder={f.locationPh} error={errors.location} />
        <FieldShell id="timeframe" label={f.timeframe} optional>
          {(p) => (
            <select {...p} name="timeframe" defaultValue="" className={inputCls(false)}>
              <option value="">{f.noAnswer}</option>
              {f.timeframes.map((tf) => (
                <option key={tf}>{tf}</option>
              ))}
            </select>
          )}
        </FieldShell>
        <FieldShell id="clientType" label={f.clientType} optional>
          {(p) => (
            <select {...p} key={preset} name="clientType" defaultValue={preset} className={inputCls(false)}>
              <option value="">{f.noAnswer}</option>
              {Object.values(getClientTypeLabel(lang)).map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          )}
        </FieldShell>
        <FieldShell id="message" label={f.message} required error={errors.message} className="sm:col-span-2">
          {(p) => (
            <textarea
              {...p}
              name="message"
              rows={6}
              placeholder={f.messagePh}
              className={`${inputCls(!!errors.message)} resize-y`}
            />
          )}
        </FieldShell>
      </fieldset>

      {/* Honeypot gegen Spam – für Menschen unsichtbar */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="f-privacy" className="flex cursor-pointer items-start gap-3 text-[0.9rem] leading-relaxed">
          <input
            id="f-privacy"
            type="checkbox"
            name="privacy"
            value="1"
            className="mt-0.5 size-5 shrink-0 accent-night"
            aria-invalid={!!errors.privacy}
            aria-describedby={errors.privacy ? 'f-privacy-error' : undefined}
          />
          <span>
            {f.privacyBefore}{' '}
            <Link to="/datenschutz" hrefLang="de" className="underline underline-offset-2 hover:text-bronze-ink">
              {f.privacyLink}
            </Link>{' '}
            {f.privacyAfter}{' '}
            <span className="text-bronze-ink">*</span>
          </span>
        </label>
        {errors.privacy && <ErrorText id="f-privacy-error">{errors.privacy}</ErrorText>}
      </div>

      {status === 'error' && (
        <div role="alert" className="flex gap-3 border-l-2 border-red-700 bg-red-50 p-5 text-sm text-red-900">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            {serverMessage} {f.alsoReach}{' '}
            <a href={site.contact.phoneHref} className="font-semibold underline">
              {site.contact.phoneDisplay}
            </a>{' '}
            {f.orEmail}{' '}
            <a href={`mailto:${site.contact.email}`} className="font-semibold underline">
              {site.contact.email}
            </a>
            .
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === 'sending'} icon={status !== 'sending'} className="sm:min-w-64">
          {status === 'sending' ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> {f.sending}
            </span>
          ) : (
            f.submit
          )}
        </Button>
        <p className="text-xs text-stone" aria-live="polite">
          {status === 'sending' ? f.sendingStatus : f.secure}
        </p>
      </div>
    </form>
  );
}

/* ---------- Hilfskomponenten ---------- */

const inputCls = (invalid: boolean) =>
  `block w-full border bg-white px-4 py-3.5 text-[1rem] text-ink placeholder:text-stone/70 transition-colors focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 ${
    invalid ? 'border-red-700' : 'border-ink/20 hover:border-ink/45'
  }`;

interface FieldProps {
  id: string;
  'aria-invalid': boolean;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
}

function FieldShell({
  id,
  label,
  required,
  optional,
  error,
  className = '',
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  className?: string;
  children: (p: FieldProps & { id: string }) => ReactNode;
}) {
  const errId = useId();
  const t = useT();
  return (
    <div className={className}>
      <label htmlFor={`f-${id}`} className="mb-2 block text-[0.9rem] font-medium">
        {label} {required && <span className="text-bronze-ink">*</span>}
        {optional && <span className="font-normal text-stone">{t.form.optional}</span>}
      </label>
      {children({
        id: `f-${id}`,
        'aria-invalid': !!error,
        'aria-describedby': error ? errId : undefined,
        'aria-required': required || undefined,
      })}
      {error && <ErrorText id={errId}>{error}</ErrorText>}
    </div>
  );
}

function TextField({
  id,
  label,
  type = 'text',
  required,
  optional,
  autoComplete,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} error={error}>
      {(p) => (
        <input
          {...p}
          type={type}
          name={id}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={inputCls(!!error)}
        />
      )}
    </FieldShell>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-red-800">
      <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}
