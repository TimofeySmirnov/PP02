import { requireSession } from "@/lib/auth/session";
import { getUserProfile } from "@/lib/profile/get-profile";
import { ProfileForm } from "@/components/profile/profile-form";
import { TargetSummary } from "@/components/profile/target-summary";
import { PageHeader } from "@/components/layout/page-header";
import { ProtectedAppShell } from "@/components/layout/protected-app-shell";

export default async function ProfilePage() {
  const session = await requireSession();
  const profile = await getUserProfile(session.userId);

  return (
    <ProtectedAppShell>
      <PageHeader
        eyebrow="Профиль"
        title="Ваши личные настройки"
        description="Заполните основные параметры, а приложение рассчитает вашу дневную норму калорий и макронутриентов."
      />

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_10px_30px_rgba(45,34,18,0.05)]">
          <h2 className="text-xl font-semibold">Данные профиля</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            После сохранения мы пересчитаем цели по калориям, белкам, жирам и углеводам.
          </p>
          <div className="mt-6">
            <ProfileForm profile={profile} />
          </div>
        </div>

        <TargetSummary profile={profile} />
      </section>
    </ProtectedAppShell>
  );
}
