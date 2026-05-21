"use server";

import { revalidatePath } from "next/cache";
import prisma from "../db";
import { getOrCreateMonthPlan, toNumber } from "../monthPlan";
import { getUserId } from "../session";
import { generateRandomColor } from "../utils/colors";
import { parseFormMonthYear, rejectSearchMode } from "./guards";

export async function updateSalary(prevState, formData) {
  const searchError = rejectSearchMode(formData);
  if (searchError) return searchError;

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
    const { month, year } = parseFormMonthYear(formData);
    const monthPlan = await getOrCreateMonthPlan(userId, month, year);

    const budgetTotals = await prisma.budget.aggregate({
      where: { monthPlanId: monthPlan.id },
      _sum: { amount: true },
    });
    const totalBudgeted = toNumber(budgetTotals._sum.amount);

    if (salary < totalBudgeted) {
      return { error: "Salary cannot be lower than total budgeted" };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { salary, baseSalary: salary },
      }),
      prisma.monthPlan.update({
        where: { id: monthPlan.id },
        data: { salarySnapshot: salary },
      }),
    ]);

    revalidatePath("/");
    return { success: true, message: "Salary updated!" };
  } catch {
    return { error: "There was a problem updating your salary." };
  }
}

export async function createBudget(prevState, formData) {
  const searchError = rejectSearchMode(formData);
  if (searchError) return searchError;

  const userId = await getUserId();
  if (!userId) {
    return { error: "Please create an account first." };
  }

  const name = formData.get("newBudget");
  const amount = formData.get("newBudgetAmount");

  if (!name || typeof name !== "string" || !amount) {
    return { error: "Budget name and amount are required." };
  }

  const newBudgetAmount = Number(amount);
  if (Number.isNaN(newBudgetAmount) || newBudgetAmount < 0) {
    return { error: "Budget amount must be a valid number." };
  }

  try {
    const { month, year } = parseFormMonthYear(formData);
    const monthPlan = await getOrCreateMonthPlan(userId, month, year);

    const budgetTotals = await prisma.budget.aggregate({
      where: { monthPlanId: monthPlan.id },
      _sum: { amount: true },
    });
    const totalBudgeted = toNumber(budgetTotals._sum.amount);
    const remainingSalary = toNumber(monthPlan.salarySnapshot) - totalBudgeted;

    if (newBudgetAmount > remainingSalary) {
      return { error: "Budget amount exceeds remaining salary" };
    }

    const color = await generateRandomColor(monthPlan.id);
    await prisma.budget.create({
      data: {
        name: String(name).trim(),
        amount: newBudgetAmount,
        color,
        monthPlanId: monthPlan.id,
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
  const searchError = rejectSearchMode(formData);
  if (searchError) return searchError;

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
      where: { id: String(budgetId) },
      include: { monthPlan: true },
    });

    if (!budget?.monthPlan || budget.monthPlan.userId !== userId) {
      return { error: "Invalid budget selected." };
    }

    const expenseAmount = Number(amount);
    if (Number.isNaN(expenseAmount) || expenseAmount < 0) {
      return { error: "Expense amount must be a valid number." };
    }

    const spentTotals = await prisma.expense.aggregate({
      where: { budgetId: budget.id },
      _sum: { amount: true },
    });

    const budgetAmount = toNumber(budget.amount);
    const spent = toNumber(spentTotals._sum.amount);
    const budgetRemaining = budgetAmount - spent;

    if (expenseAmount > budgetRemaining) {
      return { error: "Expense amount exceeds remaining budget" };
    }

    await prisma.expense.create({
      data: {
        name: String(name).trim(),
        amount: expenseAmount,
        budgetId: budget.id,
      },
    });
    revalidatePath("/");
    revalidatePath("/expenses");
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
  const searchError = rejectSearchMode(formData);
  if (searchError) return searchError;

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
      where: { id: expenseId },
      include: {
        budget: {
          include: { monthPlan: true },
        },
      },
    });

    if (!expense?.budget?.monthPlan || expense.budget.monthPlan.userId !== userId) {
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
