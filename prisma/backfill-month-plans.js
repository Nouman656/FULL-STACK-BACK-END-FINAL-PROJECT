/**
 * Phase 1 backfill: create MonthPlan rows from existing budgets and link Budget.monthPlanId.
 * Uses UTC for month/year from budget.createdAt.
 * Safe to re-run (idempotent upserts + only updates budgets missing monthPlanId).
 *
 * Run: node prisma/backfill-month-plans.js
 * Requires: DATABASE_URL in environment (.env)
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function utcMonthYear(date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
  };
}

function periodKey(userId, year, month) {
  return `${userId}:${year}:${month}`;
}

async function syncBaseSalaryFromLegacy(user) {
  const legacySalary = Number(user.salary);
  const currentBase = Number(user.baseSalary);

  if (currentBase === legacySalary) {
    return false;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { baseSalary: user.salary },
  });

  return true;
}

async function backfillForUser(user) {
  const summary = {
    userName: user.name,
    baseSalarySynced: await syncBaseSalaryFromLegacy(user),
    monthPlansCreated: 0,
    monthPlansReused: 0,
    budgetsLinked: 0,
    budgetsAlreadyLinked: 0,
    periods: [],
  };

  const refreshedUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, salary: true, baseSalary: true },
  });

  const budgets = await prisma.budget.findMany({
    where: { userId: user.id },
    select: { id: true, createdAt: true, monthPlanId: true },
    orderBy: { createdAt: "asc" },
  });

  const periodMap = new Map();

  for (const budget of budgets) {
    const { year, month } = utcMonthYear(budget.createdAt);
    const key = periodKey(user.id, year, month);

    if (!periodMap.has(key)) {
      periodMap.set(key, { year, month, budgetIds: [] });
    }

    periodMap.get(key).budgetIds.push(budget);
  }

  const planByKey = new Map();

  for (const [, period] of periodMap) {
    const { year, month, budgetIds } = period;
    const key = periodKey(user.id, year, month);

    let monthPlan = await prisma.monthPlan.findUnique({
      where: {
        userId_year_month: {
          userId: user.id,
          year,
          month,
        },
      },
    });

    if (!monthPlan) {
      monthPlan = await prisma.monthPlan.create({
        data: {
          userId: user.id,
          year,
          month,
          salarySnapshot: refreshedUser.baseSalary,
        },
      });
      summary.monthPlansCreated += 1;
    } else {
      summary.monthPlansReused += 1;
    }

    planByKey.set(key, monthPlan);

    for (const budget of budgetIds) {
      if (budget.monthPlanId === monthPlan.id) {
        summary.budgetsAlreadyLinked += 1;
        continue;
      }

      await prisma.budget.update({
        where: { id: budget.id },
        data: { monthPlanId: monthPlan.id },
      });
      summary.budgetsLinked += 1;
    }

    summary.periods.push({
      year,
      month,
      monthPlanId: monthPlan.id,
      salarySnapshot: Number(monthPlan.salarySnapshot),
      budgets: budgetIds.length,
    });
  }

  return summary;
}

async function validate() {
  const orphanBudgets = await prisma.budget.count({
    where: { monthPlanId: null },
  });

  const budgets = await prisma.budget.findMany({
    where: { monthPlanId: { not: null } },
    select: {
      id: true,
      userId: true,
      monthPlan: {
        select: { userId: true, year: true, month: true },
      },
    },
  });

  const ownershipMismatches = budgets.filter(
    (budget) => budget.monthPlan && budget.monthPlan.userId !== budget.userId
  );

  const expenseCount = await prisma.expense.count();
  const expensesOnOrphanBudgets = await prisma.expense.count({
    where: { budget: { monthPlanId: null } },
  });

  const monthPlanCount = await prisma.monthPlan.count();
  const userCount = await prisma.user.count();

  return {
    orphanBudgets,
    ownershipMismatches: ownershipMismatches.length,
    expenseCount,
    expensesOnOrphanBudgets,
    monthPlanCount,
    userCount,
    budgetsWithMonthPlan: budgets.length,
  };
}

async function main() {
  console.log("Starting MonthPlan backfill (UTC month/year from budget.createdAt)...\n");

  const users = await prisma.user.findMany({
    select: { id: true, name: true, salary: true, baseSalary: true },
    orderBy: { name: "asc" },
  });

  if (users.length === 0) {
    console.log("No users found. Nothing to backfill.");
    return;
  }

  const allSummaries = [];

  for (const user of users) {
    const summary = await backfillForUser(user);
    allSummaries.push(summary);

    console.log(`User: ${summary.userName}`);
    console.log(`  baseSalary synced from salary: ${summary.baseSalarySynced}`);
    console.log(`  MonthPlans created: ${summary.monthPlansCreated}`);
    console.log(`  MonthPlans reused: ${summary.monthPlansReused}`);
    console.log(`  Budgets linked: ${summary.budgetsLinked}`);
    console.log(`  Budgets already linked: ${summary.budgetsAlreadyLinked}`);

    for (const period of summary.periods) {
      console.log(
        `  - ${period.year}-${String(period.month).padStart(2, "0")}: snapshot=${period.salarySnapshot}, budgets=${period.budgets}`
      );
    }
    console.log("");
  }

  const validation = await validate();

  console.log("Validation:");
  console.log(`  Users: ${validation.userCount}`);
  console.log(`  MonthPlans: ${validation.monthPlanCount}`);
  console.log(`  Budgets with monthPlanId: ${validation.budgetsWithMonthPlan}`);
  console.log(`  Orphan budgets (no monthPlanId): ${validation.orphanBudgets}`);
  console.log(`  Ownership mismatches: ${validation.ownershipMismatches}`);
  console.log(`  Expenses: ${validation.expenseCount}`);
  console.log(
    `  Expenses on budgets without monthPlanId: ${validation.expensesOnOrphanBudgets}`
  );

  if (validation.orphanBudgets > 0) {
    console.error("\nBackfill incomplete: some budgets still lack monthPlanId.");
    process.exitCode = 1;
    return;
  }

  if (validation.ownershipMismatches > 0) {
    console.error("\nBackfill invalid: budget/monthPlan user mismatch detected.");
    process.exitCode = 1;
    return;
  }

  if (validation.expensesOnOrphanBudgets > 0) {
    console.error("\nBackfill invalid: expenses linked to budgets without monthPlanId.");
    process.exitCode = 1;
    return;
  }

  console.log("\nBackfill completed successfully.");
}

main()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
