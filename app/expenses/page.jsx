import { getExpensesPageData } from "../../lib/data/expenses";
import ExpensesPage from "../../components/ExpensesPage";

export default async function ExpensesRoute() {
  const { expenses } = await getExpensesPageData();

  return <ExpensesPage expenses={expenses} />;
}
