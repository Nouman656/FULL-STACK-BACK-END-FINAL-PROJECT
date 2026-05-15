import Table from "./Table";

export default function ExpensesPage({ expenses }) {
  return (
    <div className="grid-lg">
      <h1>All Expenses</h1>
      {expenses.length > 0 ? (
        <div className="grid-md">
          <h2>
            Recent Expenses <small>({expenses.length} total)</small>
          </h2>
          <Table expenses={expenses} />
        </div>
      ) : (
        <p>No Expenses to show</p>
      )}
    </div>
  );
}
