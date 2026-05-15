"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "../db";
import { getUserId } from "../session";

export async function deleteBudget(prevState, formData) {
  const userId = await getUserId();
  if (!userId) {
    return { error: "Please create an account first." };
  }

  const budgetId = formData.get("budgetId");
  if (!budgetId || typeof budgetId !== "string") {
    return { error: "Budget not found." };
  }

  try {
    const result = await prisma.budget.deleteMany({
      where: { id: budgetId, userId },
    });

    if (result.count === 0) {
      return { error: "Budget not found." };
    }

    revalidatePath("/");
    redirect("/");
  } catch (error) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "There was a problem deleting your budget." };
  }
}
