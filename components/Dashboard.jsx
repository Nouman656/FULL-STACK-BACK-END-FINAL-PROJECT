import Link from "next/link";
import AddBudgetForm from "./AddBudgetForm";
import AddExpenseForm from "./AddExpenseForm";
import BudgetItem from "./BudgetItem";
import EditSalaryForm from "./EditSalaryForm";
import MonthYearFilter from "./MonthYearFilter";
import Table from "./Table";
import { buildPeriodQuery, formatMonthYearLabel } from "../lib/dateFilters";
import { formatCurrency } from "../lib/formatters";

export default function Dashboard({
  userName,
  baseSalary,
  monthSalary,
  totalBudgeted,
  remainingSalary,
  budgets,
  expenses,
  month,
  year,
  mode,
}) {
  const isSearchMode = mode === "search";
  const periodLabel = formatMonthYearLabel(month, year);
  const editQuery = buildPeriodQuery({ mode: "edit", month, year });
  const searchQuery = buildPeriodQuery({ mode: "search", month, year });
  const expensesHref = `/expenses?${buildPeriodQuery({ mode, month, year })}`;
  const recentExpenses = [...expenses]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 8);

  return (
    <div className="dashboard">
      <h1>
        Welcome back, <span className="accent">{userName}</span>
      </h1>

      <div className="flex-sm">
        <Link
          href={`/?${editQuery}`}
          className={isSearchMode ? "btn btn--outline" : "btn btn--dark"}
        >
          Edit
        </Link>
        <Link
          href={`/?${searchQuery}`}
          className={isSearchMode ? "btn btn--dark" : "btn btn--outline"}
        >
          Search
        </Link>
      </div>

      <MonthYearFilter month={month} year={year} mode={mode} />

      <div className="grid-md">
        <div className="flex-lg">
          <div className="grid-xs">
            <p className="muted">Base Salary</p>
            <p className="h3">{formatCurrency(baseSalary)}</p>
          </div>
          <div className="grid-xs">
            <p className="muted">{periodLabel} Salary</p>
            <p className="h3">{formatCurrency(monthSalary)}</p>
          </div>
          <div className="grid-xs">
            <p className="muted">Budgeted This Month</p>
            <p className="h3">{formatCurrency(totalBudgeted)}</p>
          </div>
          <div className="grid-xs">
            <p className="muted">Remaining This Month</p>
            <p className="h3 accent">{formatCurrency(remainingSalary)}</p>
          </div>
        </div>
        {!isSearchMode ? (
          <EditSalaryForm salary={monthSalary} month={month} year={year} />
        ) : null}
      </div>

      <div className="grid-sm">
        {budgets.length > 0 ? (
          <div className="grid-lg">
            {!isSearchMode ? (
              <div className="flex-lg">
                <AddBudgetForm month={month} year={year} />
                <AddExpenseForm budgets={budgets} month={month} year={year} />
              </div>
            ) : null}
            <h2>Existing Budgets — {periodLabel}</h2>
            <div className="budgets">
              {budgets.map((budget) => (
                <BudgetItem
                  key={budget.id}
                  budget={budget}
                  month={month}
                  year={year}
                  mode={mode}
                />
              ))}
            </div>
            {expenses.length > 0 && (
              <div className="grid-md">
                <h2>Recent Expenses — {periodLabel}</h2>
                <Table
                  expenses={recentExpenses}
                  month={month}
                  year={year}
                  mode={mode}
                />
                {expenses.length > 8 && (
                  <Link href={expensesHref} className="btn btn--dark">
                    View all expenses
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid-sm">
            {isSearchMode ? (
              <p>No budgets found for {periodLabel}.</p>
            ) : (
              <>
                <p>Create a budget for {periodLabel}.</p>
                <AddBudgetForm month={month} year={year} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
