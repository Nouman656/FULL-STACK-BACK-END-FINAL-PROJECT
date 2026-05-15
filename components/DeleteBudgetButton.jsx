"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteBudget } from "../lib/actions/budget";

export default function DeleteBudgetButton({ budgetId }) {
  const [state, formAction, isPending] = useActionState(deleteBudget, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="flex-sm">
      <form
        action={formAction}
        onSubmit={(event) => {
          if (
            !confirm(
              "Are you sure you want to permanently delete this budget?"
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="budgetId" value={budgetId} />
        <button type="submit" className="btn" disabled={isPending}>
          <span>{isPending ? "Deleting…" : "Delete Budget"}</span>
          <TrashIcon width={20} />
        </button>
      </form>
    </div>
  );
}
