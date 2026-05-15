import { notFound } from "next/navigation";
import prisma from "../db";
import { getUserId } from "../session";
import { serializeBudget, serializeExpense } from "../serialize";

export async function getBudgetPageData(budgetId) {
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

  return {
    budget: {
      ...serializeBudget(budget),
      spent: Number(spentAggregate._sum.amount ?? 0),
    },
    expenses: expenses.map((expense) => serializeExpense(expense, budget)),
  };
}
