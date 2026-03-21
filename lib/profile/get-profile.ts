import { prisma } from "@/lib/prisma";

export async function getUserProfile(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
  });
}
