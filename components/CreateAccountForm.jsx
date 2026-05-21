"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { createAccount } from "../lib/actions/auth";

export default function CreateAccountForm() {
  const [state, formAction, isPending] = useActionState(createAccount, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="grid-sm">
      <div className="grid-xs">
        <label htmlFor="create-userName">Your name</label>
        <input
          id="create-userName"
          type="text"
          name="userName"
          required
          placeholder="What is your name?"
          aria-label="Your Name"
          autoComplete="given-name"
        />
      </div>
      <div className="grid-xs">
        <label htmlFor="create-salary">Monthly salary</label>
        <input
          id="create-salary"
          type="number"
          name="salary"
          step="0.01"
          min="0"
          inputMode="decimal"
          required
          placeholder="e.g., 5000"
          aria-label="Monthly salary"
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
            <span>Create Account</span>
            <UserPlusIcon width={20} />
          </>
        )}
      </button>
    </form>
  );
}
