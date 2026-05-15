"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "../db";
import { clearUserId, getUserId } from "../session";

export async function logout() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/");
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    await clearUserId();
    revalidatePath("/");
    revalidatePath("/expenses");
    redirect("/");
  } catch (error) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "There was a problem deleting your account." };
  }
}
