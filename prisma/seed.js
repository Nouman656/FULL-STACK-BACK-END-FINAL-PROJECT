const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const BASE_SALARY = 100000;

const BUDGET_COLORS = {
  Groceries: "#22c55e",
  Transport: "#3b82f6",
  Entertainment: "#a855f7",
  Shopping: "#f97316",
  Utilities: "#06b6d4",
  "Gym & Health": "#ef4444",
};

const DATASET = [
  {
    label: "January 2026",
    year: 2026,
    month: 1,
    salarySnapshot: BASE_SALARY,
    budgets: [
      {
        name: "Groceries",
        amount: 25000,
        createdAt: new Date(Date.UTC(2026, 0, 4, 10, 20, 0)),
        expenses: [
          { name: "Imtiaz Grocery Shopping", amount: 6200, createdAt: new Date(Date.UTC(2026, 0, 5, 18, 15, 0)) },
          { name: "Fruits & Vegetables", amount: 3100, createdAt: new Date(Date.UTC(2026, 0, 9, 13, 5, 0)) },
          { name: "Chicken & Meat", amount: 5400, createdAt: new Date(Date.UTC(2026, 0, 13, 19, 45, 0)) },
          { name: "Snacks & Cold Drinks", amount: 1800, createdAt: new Date(Date.UTC(2026, 0, 18, 20, 10, 0)) },
          { name: "Household Cleaning Items", amount: 4200, createdAt: new Date(Date.UTC(2026, 0, 24, 12, 40, 0)) },
        ],
      },
      {
        name: "Transport",
        amount: 15000,
        createdAt: new Date(Date.UTC(2026, 0, 6, 9, 0, 0)),
        expenses: [
          { name: "Petrol Refill", amount: 5000, createdAt: new Date(Date.UTC(2026, 0, 7, 8, 30, 0)) },
          { name: "Bike Oil Change", amount: 2500, createdAt: new Date(Date.UTC(2026, 0, 11, 16, 20, 0)) },
          { name: "Careem Rides", amount: 1800, createdAt: new Date(Date.UTC(2026, 0, 15, 21, 0, 0)) },
          { name: "Car Wash", amount: 1200, createdAt: new Date(Date.UTC(2026, 0, 20, 17, 0, 0)) },
          { name: "Parking Fees", amount: 700, createdAt: new Date(Date.UTC(2026, 0, 27, 11, 0, 0)) },
        ],
      },
    ],
  },
  {
    label: "February 2026",
    year: 2026,
    month: 2,
    salarySnapshot: BASE_SALARY,
    budgets: [
      {
        name: "Entertainment",
        amount: 12000,
        createdAt: new Date(Date.UTC(2026, 1, 3, 14, 10, 0)),
        expenses: [
          { name: "Cinema Tickets", amount: 3500, createdAt: new Date(Date.UTC(2026, 1, 6, 19, 50, 0)) },
          { name: "Netflix Subscription", amount: 1800, createdAt: new Date(Date.UTC(2026, 1, 10, 8, 20, 0)) },
          { name: "Restaurant Dinner", amount: 4200, createdAt: new Date(Date.UTC(2026, 1, 15, 21, 35, 0)) },
          { name: "Gaming Purchase", amount: 1500, createdAt: new Date(Date.UTC(2026, 1, 21, 23, 5, 0)) },
        ],
      },
      {
        name: "Shopping",
        amount: 30000,
        createdAt: new Date(Date.UTC(2026, 1, 4, 12, 0, 0)),
        expenses: [
          { name: "New Hoodie", amount: 6500, createdAt: new Date(Date.UTC(2026, 1, 8, 17, 25, 0)) },
          { name: "Shoes", amount: 9800, createdAt: new Date(Date.UTC(2026, 1, 12, 18, 40, 0)) },
          { name: "Perfume", amount: 4200, createdAt: new Date(Date.UTC(2026, 1, 16, 15, 10, 0)) },
          { name: "Watch Strap", amount: 1800, createdAt: new Date(Date.UTC(2026, 1, 20, 14, 50, 0)) },
          { name: "Accessories", amount: 2200, createdAt: new Date(Date.UTC(2026, 1, 25, 19, 20, 0)) },
        ],
      },
    ],
  },
  {
    label: "March 2026",
    year: 2026,
    month: 3,
    salarySnapshot: BASE_SALARY,
    budgets: [
      {
        name: "Utilities",
        amount: 18000,
        createdAt: new Date(Date.UTC(2026, 2, 2, 10, 30, 0)),
        expenses: [
          { name: "Electricity Bill", amount: 7200, createdAt: new Date(Date.UTC(2026, 2, 4, 9, 30, 0)) },
          { name: "Internet Bill", amount: 3200, createdAt: new Date(Date.UTC(2026, 2, 9, 11, 0, 0)) },
          { name: "Gas Bill", amount: 4100, createdAt: new Date(Date.UTC(2026, 2, 14, 13, 15, 0)) },
          { name: "Water Bill", amount: 1200, createdAt: new Date(Date.UTC(2026, 2, 20, 10, 45, 0)) },
        ],
      },
      {
        name: "Gym & Health",
        amount: 10000,
        createdAt: new Date(Date.UTC(2026, 2, 3, 8, 45, 0)),
        expenses: [
          { name: "Gym Membership", amount: 4500, createdAt: new Date(Date.UTC(2026, 2, 5, 18, 0, 0)) },
          { name: "Protein Powder", amount: 3200, createdAt: new Date(Date.UTC(2026, 2, 11, 16, 30, 0)) },
          { name: "Supplements", amount: 1200, createdAt: new Date(Date.UTC(2026, 2, 17, 12, 15, 0)) },
          { name: "Healthy Snacks", amount: 700, createdAt: new Date(Date.UTC(2026, 2, 23, 20, 5, 0)) },
        ],
      },
    ],
  },
];

function validateDataset() {
  for (const period of DATASET) {
    let monthBudgetTotal = 0;

    for (const budget of period.budgets) {
      monthBudgetTotal += budget.amount;

      const expenseTotal = budget.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      if (expenseTotal > budget.amount) {
        throw new Error(
          `Invalid dataset: expenses exceed budget for "${budget.name}" in ${period.label}`
        );
      }
    }

    if (monthBudgetTotal > period.salarySnapshot) {
      throw new Error(
        `Invalid dataset: budget total exceeds salarySnapshot in ${period.label}`
      );
    }
  }
}

async function verifyRelations(userId) {
  const orphanBudgets = await prisma.budget.count({
    where: { userId, monthPlanId: null },
  });
  const orphanExpenses = await prisma.expense.count({
    where: { budget: { userId, monthPlanId: null } },
  });
  const monthPlanCount = await prisma.monthPlan.count({
    where: { userId },
  });
  const budgetCount = await prisma.budget.count({
    where: { userId, monthPlanId: { not: null } },
  });
  const expenseCount = await prisma.expense.count({
    where: { budget: { userId } },
  });

  return {
    monthPlanCount,
    budgetCount,
    expenseCount,
    orphanBudgets,
    orphanExpenses,
  };
}

async function main() {
  validateDataset();

  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: "Nouman",
        mode: "insensitive",
      },
    },
    select: { id: true, name: true },
  });

  if (!user) {
    console.error('Seed aborted: user "Nouman" (case-insensitive) was not found.');
    process.exitCode = 1;
    return;
  }

  const [existingBudgets, existingExpenses, existingMonthPlans] =
    await Promise.all([
      prisma.budget.count({ where: { userId: user.id } }),
      prisma.expense.count({ where: { budget: { userId: user.id } } }),
      prisma.monthPlan.count({ where: { userId: user.id } }),
    ]);

  await prisma.$transaction(async (tx) => {
    await tx.expense.deleteMany({
      where: { budget: { userId: user.id } },
    });
    await tx.budget.deleteMany({
      where: { userId: user.id },
    });
    await tx.monthPlan.deleteMany({
      where: { userId: user.id },
    });
    await tx.user.update({
      where: { id: user.id },
      data: {
        salary: BASE_SALARY,
        baseSalary: BASE_SALARY,
      },
    });
  });

  let totalMonthPlansCreated = 0;
  let totalBudgetsCreated = 0;
  let totalExpensesCreated = 0;
  const monthBreakdown = {};

  for (const period of DATASET) {
    monthBreakdown[period.label] = {
      monthPlanId: null,
      salarySnapshot: period.salarySnapshot,
      budgetedTotal: 0,
      budgets: 0,
      expenses: 0,
    };

    const monthPlan = await prisma.monthPlan.create({
      data: {
        userId: user.id,
        year: period.year,
        month: period.month,
        salarySnapshot: period.salarySnapshot,
      },
    });

    totalMonthPlansCreated += 1;
    monthBreakdown[period.label].monthPlanId = monthPlan.id;

    for (const budgetDef of period.budgets) {
      const createdBudget = await prisma.budget.create({
        data: {
          name: budgetDef.name,
          amount: budgetDef.amount,
          color: BUDGET_COLORS[budgetDef.name] ?? "#60a5fa",
          userId: user.id,
          monthPlanId: monthPlan.id,
          createdAt: budgetDef.createdAt,
        },
      });

      totalBudgetsCreated += 1;
      monthBreakdown[period.label].budgets += 1;
      monthBreakdown[period.label].budgetedTotal += budgetDef.amount;

      for (const expenseDef of budgetDef.expenses) {
        await prisma.expense.create({
          data: {
            name: expenseDef.name,
            amount: expenseDef.amount,
            budgetId: createdBudget.id,
            createdAt: expenseDef.createdAt,
          },
        });
        totalExpensesCreated += 1;
        monthBreakdown[period.label].expenses += 1;
      }
    }
  }

  const verification = await verifyRelations(user.id);

  console.log(`Seed completed for user: ${user.name}`);
  console.log(
    `Removed Nouman data: monthPlans=${existingMonthPlans}, budgets=${existingBudgets}, expenses=${existingExpenses}`
  );
  console.log(`User salary/baseSalary set to: ${BASE_SALARY}`);
  console.log(`MonthPlans created: ${totalMonthPlansCreated}`);
  console.log(`Budgets created: ${totalBudgetsCreated}`);
  console.log(`Expenses created: ${totalExpensesCreated}`);
  console.log("Month breakdown:");
  for (const [label, counts] of Object.entries(monthBreakdown)) {
    const remaining = counts.salarySnapshot - counts.budgetedTotal;
    console.log(
      `- ${label}: snapshot=${counts.salarySnapshot}, budgeted=${counts.budgetedTotal}, remaining=${remaining}, budgets=${counts.budgets}, expenses=${counts.expenses}, monthPlanId=${counts.monthPlanId}`
    );
  }
  console.log("Relation verification:");
  console.log(`  MonthPlans: ${verification.monthPlanCount}`);
  console.log(`  Budgets linked to MonthPlan: ${verification.budgetCount}`);
  console.log(`  Expenses: ${verification.expenseCount}`);
  console.log(`  Orphan budgets (no monthPlanId): ${verification.orphanBudgets}`);
  console.log(`  Orphan expenses: ${verification.orphanExpenses}`);

  if (verification.orphanBudgets > 0 || verification.orphanExpenses > 0) {
    console.error("Seed verification failed: orphan records detected.");
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
