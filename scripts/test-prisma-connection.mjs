/**
 * Read-only Prisma connection test against local PostgreSQL (no writes).
 * Run: npm run db:test
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, createdAt: true },
  });

  console.log("[prisma-test] Connection OK");
  console.log("[prisma-test] user.findMany() count:", users.length);
  if (users.length > 0) {
    console.log("[prisma-test] Sample (id + name only):", users.slice(0, 5));
  }
}

main()
  .catch((err) => {
    console.error("[prisma-test] FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
