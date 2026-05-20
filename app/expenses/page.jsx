import { getExpensesPageData } from "../../lib/data/expenses";
import { parseMonthYear } from "../../lib/dateFilters";
import ExpensesPage from "../../components/ExpensesPage";
import MonthYearFilter from "../../components/MonthYearFilter";

export default async function ExpensesRoute({ searchParams }) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const { month, year } = parseMonthYear(resolvedSearchParams);
  const { expenses } = await getExpensesPageData();

  return (
    <div className="grid-lg">
      <MonthYearFilter month={month} year={year} />
      <ExpensesPage expenses={expenses} month={month} year={year} />
    </div>
  );
}
