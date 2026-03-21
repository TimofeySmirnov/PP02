export type NutrientsPer100g = {
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
};

export type LoggedNutrients = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function calculateNutrientsForGrams(input: NutrientsPer100g, grams: number): LoggedNutrients {
  const ratio = grams / 100;

  return {
    calories: Math.round(input.caloriesPer100g * ratio),
    protein: Math.round(input.proteinPer100g * ratio),
    carbs: Math.round(input.carbsPer100g * ratio),
    fat: Math.round(input.fatPer100g * ratio),
  };
}
