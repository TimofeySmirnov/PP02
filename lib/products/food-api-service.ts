type OpenFoodFactsProduct = {
  product_name?: string;
  product_name_en?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
};

export type NormalizedProduct = {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
};

function normalizeApiProduct(product: OpenFoodFactsProduct): NormalizedProduct | null {
  const name = product.product_name?.trim() || product.product_name_en?.trim();
  const caloriesPer100g = product.nutriments?.["energy-kcal_100g"];
  const proteinPer100g = product.nutriments?.proteins_100g;
  const carbsPer100g = product.nutriments?.carbohydrates_100g;
  const fatPer100g = product.nutriments?.fat_100g;

  if (!name) {
    return null;
  }

  if (
    caloriesPer100g == null ||
    proteinPer100g == null ||
    carbsPer100g == null ||
    fatPer100g == null
  ) {
    return null;
  }

  return {
    name,
    caloriesPer100g: Math.max(0, Math.round(caloriesPer100g)),
    proteinPer100g: Math.max(0, Math.round(proteinPer100g)),
    carbsPer100g: Math.max(0, Math.round(carbsPer100g)),
    fatPer100g: Math.max(0, Math.round(fatPer100g)),
  };
}

export async function searchProductsFromOpenFoodFacts(query: string): Promise<NormalizedProduct[]> {
  const normalizedQuery = query.trim();
  console.log('open api')

  if (!normalizedQuery) {
    return [];
  }

  const url =
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(normalizedQuery)}` +
    "&search_simple=1&action=process&json=1&page_size=8" +
    "&fields=product_name,product_name_en,nutriments";

  const response = await fetch(url, {
    headers: {
      "User-Agent": "LifeSumTrackerStudentProject/1.0",
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error(`Не удалось загрузить продукты. Статус ошибки ${response.status}`);
  }

  const data = (await response.json()) as {
    products?: OpenFoodFactsProduct[];
  };

  const seen = new Set<string>();

  return (data.products ?? [])
    .map(normalizeApiProduct)
    .filter((product): product is NormalizedProduct => product !== null)
    .filter((product) => {
      const key = `${product.name.toLowerCase()}-${product.caloriesPer100g}-${product.proteinPer100g}-${product.carbsPer100g}-${product.fatPer100g}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .slice(0, 8);
}
