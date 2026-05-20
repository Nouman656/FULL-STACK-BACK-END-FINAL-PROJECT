import { getBudgetPageData } from "../../../lib/data/budget";
import { parseMonthYear } from "../../../lib/dateFilters";
import BudgetOverview from "../../../components/BudgetOverview";
import MonthYearFilter from "../../../components/MonthYearFilter";

export default async function BudgetPage({ params, searchParams }) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const { month, year } = parseMonthYear(resolvedSearchParams);
  const { id } = resolvedParams;
  const { budget, expenses } = await getBudgetPageData(id, { month, year });

  return (
    <div className="grid-lg">
      <MonthYearFilter month={month} year={year} />
      <BudgetOverview budget={budget} expenses={expenses} month={month} year={year} />
    </div>
  );
}
