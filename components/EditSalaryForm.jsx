"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { updateSalary } from "../lib/actions/dashboard";

export default function EditSalaryForm({ salary, month, year }) {
  const [state, formAction, isPending] = useActionState(updateSalary, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="form-wrapper">
      <h2 className="h3">Your salary</h2>
      <form action={formAction} className="grid-sm">
        <input type="hidden" name="month" value={String(month)} />
        <input type="hidden" name="year" value={String(year)} />
        <div className="grid-xs">
          <label htmlFor="salary">Monthly salary</label>
          <input
            id="salary"
            type="number"
            name="salary"
            step="0.01"
            min="0"
            inputMode="decimal"
            required
            defaultValue={salary || ""}
            placeholder="e.g., 5000"
          />
        </div>
        {state?.error ? (
          <p className="muted" role="alert">
            {state.error}
          </p>
        ) : null}
        <button type="submit" className="btn btn--dark" disabled={isPending}>
          {isPending ? (
            <span>Saving…</span>
          ) : (
            <>
              <span>Save salary</span>
              <CurrencyDollarIcon width={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
