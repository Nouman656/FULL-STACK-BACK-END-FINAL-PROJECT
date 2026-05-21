import { notFound } from "next/navigation";
import prisma from "../db";
import { getUserId } from "../session";
import { toNumber } from "../monthPlan";
import { serializeBudget, serializeExpense } from "../serialize";

export async function getBudgetPageData(budgetId) {
  const userId = await getUserId();
  if (!userId) {
    notFound();
  }

  const budget = await prisma.budget.findFirst({
    where: { id: budgetId },
    include: { monthPlan: true },
  });

  if (!budget?.monthPlan || budget.monthPlan.userId !== userId) {
    notFound();
  }

  const [expenses, spentAggregate] = await Promise.all([
    prisma.expense.findMany({
      where: { budgetId: budget.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.expense.aggregate({
      where: { budgetId: budget.id },
      _sum: { amount: true },
    }),
  ]);

  const spent = toNumber(spentAggregate._sum.amount);
  const amount = toNumber(budget.amount);
  const remaining = amount - spent;

  return {
    month: budget.monthPlan.month,
    year: budget.monthPlan.year,
    monthPlanId: budget.monthPlan.id,
    budget: {
      ...serializeBudget(budget),
      spent,
      remaining,
    },
    expenses: expenses.map((expense) => serializeExpense(expense, budget)),
  };
}
