import Table from "./Table";

export default function ExpensesPage({ expenses, month, year }) {
  return (
    <div className="grid-lg">
      <h1>All Expenses</h1>
      {expenses.length > 0 ? (
        <div className="grid-md">
          <h2>
            Recent Expenses <small>({expenses.length} total)</small>
          </h2>
          <Table expenses={expenses} month={month} year={year} />
        </div>
      ) : (
        <p>No Expenses to show</p>
      )}
    </div>
  );
}
