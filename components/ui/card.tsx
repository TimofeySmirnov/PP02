import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_10px_30px_rgba(45,34,18,0.05)]",
        className,
      )}
      {...props}
    />
  );
}
