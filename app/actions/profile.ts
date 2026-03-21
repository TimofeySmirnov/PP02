"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth/session";
import { calculateNutritionTargets } from "@/lib/nutrition/calculations";
import { prisma } from "@/lib/prisma";
import {
  type ProfileFormState,
  validateProfileInput,
} from "@/lib/profile/validation";

export async function saveProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await requireSession();

  const result = validateProfileInput({
    displayName: String(formData.get("displayName") ?? ""),
    gender: String(formData.get("gender") ?? ""),
    age: String(formData.get("age") ?? ""),
    weightKg: String(formData.get("weightKg") ?? ""),
    heightCm: String(formData.get("heightCm") ?? ""),
    goal: String(formData.get("goal") ?? ""),
  });

  if (!result.values) {
    return { errors: result.errors };
  }

  const targets = calculateNutritionTargets(result.values);
  const loggedAt = new Date();
  loggedAt.setHours(0, 0, 0, 0);

  await prisma.$transaction([
    prisma.profile.upsert({
      where: { userId: session.userId },
      update: {
        displayName: result.values.displayName,
        gender: result.values.gender,
        age: result.values.age,
        weightKg: result.values.weightKg,
        heightCm: result.values.heightCm,
        goal: result.values.goal,
        dailyCalorieGoal: targets.calories,
        dailyProteinGoal: targets.proteinGrams,
        dailyFatGoal: targets.fatGrams,
        dailyCarbGoal: targets.carbGrams,
      },
      create: {
        userId: session.userId,
        displayName: result.values.displayName,
        gender: result.values.gender,
        age: result.values.age,
        weightKg: result.values.weightKg,
        heightCm: result.values.heightCm,
        goal: result.values.goal,
        dailyCalorieGoal: targets.calories,
        dailyProteinGoal: targets.proteinGrams,
        dailyFatGoal: targets.fatGrams,
        dailyCarbGoal: targets.carbGrams,
      },
    }),
    prisma.bodyMetric.upsert({
      where: {
        userId_loggedAt: {
          userId: session.userId,
          loggedAt,
        },
      },
      update: {
        weightKg: result.values.weightKg,
        targetCalories: targets.calories,
        targetProtein: targets.proteinGrams,
        targetFat: targets.fatGrams,
        targetCarbs: targets.carbGrams,
      },
      create: {
        userId: session.userId,
        loggedAt,
        weightKg: result.values.weightKg,
        targetCalories: targets.calories,
        targetProtein: targets.proteinGrams,
        targetFat: targets.fatGrams,
        targetCarbs: targets.carbGrams,
      },
    }),
  ]);

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");

  return {
    errors: {},
    success: "Профиль сохранен, цели питания обновлены.",
  };
}
