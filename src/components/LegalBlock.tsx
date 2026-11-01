import type { ReactNode } from 'react';

export default function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.01em]">{title}</h2>
      <div className="space-y-3 text-[0.98rem] text-ink/85">{children}</div>
    </section>
  );
}
