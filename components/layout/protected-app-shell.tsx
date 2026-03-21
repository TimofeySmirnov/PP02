import { ReactNode } from "react";

import { requireSession } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";

type ProtectedAppShellProps = {
  children: ReactNode;
};

export async function ProtectedAppShell({ children }: ProtectedAppShellProps) {
  const session = await requireSession();

  return <AppShell userName={session.name}>{children}</AppShell>;
}
