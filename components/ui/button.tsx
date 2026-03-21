import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
};

export function Button({
  asChild = false,
  children,
  className,
  variant = "primary",
  href,
  ...props
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--ring)]",
    variant === "primary"
      ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
      : "bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[#ffe7d8]",
    className,
  );

  if (href) {
    return (
      <Link className={styles} href={href}>
        {children}
      </Link>
    );
  }

  if (asChild) {
    return <span className={styles}>{children}</span>;
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
