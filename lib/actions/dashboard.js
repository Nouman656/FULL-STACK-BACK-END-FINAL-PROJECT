"use server";

import { revalidatePath } from "next/cache";
import prisma from "../db";
import { getUserId } from "../session";
import { generateRandomColor } from "../utils/colors";

export async function updateSalary(prevState, formData) {
  const userId = await getUserId();
  if (!userId) {
    return { error: "Please sign in to update your salary." };
  }

  const raw = formData.get("salary");
  if (raw === null || raw === undefined || raw === "") {
    return { error: "Please enter your salary." };
  }

  const salary = Number(raw);
  if (Number.isNaN(salary) || salary < 0) {
    return { error: "Salary must be a number greater than or equal to 0." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { salary },
    });
    revalidatePath("/");
    return { success: true, message: "Salary updated!" };
  } catch {
    return { error: "There was a problem updating your salary." };
  }
}

export async function createBudget(prevState, formData) {
  const userId = await getUserId();
  if (!userId) {
    return { error: "Please create an account first." };
  }

  const name = formData.get("newBudget");
  const amount = formData.get("newBudgetAmount");

  if (!name || typeof name !== "string" || !amount) {
    return { error: "Budget name and amount are required." };
  }

  try {
    const color = await generateRandomColor(userId);
    await prisma.budget.create({
      data: {
        name: String(name).trim(),
        amount: Number(amount),
        color,
        userId,
      },
    });
    revalidatePath("/");
    return { success: true, message: "Budget created!" };
  } catch {
    return { error: "There was a problem creating your budget." };
  }
}

export async function createExpense(prevState, formData) {
  const userId = await getUserId();
  if (!userId) {
    return { error: "Please create an account first." };
  }

  const name = formData.get("newExpense");
  const amount = formData.get("newExpenseAmount");
  const budgetId = formData.get("newExpenseBudget");

  if (!name || !amount || !budgetId) {
    return { error: "Expense name, amount, and budget are required." };
  }

  try {
    const budget = await prisma.budget.findFirst({
      where: { id: String(budgetId), userId },
    });

    if (!budget) {
      return { error: "Invalid budget selected." };
    }

    await prisma.expense.create({
      data: {
        name: String(name).trim(),
        amount: Number(amount),
        budgetId: budget.id,
      },
    });
    revalidatePath("/");
    revalidatePath(`/budget/${budget.id}`);
    return {
      success: true,
      message: `Expense ${String(name).trim()} created!`,
    };
  } catch {
    return { error: "There was a problem creating your expense." };
  }
}

export async function deleteExpense(prevState, formData) {
  const userId = await getUserId();
  if (!userId) {
    return { error: "Please create an account first." };
  }

  const expenseId = formData.get("expenseId");
  if (!expenseId || typeof expenseId !== "string") {
    return { error: "Expense not found." };
  }

  try {
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        budget: { userId },
      },
      select: { budgetId: true },
    });

    if (!expense) {
      return { error: "Expense not found." };
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    revalidatePath("/");
    revalidatePath("/expenses");
    revalidatePath(`/budget/${expense.budgetId}`);
    return { success: true, message: "Expense deleted!" };
  } catch {
    return { error: "There was a problem deleting your expense." };
  }
}
