import { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">LifeSummary</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-[var(--foreground)]">{title}</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">{description}</p>
        </div>

        {children}
      </div>
    </main>
  );
}
