"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "../db";
import { getUserId } from "../session";
import { rejectSearchMode } from "./guards";

export async function deleteBudget(prevState, formData) {
  const searchError = rejectSearchMode(formData);
  if (searchError) return searchError;

  const userId = await getUserId();
  if (!userId) {
    return { error: "Please create an account first." };
  }

  const budgetId = formData.get("budgetId");
  if (!budgetId || typeof budgetId !== "string") {
    return { error: "Budget not found." };
  }

  try {
    const budget = await prisma.budget.findFirst({
      where: { id: budgetId },
      include: { monthPlan: true },
    });

    if (!budget?.monthPlan || budget.monthPlan.userId !== userId) {
      return { error: "Budget not found." };
    }

    await prisma.budget.delete({
      where: { id: budgetId },
    });

    revalidatePath("/");
    redirect("/");
  } catch (error) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "There was a problem deleting your budget." };
  }
}
