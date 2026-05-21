import { getDashboardData } from "../lib/data/dashboard";
import { parseDashboardMode, parseMonthYear } from "../lib/dateFilters";
import Dashboard from "../components/Dashboard";
import Intro from "../components/Intro";

export default async function HomePage({ searchParams }) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const mode = parseDashboardMode(resolvedSearchParams);
  const { month, year } = parseMonthYear(resolvedSearchParams);
  const {
    user,
    budgets,
    expenses,
    baseSalary,
    monthSalary,
    totalBudgeted,
    remainingSalary,
  } = await getDashboardData({ mode, month, year });

  if (!user) {
    return <Intro />;
  }

  return (
    <Dashboard
      userName={user.name}
      baseSalary={baseSalary}
      monthSalary={monthSalary}
      totalBudgeted={totalBudgeted}
      remainingSalary={remainingSalary}
      budgets={budgets}
      expenses={expenses}
      month={month}
      year={year}
      mode={mode}
    />
  );
}
