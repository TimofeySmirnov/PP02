import { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type AuthCardProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ children, footer }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md p-8">
      {children}
      {footer ? <div className="mt-6 border-t border-[var(--border)] pt-5">{footer}</div> : null}
    </Card>
  );
}
