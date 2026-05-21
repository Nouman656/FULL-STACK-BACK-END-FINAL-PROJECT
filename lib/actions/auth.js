"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "../db";
import { getCurrentMonthYear } from "../monthPlan";
import { setUserId } from "../session";

/**
 * Create account (name + salary).
 * Form fields: userName, salary
 */
export async function createAccount(prevState, formData) {
  const raw = formData.get("userName");

  if (!raw || typeof raw !== "string") {
    return { error: "Please enter your name." };
  }

  const name = raw.trim();
  if (!name) {
    return { error: "Please enter your name." };
  }

  const salaryRaw = formData.get("salary");
  if (salaryRaw === null || salaryRaw === undefined || salaryRaw === "") {
    return { error: "Please enter your salary." };
  }

  const salary = Number(salaryRaw);
  if (Number.isNaN(salary) || salary < 0) {
    return { error: "Salary must be a number greater than or equal to 0." };
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existing) {
      return { error: "An account with this name already exists." };
    }

    const { month, year } = getCurrentMonthYear();

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name,
          salary,
          baseSalary: salary,
        },
      });

      await tx.monthPlan.create({
        data: {
          userId: created.id,
          year,
          month,
          salarySnapshot: salary,
        },
      });

      return created;
    });

    await setUserId(user.id);
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "There was a problem creating your account." };
  }
}

/**
 * Login by name (case-insensitive).
 * Form field: userName
 */
export async function login(prevState, formData) {
  const raw = formData.get("userName");

  if (!raw || typeof raw !== "string") {
    return { error: "Please enter your name." };
  }

  const name = raw.trim();
  if (!name) {
    return { error: "Please enter your name." };
  }

  const user = await prisma.user.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });

  if (!user) {
    return { error: "No account with this name" };
  }

  try {
    await setUserId(user.id);
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "There was a problem signing in." };
  }
}
