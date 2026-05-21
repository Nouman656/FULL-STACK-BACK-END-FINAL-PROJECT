import Link from "next/link";
import { getExpensesPageData } from "../../lib/data/expenses";
import {
  buildPeriodQuery,
  formatMonthYearLabel,
  parseDashboardMode,
  parseMonthYear,
} from "../../lib/dateFilters";
import ExpensesPage from "../../components/ExpensesPage";
import MonthYearFilter from "../../components/MonthYearFilter";

export default async function ExpensesRoute({ searchParams }) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const mode = parseDashboardMode(resolvedSearchParams);
  const { month, year } = parseMonthYear(resolvedSearchParams);
  const { expenses } = await getExpensesPageData({ month, year });
  const periodLabel = formatMonthYearLabel(month, year);
  const dashboardHref = `/?${buildPeriodQuery({ mode, month, year })}`;

  return (
    <div className="grid-lg">
      <div className="flex-sm">
        <Link href={dashboardHref} className="btn btn--outline">
          Back to dashboard
        </Link>
      </div>
      <MonthYearFilter month={month} year={year} mode={mode} />
      <ExpensesPage
        expenses={expenses}
        month={month}
        year={year}
        mode={mode}
        periodLabel={periodLabel}
      />
    </div>
  );
}
