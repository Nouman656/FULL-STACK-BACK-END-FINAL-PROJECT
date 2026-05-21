import prisma from "../db";
import { getUserId } from "../session";
import { getOrCreateMonthPlan, toNumber } from "../monthPlan";
import { serializeBudget, serializeExpense } from "../serialize";

export async function getCurrentUser() {
  const userId = await getUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, salary: true, baseSalary: true },
  });
}

export async function getDashboardData({ mode, month, year }) {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      budgets: [],
      expenses: [],
      baseSalary: 0,
      monthSalary: 0,
      totalBudgeted: 0,
      remainingSalary: 0,
      month,
      year,
      mode,
    };
  }

  const monthPlan = await getOrCreateMonthPlan(user.id, month, year);

  const budgets = await prisma.budget.findMany({
    where: { monthPlanId: monthPlan.id },
    orderBy: { createdAt: "asc" },
  });

  const budgetIds = budgets.map((budget) => budget.id);
  const spentByBudget = {};

  if (budgetIds.length > 0) {
    const aggregates = await prisma.expense.groupBy({
      by: ["budgetId"],
      where: { budgetId: { in: budgetIds } },
      _sum: { amount: true },
    });

    for (const row of aggregates) {
      spentByBudget[row.budgetId] = toNumber(row._sum.amount);
    }
  }

  const expenses =
    budgetIds.length > 0
      ? await prisma.expense.findMany({
          where: { budgetId: { in: budgetIds } },
          include: { budget: true },
          orderBy: { createdAt: "desc" },
        })
      : [];

  const monthlySalary = toNumber(monthPlan.salarySnapshot);
  const totalBudgeted = budgets.reduce(
    (sum, budget) => sum + toNumber(budget.amount),
    0
  );
  const remainingSalary = monthlySalary - totalBudgeted;

  return {
    user,
    month,
    year,
    mode,
    monthPlanId: monthPlan.id,
    baseSalary: toNumber(user.baseSalary),
    monthSalary: monthlySalary,
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
