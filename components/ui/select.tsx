import { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export function Select({ children, error, label, ...props }: SelectProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-[var(--foreground)]">{label}</span>
      <select
        aria-invalid={Boolean(error)}
        className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)] aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-100"
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
