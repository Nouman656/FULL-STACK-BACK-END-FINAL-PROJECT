"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { createExpense } from "../lib/actions/dashboard";

export default function AddExpenseForm({ budgets, month, year }) {
  const [state, formAction, isPending] = useActionState(createExpense, null);
  const formRef = useRef(null);
  const focusRef = useRef(null);
  const hasBudgets = budgets.length > 0;

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      formRef.current?.reset();
      focusRef.current?.focus();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  if (!hasBudgets) {
    return (
      <div className="form-wrapper">
        <h2 className="h3">Add New Expense</h2>
        <p className="muted">Create a budget first</p>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      <h2 className="h3">Add New Expense</h2>
      <form action={formAction} className="grid-sm" ref={formRef}>
        <input type="hidden" name="month" value={String(month)} />
        <input type="hidden" name="year" value={String(year)} />
        <input type="hidden" name="mode" value="edit" />
        <div className="expense-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Expense Name</label>
            <input
              type="text"
              name="newExpense"
              id="newExpense"
              placeholder="e.g., Coffee"
              ref={focusRef}
              required
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newExpenseAmount">Amount</label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              name="newExpenseAmount"
              id="newExpenseAmount"
              placeholder="e.g., 3.50"
              required
            />
          </div>
        </div>
        <div className="grid-xs">
          <label htmlFor="newExpenseBudget">Budget Category</label>
          <select
            name="newExpenseBudget"
            id="newExpenseBudget"
            required
            defaultValue={budgets[0]?.id}
          >
            {[...budgets]
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.name}
                </option>
              ))}
          </select>
        </div>
        {state?.error ? (
          <p className="muted" role="alert">
            {state.error}
          </p>
        ) : null}
        <button type="submit" className="btn btn--dark" disabled={isPending}>
          {isPending ? (
            <span>Submitting…</span>
          ) : (
            <>
              <span>Add Expense</span>
              <PlusCircleIcon width={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
