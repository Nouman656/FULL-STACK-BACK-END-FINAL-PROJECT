import prisma from "../db";

export async function generateRandomColor(userId) {
  const count = await prisma.budget.count({ where: { userId } });
  return `${count * 34} 65% 50%`;
}
