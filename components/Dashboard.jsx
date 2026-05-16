import Link from "next/link";
import AddBudgetForm from "./AddBudgetForm";
import AddExpenseForm from "./AddExpenseForm";
import BudgetItem from "./BudgetItem";
import EditSalaryForm from "./EditSalaryForm";
import Table from "./Table";
import { formatCurrency } from "../lib/formatters";

export default function Dashboard({
  userName,
  totalSalary,
  totalBudgeted,
  remainingSalary,
  budgets,
  expenses,
}) {
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
        <EditSalaryForm salary={totalSalary} />
      </div>

      <div className="grid-sm">
        {budgets.length > 0 ? (
          <div className="grid-lg">
            <div className="flex-lg">
              <AddBudgetForm />
              <AddExpenseForm budgets={budgets} />
            </div>
            <h2>Existing Budgets</h2>
            <div className="budgets">
              {budgets.map((budget) => (
                <BudgetItem key={budget.id} budget={budget} />
              ))}
            </div>
            {expenses.length > 0 && (
              <div className="grid-md">
                <h2>Recent Expenses</h2>
                <Table expenses={recentExpenses} />
                {expenses.length > 8 && (
                  <Link href="/expenses" className="btn btn--dark">
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
            <AddBudgetForm />
          </div>
        )}
      </div>
    </div>
  );
}
