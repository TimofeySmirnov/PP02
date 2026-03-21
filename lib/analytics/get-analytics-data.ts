import { prisma } from "@/lib/prisma";
import { eachDayBetween, formatAnalyticsDate } from "@/lib/analytics/utils";
import { AnalyticsDay } from "@/lib/analytics/types";

type TargetSnapshot = {
  targetCalories: number | null;
  targetProtein: number | null;
  targetFat: number | null;
  targetCarbs: number | null;
};

export async function getAnalyticsData(userId: string) {
  const [meals, bodyMetrics, profile] = await Promise.all([
    prisma.meal.findMany({
      where: { userId },
      orderBy: { loggedAt: "asc" },
      select: {
        loggedAt: true,
        totalKcal: true,
        totalProtein: true,
        totalFat: true,
        totalCarbs: true,
      },
    }),
    prisma.bodyMetric.findMany({
      where: { userId },
      orderBy: { loggedAt: "asc" },
      select: {
        loggedAt: true,
        weightKg: true,
        bodyFatPercent: true,
        waistCm: true,
        hipsCm: true,
        chestCm: true,
        targetCalories: true,
        targetProtein: true,
        targetFat: true,
        targetCarbs: true,
      },
    }),
    prisma.profile.findUnique({
      where: { userId },
      select: {
        dailyCalorieGoal: true,
        dailyProteinGoal: true,
        dailyFatGoal: true,
        dailyCarbGoal: true,
      },
    }),
  ]);

  const mealMap = new Map<string, { calories: number; protein: number; fat: number; carbs: number }>();

  for (const meal of meals) {
    const key = formatAnalyticsDate(meal.loggedAt);
    const current = mealMap.get(key) ?? { calories: 0, protein: 0, fat: 0, carbs: 0 };

    mealMap.set(key, {
      calories: current.calories + (meal.totalKcal ?? 0),
      protein: current.protein + (meal.totalProtein ?? 0),
      fat: current.fat + (meal.totalFat ?? 0),
      carbs: current.carbs + (meal.totalCarbs ?? 0),
    });
  }

  const bodyMetricMap = new Map<
    string,
    {
      weightKg: number | null;
      bodyFatPercent: number | null;
      waistCm: number | null;
      hipsCm: number | null;
      chestCm: number | null;
    }
  >();
  const targetMap = new Map<string, TargetSnapshot>();

  for (const metric of bodyMetrics) {
    const key = formatAnalyticsDate(metric.loggedAt);

    bodyMetricMap.set(key, {
      weightKg: metric.weightKg,
      bodyFatPercent: metric.bodyFatPercent,
      waistCm: metric.waistCm,
      hipsCm: metric.hipsCm,
      chestCm: metric.chestCm,
    });

    targetMap.set(key, {
      targetCalories: metric.targetCalories,
      targetProtein: metric.targetProtein,
      targetFat: metric.targetFat,
      targetCarbs: metric.targetCarbs,
    });
  }

  const earliestMeal = meals[0]?.loggedAt;
  const earliestMetric = bodyMetrics[0]?.loggedAt;
  const startDate =
    earliestMeal && earliestMetric
      ? new Date(Math.min(earliestMeal.getTime(), earliestMetric.getTime()))
      : earliestMeal || earliestMetric || new Date();

  const dateRange = eachDayBetween(startDate, new Date());
  const lastMetric = bodyMetrics[bodyMetrics.length - 1];
  let rollingTarget: TargetSnapshot = {
    targetCalories: null,
    targetProtein: null,
    targetFat: null,
    targetCarbs: null,
  };

  const currentProfileTargets: TargetSnapshot = {
    targetCalories: profile?.dailyCalorieGoal ?? null,
    targetProtein: profile?.dailyProteinGoal ?? null,
    targetFat: profile?.dailyFatGoal ?? null,
    targetCarbs: profile?.dailyCarbGoal ?? null,
  };

  const days: AnalyticsDay[] = dateRange.map((date) => {
    const mealsForDay = mealMap.get(date) ?? { calories: 0, protein: 0, fat: 0, carbs: 0 };
    const metricForDay = bodyMetricMap.get(date);
    const targetForDay = targetMap.get(date);

    if (targetForDay) {
      rollingTarget = targetForDay;
    }

    return {
      date,
      consumedCalories: mealsForDay.calories,
      targetCalories: rollingTarget.targetCalories ?? currentProfileTargets.targetCalories,
      protein: mealsForDay.protein,
      fat: mealsForDay.fat,
      carbs: mealsForDay.carbs,
      weightKg: metricForDay?.weightKg ?? null,
      bodyFatPercent: metricForDay?.bodyFatPercent ?? null,
    };
  });

  return {
    days,
    hasMealData: meals.length > 0,
    hasBodyData: bodyMetrics.length > 0,
    latestMeasurements: {
      waistCm: lastMetric?.waistCm ?? null,
      hipsCm: lastMetric?.hipsCm ?? null,
      chestCm: lastMetric?.chestCm ?? null,
    },
  };
}
