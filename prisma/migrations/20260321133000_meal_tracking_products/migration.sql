-- AlterTable
ALTER TABLE "MealEntry" ADD COLUMN     "grams" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "productId" TEXT;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "caloriesPer100g" INTEGER NOT NULL,
    "proteinPer100g" INTEGER NOT NULL,
    "carbsPer100g" INTEGER NOT NULL,
    "fatPer100g" INTEGER NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_createdByUserId_idx" ON "Product"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Meal_userId_mealType_loggedAt_key" ON "Meal"("userId", "mealType", "loggedAt");

-- CreateIndex
CREATE INDEX "MealEntry_productId_idx" ON "MealEntry"("productId");

-- AddForeignKey
ALTER TABLE "MealEntry" ADD CONSTRAINT "MealEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

