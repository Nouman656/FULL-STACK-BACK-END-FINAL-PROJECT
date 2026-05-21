import Link from "next/link";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { formatCurrency, formatPercentage } from "../lib/formatters";
import DeleteBudgetButton from "./DeleteBudgetButton";
import { buildPeriodQuery } from "../lib/dateFilters";

export default function BudgetItem({
  budget,
  showDelete = false,
  month,
  year,
  mode = "search",
}) {
  const { id, name, amount, color, spent = 0 } = budget;
  const detailsHref = `/budget/${id}?${buildPeriodQuery({ mode, month, year })}`;

  return (
    <div
      className="budget"
      style={{
        "--accent": color,
      }}
    >
      <div className="progress-text">
        <h3>{name}</h3>
        <p>{formatCurrency(amount)} Budgeted</p>
      </div>
      <progress max={amount} value={spent}>
        {formatPercentage(spent / amount)}
      </progress>
      <div className="progress-text">
        <small>{formatCurrency(spent)} spent</small>
        <small>{formatCurrency(amount - spent)} remaining</small>
      </div>
      {showDelete ? (
        <DeleteBudgetButton budgetId={id} />
      ) : (
        <div className="flex-sm">
          <Link href={detailsHref} className="btn">
            <span>View Details</span>
            <BanknotesIcon width={20} />
          </Link>
        </div>
      )}
    </div>
  );
}
