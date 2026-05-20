import ExpenseItem from "./ExpenseItem";

export default function Table({ expenses, showBudget = true, month, year }) {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            {["Name", "Amount", "Date", showBudget ? "Budget" : "", ""].map(
              (label, index) => (
                <th key={index}>{label}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <ExpenseItem
                expense={expense}
                showBudget={showBudget}
                month={month}
                year={year}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
