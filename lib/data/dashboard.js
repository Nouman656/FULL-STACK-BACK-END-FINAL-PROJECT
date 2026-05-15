import prisma from "../db";
import { getUserId } from "../session";
import { serializeBudget, serializeExpense } from "../serialize";

export async function getCurrentUser() {
  const userId = await getUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true },
  });
}

export async function getDashboardData() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, budgets: [], expenses: [] };
  }

  const [budgets, expenses] = await Promise.all([
    prisma.budget.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.expense.findMany({
      where: { budget: { userId: user.id } },
      include: { budget: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const budgetIds = budgets.map((b) => b.id);
  const spentByBudget = {};

  if (budgetIds.length > 0) {
    const aggregates = await prisma.expense.groupBy({
      by: ["budgetId"],
      where: { budgetId: { in: budgetIds } },
      _sum: { amount: true },
    });

    for (const row of aggregates) {
      spentByBudget[row.budgetId] = Number(row._sum.amount ?? 0);
    }
  }

  return {
    user,
    budgets: budgets.map((budget) => ({
      ...serializeBudget(budget),
      spent: spentByBudget[budget.id] ?? 0,
    })),
    expenses: expenses.map((expense) =>
      serializeExpense(expense, expense.budget)
    ),
  };
}
