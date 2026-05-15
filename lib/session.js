import { cookies } from "next/headers";

const USER_ID_COOKIE = "userId";

export async function getUserId() {
  const cookieStore = await cookies();
  return cookieStore.get(USER_ID_COOKIE)?.value ?? null;
}

export async function setUserId(userId) {
  const cookieStore = await cookies();
  cookieStore.set(USER_ID_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearUserId() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_ID_COOKIE);
}
