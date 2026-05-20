import { notFound } from "next/navigation";
import prisma from "../db";
import { getUserId } from "../session";
import { serializeBudget, serializeExpense } from "../serialize";
import { getMonthDateRange } from "../dateFilters";

export async function getBudgetPageData(budgetId, { month, year }) {
  const userId = await getUserId();
  if (!userId) {
    notFound();
  }

  const budget = await prisma.budget.findFirst({
    where: { id: budgetId, userId },
  });

  if (!budget) {
    notFound();
  }

  const { start, end } = getMonthDateRange({ month, year });

  const [expenses, spentAggregate] = await Promise.all([
    prisma.expense.findMany({
      where: {
        budgetId: budget.id,
        createdAt: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.expense.aggregate({
      where: {
        budgetId: budget.id,
        createdAt: {
          gte: start,
          lt: end,
        },
      },
      _sum: { amount: true },
    }),
  ]);

  return {
    budget: {
      ...serializeBudget(budget),
      spent: Number(spentAggregate._sum.amount ?? 0),
    },
    expenses: expenses.map((expense) => serializeExpense(expense, budget)),
  };
}
