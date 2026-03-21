"use server";

import { revalidatePath } from "next/cache";
import { MealType } from "@prisma/client";

import { requireSession } from "@/lib/auth/session";
import { calculateNutrientsForGrams } from "@/lib/meals/calculations";
import {
  EMPTY_MEAL_LOG_STATE,
  isMealType,
  type MealLogState,
  validateGrams,
  validateNutrientPer100g,
} from "@/lib/meals/validation";
import { getTodayDateStart, getMealTypeLabel } from "@/lib/meals/utils";
import { prisma } from "@/lib/prisma";

function getMode(value: FormDataEntryValue | null) {
  return value === "manual" ? "manual" : "database";
}

export async function logMealEntryAction(
  _prevState: MealLogState,
  formData: FormData,
): Promise<MealLogState> {
  const session = await requireSession();
  const mealTypeValue = String(formData.get("mealType") ?? "");
  const mode = getMode(formData.get("mode"));
  const grams = validateGrams(String(formData.get("grams") ?? ""));

  if (!isMealType(mealTypeValue)) {
    return {
      errors: {
        form: "Не удалось определить тип приема пищи.",
      },
    };
  }

  if (grams == null) {
    return {
      errors: {
        grams: "Укажите граммы в диапазоне от 1 до 2000.",
      },
    };
  }

  const mealType = mealTypeValue as MealType;
  const dayStart = getTodayDateStart();

  const result = await prisma.$transaction(async (tx) => {
    let productId: string | null = null;
    let foodName = "";
    let nutrientsPer100g: {
      caloriesPer100g: number;
      proteinPer100g: number;
      carbsPer100g: number;
      fatPer100g: number;
    };

    if (mode === "database") {
      const selectedProductId = String(formData.get("productId") ?? "").trim();

      if (!selectedProductId) {
        return {
          errors: {
            query: "Выберите продукт из списка.",
          },
        };
      }

      const product = await tx.product.findFirst({
        where: {
          id: selectedProductId,
          OR: [{ createdByUserId: null }, { createdByUserId: session.userId }],
        },
      });

      if (!product) {
        return {
          errors: {
            query: "Продукт не найден в локальной базе.",
          },
        };
      }

      productId = product.id;
      foodName = product.name;
      nutrientsPer100g = {
        caloriesPer100g: product.caloriesPer100g,
        proteinPer100g: product.proteinPer100g,
        carbsPer100g: product.carbsPer100g,
        fatPer100g: product.fatPer100g,
      };
    } else {
      const name = String(formData.get("name") ?? "").trim();
      const caloriesPer100g = validateNutrientPer100g(String(formData.get("caloriesPer100g") ?? ""));
      const proteinPer100g = validateNutrientPer100g(String(formData.get("proteinPer100g") ?? ""));
      const carbsPer100g = validateNutrientPer100g(String(formData.get("carbsPer100g") ?? ""));
      const fatPer100g = validateNutrientPer100g(String(formData.get("fatPer100g") ?? ""));

      if (!name) {
        return {
          errors: {
            name: "Введите название продукта.",
          },
        };
      }

      if (caloriesPer100g == null || proteinPer100g == null || carbsPer100g == null || fatPer100g == null) {
        return {
          errors: {
            caloriesPer100g: caloriesPer100g == null ? "Укажите корректные калории." : undefined,
            proteinPer100g: proteinPer100g == null ? "Укажите корректный белок." : undefined,
            carbsPer100g: carbsPer100g == null ? "Укажите корректные углеводы." : undefined,
            fatPer100g: fatPer100g == null ? "Укажите корректные жиры." : undefined,
          },
        };
      }

      const customProduct = await tx.product.create({
        data: {
          name,
          caloriesPer100g,
          proteinPer100g,
          carbsPer100g,
          fatPer100g,
          isCustom: true,
          createdByUserId: session.userId,
        },
      });

      productId = customProduct.id;
      foodName = customProduct.name;
      nutrientsPer100g = {
        caloriesPer100g: customProduct.caloriesPer100g,
        proteinPer100g: customProduct.proteinPer100g,
        carbsPer100g: customProduct.carbsPer100g,
        fatPer100g: customProduct.fatPer100g,
      };
    }

    const nutrients = calculateNutrientsForGrams(nutrientsPer100g, grams);

    const meal = await tx.meal.upsert({
      where: {
        userId_mealType_loggedAt: {
          userId: session.userId,
          mealType,
          loggedAt: dayStart,
        },
      },
      update: {},
      create: {
        userId: session.userId,
        mealType,
        loggedAt: dayStart,
        name: getMealTypeLabel(mealType),
      },
    });

    await tx.mealEntry.create({
      data: {
        mealId: meal.id,
        productId,
        foodName,
        grams,
        calories: nutrients.calories,
        protein: nutrients.protein,
        carbs: nutrients.carbs,
        fat: nutrients.fat,
      },
    });

    const totals = await tx.mealEntry.aggregate({
      where: {
        mealId: meal.id,
      },
      _sum: {
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
      },
    });

    await tx.meal.update({
      where: { id: meal.id },
      data: {
        totalKcal: totals._sum.calories ?? 0,
        totalProtein: totals._sum.protein ?? 0,
        totalCarbs: totals._sum.carbs ?? 0,
        totalFat: totals._sum.fat ?? 0,
      },
    });

    return {
      errors: {},
      success: `${foodName} добавлен в раздел "${getMealTypeLabel(mealType)}".`,
    };
  });

  if (!Object.keys(result.errors).length) {
    revalidatePath("/meals");
    revalidatePath("/dashboard");
  }

  return result;
}
