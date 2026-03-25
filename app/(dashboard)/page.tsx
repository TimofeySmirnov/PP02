import { DailySummary } from "@/components/meals/daily-summary";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { ProtectedAppShell } from "@/components/layout/protected-app-shell";
import { Card } from "@/components/ui/card";
import { requireSession } from "@/lib/auth/session";
import { getTodayMeals } from "@/lib/meals/get-meals";
import { getGoalLabel } from "@/lib/nutrition/calculations";
import { getUserProfile } from "@/lib/profile/get-profile";

export default async function DashboardPage() {
  const session = await requireSession();
  const [profile, { dailyTotals }] = await Promise.all([
    getUserProfile(session.userId),
    getTodayMeals(session.userId),
  ]);

  const stats = [
    {
      label: "Дневная цель по калориям",
      value: profile?.dailyCalorieGoal != null ? `${profile.dailyCalorieGoal} ккал` : "—",
      hint: profile?.goal ? getGoalLabel(profile.goal) : "Заполните профиль",
    },
    {
      label: "Съедено за сегодня",
      value: `${dailyTotals.calories} ккал`,
      hint: profile?.dailyCalorieGoal != null ? `Осталось: ${Math.max(profile.dailyCalorieGoal - dailyTotals.calories, 0)} ккал` : "Без цели",
    },
    {
      label: "Белки / Жиры / Углеводы",
      value: `${dailyTotals.protein} / ${dailyTotals.fat} / ${dailyTotals.carbs} г`,
      hint: "Фактические итоги за день",
    },
  ];

  return (
    <ProtectedAppShell>
      <PageHeader
        eyebrow="Дашборд"
        title="Ваш обзор питания"
        description="Здесь видны персональные цели и фактические итоги за текущий день."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-6">
        <DailySummary profile={profile} totals={dailyTotals} />

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="p-6">
            <h2 className="text-xl font-semibold">Как считаются цели</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Базовые калории считаются по формуле Миффлина-Сан Жеора, затем корректируются под цель.
              Белок задается в граммах на килограмм массы тела, жиры берутся как доля калорий, а
              углеводы заполняют оставшийся баланс.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold">Статус профиля</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {profile
                ? `Профиль заполнен для цели: ${getGoalLabel(profile.goal)}.`
                : "Заполните профиль, чтобы получить персональные цели питания."}
            </p>
          </Card>
        </div>
      </section>
    </ProtectedAppShell>
  );
}
