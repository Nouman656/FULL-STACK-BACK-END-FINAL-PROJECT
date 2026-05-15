import { getBudgetPageData } from "../../../lib/data/budget";
import BudgetOverview from "../../../components/BudgetOverview";

export default async function BudgetPage({ params }) {
  const { id } = await params;
  const { budget, expenses } = await getBudgetPageData(id);

  return <BudgetOverview budget={budget} expenses={expenses} />;
}
