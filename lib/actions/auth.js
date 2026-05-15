"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "../db";
import { setUserId } from "../session";

/**
 * Create account (name only; salary defaults in DB).
 * Form field: userName
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

  try {
    const existing = await prisma.user.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existing) {
      return { error: "An account with this name already exists." };
    }

    const user = await prisma.user.create({
      data: { name },
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
