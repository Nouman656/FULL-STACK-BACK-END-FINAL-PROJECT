import AddExpenseForm from "./AddExpenseForm";
import BudgetItem from "./BudgetItem";
import Table from "./Table";

export default function BudgetOverview({ budget, expenses, month, year }) {
  return (
    <div
      className="grid-lg"
      style={{
        "--accent": budget.color,
      }}
    >
      <h1 className="h2">
        <span className="accent">{budget.name}</span> Overview
      </h1>
      <div className="flex-lg">
        <BudgetItem budget={budget} showDelete month={month} year={year} />
        <AddExpenseForm budgets={[budget]} month={month} year={year} />
      </div>
      {expenses.length > 0 && (
        <div className="grid-md">
          <h2>
            <span className="accent">{budget.name}</span> Expenses
          </h2>
          <Table expenses={expenses} showBudget={false} month={month} year={year} />
        </div>
      )}
    </div>
  );
}
