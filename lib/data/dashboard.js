import prisma from "../db";
import { getUserId } from "../session";
import { serializeBudget, serializeExpense } from "../serialize";
import { getMonthDateRange } from "../dateFilters";

export async function getCurrentUser() {
  const userId = await getUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, salary: true },
  });
}

export async function getDashboardData({ mode, month, year }) {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      budgets: [],
      expenses: [],
      totalSalary: 0,
      totalBudgeted: 0,
      remainingSalary: 0,
    };
  }

  const isSearchMode = mode === "search";
  const { start, end } = getMonthDateRange({ month, year });
  const dateRangeWhere = isSearchMode
    ? {
        createdAt: {
          gte: start,
          lt: end,
        },
      }
    : {};

  const [budgets, expenses] = await Promise.all([
    prisma.budget.findMany({
      where: {
        userId: user.id,
        ...dateRangeWhere,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.expense.findMany({
      where: {
        budget: { userId: user.id },
        ...dateRangeWhere,
      },
      include: { budget: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const budgetIds = budgets.map((b) => b.id);
  const spentByBudget = {};

  if (budgetIds.length > 0) {
    const aggregates = await prisma.expense.groupBy({
      by: ["budgetId"],
      where: {
        budgetId: { in: budgetIds },
        ...dateRangeWhere,
      },
      _sum: { amount: true },
    });

    for (const row of aggregates) {
      spentByBudget[row.budgetId] = Number(row._sum.amount ?? 0);
    }
  }

  const totalSalary = Number(user.salary);
  const totalBudgeted = budgets.reduce(
    (sum, budget) => sum + Number(budget.amount),
    0
  );
  const remainingSalary = totalSalary - totalBudgeted;

  return {
    user,
    totalSalary,
    totalBudgeted,
    remainingSalary,
    budgets: budgets.map((budget) => ({
      ...serializeBudget(budget),
      spent: spentByBudget[budget.id] ?? 0,
    })),
    expenses: expenses.map((expense) =>
      serializeExpense(expense, expense.budget)
    ),
  };
}
