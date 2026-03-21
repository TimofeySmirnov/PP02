import { MealType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getTodayDateStart, getMealTypeLabel } from "@/lib/meals/utils";

export async function getTodayMeals(userId: string) {
  const dayStart = getTodayDateStart();

  const meals = await prisma.meal.findMany({
    where: {
      userId,
      loggedAt: dayStart,
    },
    include: {
      entries: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const mealsByType = Object.values(MealType).map((mealType) => {
    const meal = meals.find((item) => item.mealType === mealType);

    return {
      mealType,
      title: getMealTypeLabel(mealType),
      meal,
    };
  });

  const dailyTotals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.totalKcal ?? 0),
      protein: acc.protein + (meal.totalProtein ?? 0),
      carbs: acc.carbs + (meal.totalCarbs ?? 0),
      fat: acc.fat + (meal.totalFat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return {
    mealsByType,
    dailyTotals,
  };
}
