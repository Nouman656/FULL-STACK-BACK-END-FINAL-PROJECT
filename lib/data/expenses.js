import { redirect } from "next/navigation";
import prisma from "../db";
import { getCurrentUser } from "./dashboard";
import { serializeExpense } from "../serialize";

export async function getExpensesPageData() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const expenses = await prisma.expense.findMany({
    where: { budget: { userId: user.id } },
    include: { budget: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    expenses: expenses.map((expense) =>
      serializeExpense(expense, expense.budget)
    ),
  };
}
