import { Profile } from "@prisma/client";

import { Card } from "@/components/ui/card";

type DailySummaryProps = {
  profile: Profile | null;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export function DailySummary({ profile, totals }: DailySummaryProps) {
  const items = [
    {
      label: "Калории",
      value: `${totals.calories} ккал`,
      hint:
        profile?.dailyCalorieGoal != null ? `Цель: ${profile.dailyCalorieGoal} ккал` : "Цель будет доступна после заполнения профиля",
    },
    {
      label: "Белки",
      value: `${totals.protein} г`,
      hint: profile?.dailyProteinGoal != null ? `Цель: ${profile.dailyProteinGoal} г` : "Нет цели",
    },
    {
      label: "Жиры",
      value: `${totals.fat} г`,
      hint: profile?.dailyFatGoal != null ? `Цель: ${profile.dailyFatGoal} г` : "Нет цели",
    },
    {
      label: "Углеводы",
      value: `${totals.carbs} г`,
      hint: profile?.dailyCarbGoal != null ? `Цель: ${profile.dailyCarbGoal} г` : "Нет цели",
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">Сводка за день</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div className="rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3" key={item.label}>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{item.value}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">{item.hint}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
