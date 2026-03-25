import { prisma } from "@/lib/prisma";
import { searchProductsFromOpenFoodFacts } from "@/lib/products/food-api-service";

async function searchProductsInDatabase(query: string, userId?: string) {
  return prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
      OR: [{ createdByUserId: null }, { createdByUserId: userId }],
    },
    orderBy: [{ isCustom: "desc" }, { name: "asc" }],
    take: 8,
    select: {
      id: true,
      name: true,
      caloriesPer100g: true,
      proteinPer100g: true,
      carbsPer100g: true,
      fatPer100g: true,
      isCustom: true,
    },
  });
}

async function cacheFetchedProducts(userId: string | undefined, query: string) {
  try {
    const externalProducts = await searchProductsFromOpenFoodFacts(query);

    for (const product of externalProducts) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: product.name,
          caloriesPer100g: product.caloriesPer100g,
          proteinPer100g: product.proteinPer100g,
          carbsPer100g: product.carbsPer100g,
          fatPer100g: product.fatPer100g,
          createdByUserId: null,
        },
        select: { id: true },
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            ...product,
            isCustom: false,
          },
        });
      }
    }

    return await searchProductsInDatabase(query, userId);
  } catch (error) {
    console.error("Open Food Facts fallback failed:", error);
    return await searchProductsInDatabase(query, userId);
  }
}

export async function searchProducts(query: string, userId?: string) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const localProducts = await searchProductsInDatabase(normalizedQuery, userId);

  try {
    const externalProducts =
      await searchProductsFromOpenFoodFacts(normalizedQuery);
      console.log(externalProducts)

    for (const product of externalProducts) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: product.name,
          caloriesPer100g: product.caloriesPer100g,
          proteinPer100g: product.proteinPer100g,
          carbsPer100g: product.carbsPer100g,
          fatPer100g: product.fatPer100g,
          createdByUserId: null,
        },
        select: { id: true },
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            ...product,
            isCustom: false,
          },
        });
      }
    }

    const refreshedProducts = await searchProductsInDatabase(
      normalizedQuery,
      userId,
    );

    return refreshedProducts;
  } catch (error) {
    console.error("Open Food Facts fetch failed:", error);
    return localProducts;
  }
}
