"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { login } from "../lib/actions/auth";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="grid-sm">
      <div className="grid-xs">
        <label htmlFor="login-userName">Your name</label>
        <input
          id="login-userName"
          type="text"
          name="userName"
          required
          placeholder="Enter your account name"
          aria-label="Account name"
          autoComplete="username"
        />
      </div>
      {state?.error ? (
        <p className="muted" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="btn btn--dark" disabled={isPending}>
        {isPending ? (
          <span>Signing in…</span>
        ) : (
          <>
            <span>Login</span>
            <ArrowRightOnRectangleIcon width={20} />
          </>
        )}
      </button>
    </form>
  );
}
