import { Meal, MealEntry, MealType } from "@prisma/client";

import { MealLogForm } from "@/components/meals/meal-log-form";
import { Card } from "@/components/ui/card";

type MealWithEntries = Meal & {
  entries: MealEntry[];
};

type MealSectionProps = {
  mealType: MealType;
  title: string;
  meal: MealWithEntries | undefined;
};

export function MealSection({ mealType, title, meal }: MealSectionProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {meal
              ? `Всего: ${meal.totalKcal ?? 0} ккал, Б ${meal.totalProtein ?? 0} / Ж ${meal.totalFat ?? 0} / У ${meal.totalCarbs ?? 0}`
              : "Пока ничего не добавлено."}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <MealLogForm mealType={mealType} />
      </div>

      <div className="mt-6 grid gap-3">
        {meal?.entries.length ? (
          meal.entries.map((entry) => (
            <div className="rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3" key={entry.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{entry.foodName}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{Math.round(entry.grams)} г</p>
                </div>
                <div className="text-right text-sm text-[var(--muted)]">
                  <p>{entry.calories ?? 0} ккал</p>
                  <p className="mt-1">
                    Б {entry.protein ?? 0} / Ж {entry.fat ?? 0} / У {entry.carbs ?? 0}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--muted)]">Записи появятся после первого добавления продукта.</p>
        )}
      </div>
    </Card>
  );
}
