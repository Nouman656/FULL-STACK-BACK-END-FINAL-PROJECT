import { redirect } from "next/navigation";
import prisma from "../db";
import { getCurrentUser } from "./dashboard";
import { getOrCreateMonthPlan } from "../monthPlan";
import { serializeExpense } from "../serialize";

export async function getExpensesPageData({ month, year }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const monthPlan = await getOrCreateMonthPlan(user.id, month, year);

  const expenses = await prisma.expense.findMany({
    where: {
      budget: { monthPlanId: monthPlan.id },
    },
    include: { budget: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    month,
    year,
    monthPlanId: monthPlan.id,
    expenses: expenses.map((expense) =>
      serializeExpense(expense, expense.budget)
    ),
  };
}
