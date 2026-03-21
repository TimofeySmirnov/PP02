-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('LOSE_WEIGHT', 'MAINTAIN', 'GAIN_WEIGHT');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "gender" "Gender",
ADD COLUMN     "goal" "GoalType";
