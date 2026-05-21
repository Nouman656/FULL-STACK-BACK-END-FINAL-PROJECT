import prisma from "../db";

export async function generateRandomColor(monthPlanId) {
  const count = await prisma.budget.count({ where: { monthPlanId } });
  return `${count * 34} 65% 50%`;
}
