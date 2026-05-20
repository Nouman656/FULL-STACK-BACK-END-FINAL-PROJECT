"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
  formatCurrency,
  formatDateToLocaleString,
} from "../lib/formatters";
import { deleteExpense } from "../lib/actions/dashboard";
import { toMonthYearQuery } from "../lib/dateFilters";

export default function ExpenseItem({ expense, showBudget, month, year }) {
  const [state, formAction, isPending] = useActionState(deleteExpense, null);
  const budget = expense.budget;
  const query = new URLSearchParams(
    toMonthYearQuery({ month, year })
  ).toString();

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <>
      <td>{expense.name}</td>
      <td>{formatCurrency(expense.amount)}</td>
      <td>{formatDateToLocaleString(expense.createdAt)}</td>
      {showBudget && budget && (
        <td>
          <Link
            href={`/budget/${budget.id}?${query}`}
            style={{
              "--accent": budget.color,
            }}
          >
            {budget.name}
          </Link>
        </td>
      )}
      <td>
        <form action={formAction}>
          <input type="hidden" name="expenseId" value={expense.id} />
          <button
            type="submit"
            className="btn btn--warning"
            disabled={isPending}
            aria-label={`Delete ${expense.name} expense`}
          >
            <TrashIcon width={20} />
          </button>
        </form>
      </td>
    </>
  );
}
