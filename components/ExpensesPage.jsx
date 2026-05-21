import Table from "./Table";

export default function ExpensesPage({
  expenses,
  month,
  year,
  mode = "search",
  periodLabel,
}) {
  return (
    <div className="grid-lg">
      <h1>All Expenses — {periodLabel}</h1>
      {expenses.length > 0 ? (
        <div className="grid-md">
          <h2>
            Expenses <small>({expenses.length} total)</small>
          </h2>
          <Table expenses={expenses} month={month} year={year} mode={mode} />
        </div>
      ) : (
        <p>No expenses found for {periodLabel}.</p>
      )}
    </div>
  );
}
