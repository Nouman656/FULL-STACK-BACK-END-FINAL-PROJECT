import { getDashboardData } from "../lib/data/dashboard";
import { parseMonthYear } from "../lib/dateFilters";
import Dashboard from "../components/Dashboard";
import MonthYearFilter from "../components/MonthYearFilter";
import Intro from "../components/Intro";

export default async function HomePage({ searchParams }) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const { month, year } = parseMonthYear(resolvedSearchParams);
  const {
    user,
    budgets,
    expenses,
    totalSalary,
    totalBudgeted,
    remainingSalary,
  } = await getDashboardData({ month, year });

  if (!user) {
    return <Intro />;
  }

  return (
    <div className="grid-lg">
      <MonthYearFilter month={month} year={year} />
      <Dashboard
        userName={user.name}
        totalSalary={totalSalary}
        totalBudgeted={totalBudgeted}
        remainingSalary={remainingSalary}
        budgets={budgets}
        expenses={expenses}
        month={month}
        year={year}
      />
    </div>
  );
}
