import { Gender, GoalType } from "@prisma/client";

export type NutritionProfileInput = {
  gender: Gender;
  age: number;
  weightKg: number;
  heightCm: number;
  goal: GoalType;
};

export type NutritionTargets = {
  calories: number;
  proteinGrams: number;
  fatGrams: number;
  carbGrams: number;
  bmr: number;
};

const ACTIVITY_MULTIPLIER = 1.375;

const GOAL_ADJUSTMENTS: Record<GoalType, number> = {
  LOSE_WEIGHT: -400,
  MAINTAIN: 0,
  GAIN_WEIGHT: 300,
};

const PROTEIN_MULTIPLIER: Record<GoalType, number> = {
  LOSE_WEIGHT: 2,
  MAINTAIN: 1.8,
  GAIN_WEIGHT: 1.7,
};

const FAT_RATIO: Record<GoalType, number> = {
  LOSE_WEIGHT: 0.3,
  MAINTAIN: 0.28,
  GAIN_WEIGHT: 0.25,
};

export function calculateMifflinStJeorBmr(input: NutritionProfileInput) {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  return input.gender === Gender.MALE ? base + 5 : base - 161;
}

export function calculateNutritionTargets(input: NutritionProfileInput): NutritionTargets {
  const bmr = calculateMifflinStJeorBmr(input);
  const maintenanceCalories = bmr * ACTIVITY_MULTIPLIER;
  const calories = Math.max(1200, Math.round(maintenanceCalories + GOAL_ADJUSTMENTS[input.goal]));
  const proteinGrams = Math.round(input.weightKg * PROTEIN_MULTIPLIER[input.goal]);
  const fatGrams = Math.round((calories * FAT_RATIO[input.goal]) / 9);
  const proteinCalories = proteinGrams * 4;
  const fatCalories = fatGrams * 9;
  const carbGrams = Math.max(0, Math.round((calories - proteinCalories - fatCalories) / 4));

  return {
    calories,
    proteinGrams,
    fatGrams,
    carbGrams,
    bmr: Math.round(bmr),
  };
}

export function getGoalLabel(goal: GoalType | null | undefined) {
  switch (goal) {
    case GoalType.LOSE_WEIGHT:
      return "Снижение веса";
    case GoalType.GAIN_WEIGHT:
      return "Набор веса";
    case GoalType.MAINTAIN:
      return "Поддержание";
    default:
      return "Не выбрано";
  }
}

export function getGenderLabel(gender: Gender | null | undefined) {
  switch (gender) {
    case Gender.MALE:
      return "Мужской";
    case Gender.FEMALE:
      return "Женский";
    default:
      return "Не указан";
  }
}
