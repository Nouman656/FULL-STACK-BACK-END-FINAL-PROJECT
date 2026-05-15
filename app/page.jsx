import { getDashboardData } from "../lib/data/dashboard";
import Dashboard from "../components/Dashboard";
import Intro from "../components/Intro";

export default async function HomePage() {
  const { user, budgets, expenses } = await getDashboardData();

  if (!user) {
    return <Intro />;
  }

  return (
    <Dashboard
      userName={user.name}
      budgets={budgets}
      expenses={expenses}
    />
  );
}
