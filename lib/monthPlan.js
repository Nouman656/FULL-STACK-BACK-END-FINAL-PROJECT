import prisma from "./db";
import {
  getCurrentMonthYear,
  getMonthDateRange,
  parseMonthYear,
} from "./dateFilters";

export { getCurrentMonthYear, getMonthDateRange, parseMonthYear };

/**
 * Find or create the MonthPlan for a user and calendar month.
 * New plans use User.baseSalary as salarySnapshot.
 */
export async function getOrCreateMonthPlan(userId, month, year) {
  const safeMonth = Number(month);
  const safeYear = Number(year);

  const existing = await prisma.monthPlan.findUnique({
    where: {
      userId_year_month: {
        userId,
        year: safeYear,
        month: safeMonth,
      },
    },
  });

  if (existing) {
    return existing;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { baseSalary: true },
  });

  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  return prisma.monthPlan.create({
    data: {
      userId,
      year: safeYear,
      month: safeMonth,
      salarySnapshot: user.baseSalary,
    },
  });
}

export function toNumber(value) {
  return Number(value ?? 0);
}
