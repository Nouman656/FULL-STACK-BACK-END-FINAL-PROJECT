import Link from "next/link";
import AddBudgetForm from "./AddBudgetForm";
import AddExpenseForm from "./AddExpenseForm";
import BudgetItem from "./BudgetItem";
import EditSalaryForm from "./EditSalaryForm";
import Table from "./Table";
import { formatCurrency } from "../lib/formatters";
import { toMonthYearQuery } from "../lib/dateFilters";

export default function Dashboard({
  userName,
  totalSalary,
  totalBudgeted,
  remainingSalary,
  budgets,
  expenses,
  month,
  year,
}) {
  const query = new URLSearchParams(toMonthYearQuery({ month, year })).toString();
  const recentExpenses = [...expenses]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 8);

  return (
    <div className="dashboard">
      <h1>
        Welcome back, <span className="accent">{userName}</span>
      </h1>

      <div className="grid-md">
        <div className="flex-lg">
          <div className="grid-xs">
            <p className="muted">Total Salary</p>
            <p className="h3">{formatCurrency(totalSalary)}</p>
          </div>
          <div className="grid-xs">
            <p className="muted">Total Budgeted</p>
            <p className="h3">{formatCurrency(totalBudgeted)}</p>
          </div>
          <div className="grid-xs">
            <p className="muted">Remaining Salary</p>
            <p className="h3 accent">{formatCurrency(remainingSalary)}</p>
          </div>
        </div>
        <EditSalaryForm salary={totalSalary} month={month} year={year} />
      </div>

      <div className="grid-sm">
        {budgets.length > 0 ? (
          <div className="grid-lg">
            <div className="flex-lg">
              <AddBudgetForm month={month} year={year} />
              <AddExpenseForm budgets={budgets} month={month} year={year} />
            </div>
            <h2>Existing Budgets</h2>
            <div className="budgets">
              {budgets.map((budget) => (
                <BudgetItem key={budget.id} budget={budget} month={month} year={year} />
              ))}
            </div>
            {expenses.length > 0 && (
              <div className="grid-md">
                <h2>Recent Expenses</h2>
                <Table expenses={recentExpenses} month={month} year={year} />
                {expenses.length > 8 && (
                  <Link href={`/expenses?${query}`} className="btn btn--dark">
                    View all expenses
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid-sm">
            <p>Personal budgeting is the secret to financial freedom.</p>
            <p>Create a budget to get started!</p>
            <AddBudgetForm month={month} year={year} />
          </div>
        )}
      </div>
    </div>
  );
}
