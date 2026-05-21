"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { createBudget } from "../lib/actions/dashboard";

export default function AddBudgetForm({ month, year }) {
  const [state, formAction, isPending] = useActionState(createBudget, null);
  const formRef = useRef(null);
  const focusRef = useRef(null);

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

  return (
    <div className="form-wrapper">
      <h2 className="h3">Create budget</h2>
      <form action={formAction} className="grid-sm" ref={formRef}>
        <input type="hidden" name="month" value={String(month)} />
        <input type="hidden" name="year" value={String(year)} />
        <input type="hidden" name="mode" value="edit" />
        <div className="grid-xs">
          <label htmlFor="newBudget">Budget Name</label>
          <input
            type="text"
            name="newBudget"
            id="newBudget"
            placeholder="e.g., Groceries"
            required
            ref={focusRef}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newBudgetAmount">Amount</label>
          <input
            type="number"
            step="0.01"
            name="newBudgetAmount"
            id="newBudgetAmount"
            placeholder="e.g., $350"
            required
            inputMode="decimal"
          />
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
              <span>Create budget</span>
              <CurrencyDollarIcon width={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
