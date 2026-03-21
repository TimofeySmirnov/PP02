import { ReactNode } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";

type AppShellProps = {
  children: ReactNode;
  userName?: string;
};

export function AppShell({ children, userName }: AppShellProps) {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <SidebarNav userName={userName} />
        <main className="rounded-[32px] border border-white/60 bg-white/72 p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
