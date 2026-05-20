import { redirect } from "next/navigation";
import prisma from "../db";
import { getCurrentUser } from "./dashboard";
import { serializeExpense } from "../serialize";
import { getMonthDateRange } from "../dateFilters";

export async function getExpensesPageData({ month, year }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const { start, end } = getMonthDateRange({ month, year });

  const expenses = await prisma.expense.findMany({
    where: {
      budget: { userId: user.id },
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    include: { budget: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    expenses: expenses.map((expense) =>
      serializeExpense(expense, expense.budget)
    ),
  };
}
