import { Gender, GoalType } from "@prisma/client";

export type ProfileFormErrors = {
  displayName?: string;
  gender?: string;
  age?: string;
  weightKg?: string;
  heightCm?: string;
  goal?: string;
  form?: string;
};

export type ProfileFormState = {
  errors: ProfileFormErrors;
  success?: string;
};

export const EMPTY_PROFILE_STATE: ProfileFormState = {
  errors: {},
};

export type ValidProfileInput = {
  displayName: string;
  gender: Gender;
  age: number;
  weightKg: number;
  heightCm: number;
  goal: GoalType;
};

export function validateProfileInput(input: {
  displayName: string;
  gender: string;
  age: string;
  weightKg: string;
  heightCm: string;
  goal: string;
}): { errors: ProfileFormErrors; values?: ValidProfileInput } {
  const errors: ProfileFormErrors = {};

  const displayName = input.displayName.trim();
  const age = Number(input.age);
  const weightKg = Number(input.weightKg);
  const heightCm = Number(input.heightCm);

  if (!displayName) {
    errors.displayName = "Введите имя.";
  }

  if (!Object.values(Gender).includes(input.gender as Gender)) {
    errors.gender = "Выберите пол.";
  }

  if (!Number.isInteger(age) || age < 14 || age > 100) {
    errors.age = "Возраст должен быть от 14 до 100 лет.";
  }

  if (!Number.isFinite(weightKg) || weightKg < 35 || weightKg > 300) {
    errors.weightKg = "Вес должен быть в диапазоне от 35 до 300 кг.";
  }

  if (!Number.isFinite(heightCm) || heightCm < 130 || heightCm > 250) {
    errors.heightCm = "Рост должен быть в диапазоне от 130 до 250 см.";
  }

  if (!Object.values(GoalType).includes(input.goal as GoalType)) {
    errors.goal = "Выберите цель.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    errors,
    values: {
      displayName,
      gender: input.gender as Gender,
      age,
      weightKg,
      heightCm,
      goal: input.goal as GoalType,
    },
  };
}
