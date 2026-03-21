type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p>
    </header>
  );
}
