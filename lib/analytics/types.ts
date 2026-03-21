export type AnalyticsDay = {
  date: string;
  consumedCalories: number;
  targetCalories: number | null;
  protein: number;
  fat: number;
  carbs: number;
  weightKg: number | null;
  bodyFatPercent: number | null;
};

export type AdherenceMetrics = {
  adherencePercent: number;
  currentStreak: number;
  averageCalorieDeviation: number;
  trackedDays: number;
};
