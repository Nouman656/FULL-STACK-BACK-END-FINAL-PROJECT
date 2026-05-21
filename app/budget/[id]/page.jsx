import Link from "next/link";
import { getBudgetPageData } from "../../../lib/data/budget";
import {
  buildPeriodQuery,
  formatMonthYearLabel,
  parseDashboardMode,
} from "../../../lib/dateFilters";
import BudgetOverview from "../../../components/BudgetOverview";
import MonthYearFilter from "../../../components/MonthYearFilter";

export default async function BudgetPage({ params, searchParams }) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const mode = parseDashboardMode(resolvedSearchParams);
  const { id } = resolvedParams;
  const { budget, expenses, month, year } = await getBudgetPageData(id);
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
      <BudgetOverview
        budget={budget}
        expenses={expenses}
        month={month}
        year={year}
        mode={mode}
        periodLabel={periodLabel}
      />
    </div>
  );
}
