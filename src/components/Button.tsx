import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

type Variant = 'primary' | 'light' | 'outline' | 'outline-light' | 'text';

const styles: Record<Variant, string> = {
  primary: 'bg-night text-white hover:bg-bronze hover:text-night',
  light: 'bg-white text-night hover:bg-bronze',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white',
  'outline-light': 'border border-white/35 text-white hover:border-white hover:bg-white hover:text-night',
  text: 'px-0! py-0! text-ink hover:text-bronze-ink',
};

interface ButtonProps {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: Variant;
  icon?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

/** Einheitlicher Button – rendert Link, <a> oder <button> */
export default function Button({
  to,
  href,
  children,
  variant = 'primary',
  icon = true,
  className = '',
  type = 'button',
  disabled,
  onClick,
}: ButtonProps) {
  const cls = `group inline-flex items-center justify-center gap-3 px-6 py-3.5 text-[0.9rem] font-semibold tracking-[0.01em] transition-[background-color,color,border-color] duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
          strokeWidth={1.75}
        />
      )}
    </>
  );

  if (to)
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {content}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={cls} onClick={onClick}>
        {content}
      </a>
    );
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  );
}
