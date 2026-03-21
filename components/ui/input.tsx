import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-[var(--foreground)]">{label}</span>
      <input
        aria-invalid={Boolean(error)}
        className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-[var(--foreground)] outline-none transition placeholder:text-[#978c7b] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)] aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-100"
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
