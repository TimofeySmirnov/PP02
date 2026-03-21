import { requireSession } from "@/lib/auth/session";
import { getTodayMeals } from "@/lib/meals/get-meals";
import { getUserProfile } from "@/lib/profile/get-profile";
import { DailySummary } from "@/components/meals/daily-summary";
import { MealSection } from "@/components/meals/meal-section";
import { PageHeader } from "@/components/layout/page-header";
import { ProtectedAppShell } from "@/components/layout/protected-app-shell";

export default async function MealsPage() {
  const session = await requireSession();
  const [profile, { dailyTotals, mealsByType }] = await Promise.all([
    getUserProfile(session.userId),
    getTodayMeals(session.userId),
  ]);

  return (
    <ProtectedAppShell>
      <PageHeader
        eyebrow="Приемы пищи"
        title="Журнал приемов пищи"
        description="Ищите продукты по локальной базе, добавляйте свои продукты вручную и фиксируйте граммы для пересчета БЖУ."
      />

      <section className="grid gap-6">
        <DailySummary profile={profile} totals={dailyTotals} />

        <div className="grid gap-4 xl:grid-cols-2">
          {mealsByType.map((mealGroup) => (
            <MealSection key={mealGroup.mealType} meal={mealGroup.meal} mealType={mealGroup.mealType} title={mealGroup.title} />
          ))}
        </div>
      </section>
    </ProtectedAppShell>
  );
}
