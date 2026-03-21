import Link from "next/link";

import { LogoutForm } from "@/components/auth/logout-form";
import { cn } from "@/lib/utils";

const baseNavigationItems = [
  { href: "/dashboard", label: "Дашборд" },
  { href: "/analytics", label: "Показатели" },
  { href: "/meals", label: "Приемы пищи" },
  { href: "/profile", label: "Профиль" },
];

const guestNavigationItems = [
  { href: "/login", label: "Вход" },
  { href: "/register", label: "Регистрация" },
];

type SidebarNavProps = {
  userName?: string;
};

export function SidebarNav({ userName }: SidebarNavProps) {
  const navigationItems = userName
    ? baseNavigationItems
    : [...baseNavigationItems, ...guestNavigationItems];

  return (
    <aside className="rounded-[32px] border border-white/60 bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
      <div className="flex min-h-full flex-col">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">Трекер питания</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Навигация</h2>
        </div>

        <nav className="mt-8 grid gap-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-2xl border border-transparent px-4 py-3 text-sm font-medium transition",
                "hover:border-[var(--border)] hover:bg-[var(--surface-strong)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 rounded-[24px] border border-[var(--border)] bg-white/80 p-4">
          {userName ? (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Аккаунт</p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{userName}</p>
              <div className="mt-4">
                <LogoutForm />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-[var(--muted)]">
                Войдите или зарегистрируйтесь, чтобы открыть личный кабинет и журнал питания.
              </p>
              <div className="mt-4 grid gap-2">
                <Link
                  className={cn(
                    "rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-medium transition",
                    "hover:bg-[var(--surface-strong)]",
                  )}
                  href="/login"
                >
                  Войти
                </Link>
                <Link
                  className={cn(
                    "rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-medium transition",
                    "hover:bg-[var(--surface-strong)]",
                  )}
                  href="/register"
                >
                  Регистрация
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
