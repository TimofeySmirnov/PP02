import { MealType } from "@prisma/client";

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  BREAKFAST: "Завтрак",
  LUNCH: "Обед",
  DINNER: "Ужин",
  SNACK: "Перекус",
};

export function getMealTypeLabel(mealType: MealType) {
  return MEAL_TYPE_LABELS[mealType];
}

export function getTodayDateStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function formatRoundedNumber(value: number | null | undefined, unit: string) {
  if (value == null) {
    return `0 ${unit}`;
  }

  return `${Math.round(value)} ${unit}`;
}
