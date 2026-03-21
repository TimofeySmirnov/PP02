import { Profile } from "@prisma/client";

import { Card } from "@/components/ui/card";
import { getGenderLabel, getGoalLabel } from "@/lib/nutrition/calculations";

type TargetSummaryProps = {
  profile: Profile | null;
};

export function TargetSummary({ profile }: TargetSummaryProps) {
  const items = [
    { label: "Пол", value: getGenderLabel(profile?.gender) },
    { label: "Цель", value: getGoalLabel(profile?.goal) },
    { label: "Калории", value: profile?.dailyCalorieGoal != null ? `${profile.dailyCalorieGoal} ккал` : "Не рассчитано" },
    { label: "Белки", value: profile?.dailyProteinGoal != null ? `${profile.dailyProteinGoal} г` : "Не рассчитано" },
    { label: "Жиры", value: profile?.dailyFatGoal != null ? `${profile.dailyFatGoal} г` : "Не рассчитано" },
    { label: "Углеводы", value: profile?.dailyCarbGoal != null ? `${profile.dailyCarbGoal} г` : "Не рассчитано" },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">Рассчитанные цели</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
