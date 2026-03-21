"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth/session";
import { calculateNutritionTargets } from "@/lib/nutrition/calculations";
import { prisma } from "@/lib/prisma";
import {
  EMPTY_BODY_METRIC_STATE,
  type BodyMetricFormState,
  validateBodyMetricInput,
} from "@/lib/body-metrics/validation";

export async function saveBodyMetricAction(
  _prevState: BodyMetricFormState,
  formData: FormData,
): Promise<BodyMetricFormState> {
  const session = await requireSession();
  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    select: {
      gender: true,
      age: true,
      heightCm: true,
      goal: true,
    },
  });

  if (!profile?.gender || !profile.age || !profile.heightCm || !profile.goal) {
    return {
      errors: {
        form: "Сначала заполните профиль, чтобы рассчитывать цели и прогресс.",
      },
    };
  }

  const result = validateBodyMetricInput({
    weightKg: String(formData.get("weightKg") ?? ""),
    bodyFatPercent: String(formData.get("bodyFatPercent") ?? ""),
    waistCm: String(formData.get("waistCm") ?? ""),
    hipsCm: String(formData.get("hipsCm") ?? ""),
    chestCm: String(formData.get("chestCm") ?? ""),
  });

  if (!result.values) {
    return { errors: result.errors };
  }

  const targets = calculateNutritionTargets({
    gender: profile.gender,
    age: profile.age,
    heightCm: profile.heightCm,
    goal: profile.goal,
    weightKg: result.values.weightKg,
  });

  const loggedAt = new Date();
  loggedAt.setHours(0, 0, 0, 0);

  await prisma.$transaction([
    prisma.bodyMetric.upsert({
      where: {
        userId_loggedAt: {
          userId: session.userId,
          loggedAt,
        },
      },
      update: {
        weightKg: result.values.weightKg,
        bodyFatPercent: result.values.bodyFatPercent,
        waistCm: result.values.waistCm,
        hipsCm: result.values.hipsCm,
        chestCm: result.values.chestCm,
        targetCalories: targets.calories,
        targetProtein: targets.proteinGrams,
        targetFat: targets.fatGrams,
        targetCarbs: targets.carbGrams,
      },
      create: {
        userId: session.userId,
        loggedAt,
        weightKg: result.values.weightKg,
        bodyFatPercent: result.values.bodyFatPercent,
        waistCm: result.values.waistCm,
        hipsCm: result.values.hipsCm,
        chestCm: result.values.chestCm,
        targetCalories: targets.calories,
        targetProtein: targets.proteinGrams,
        targetFat: targets.fatGrams,
        targetCarbs: targets.carbGrams,
      },
    }),
    prisma.profile.update({
      where: { userId: session.userId },
      data: {
        weightKg: result.values.weightKg,
        dailyCalorieGoal: targets.calories,
        dailyProteinGoal: targets.proteinGrams,
        dailyFatGoal: targets.fatGrams,
        dailyCarbGoal: targets.carbGrams,
      },
    }),
  ]);

  revalidatePath("/analytics");
  revalidatePath("/dashboard");
  revalidatePath("/profile");

  return {
    errors: {},
    success: "Показатели сохранены.",
  };
}
