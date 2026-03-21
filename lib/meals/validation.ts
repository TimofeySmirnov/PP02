import { MealType } from "@prisma/client";

export type MealLogErrors = {
  query?: string;
  grams?: string;
  name?: string;
  caloriesPer100g?: string;
  proteinPer100g?: string;
  carbsPer100g?: string;
  fatPer100g?: string;
  form?: string;
};

export type MealLogState = {
  errors: MealLogErrors;
  success?: string;
};

export const EMPTY_MEAL_LOG_STATE: MealLogState = {
  errors: {},
};

export function isMealType(value: string): value is MealType {
  return Object.values(MealType).includes(value as MealType);
}

export function validateGrams(value: string) {
  const grams = Number(value);

  if (!Number.isFinite(grams) || grams <= 0 || grams > 2000) {
    return null;
  }

  return grams;
}

export function validateNutrientPer100g(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0 || amount > 1000) {
    return null;
  }

  return Math.round(amount);
}
