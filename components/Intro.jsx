"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { createAccount } from "../lib/actions/auth";

export default function Intro() {
  const [state, formAction, isPending] = useActionState(createAccount, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="intro">
      <div>
        <h1>
          Take Control of <span className="accent">Your Money</span>
        </h1>
        <p>
          Personal budgeting is the secret to financial freedom. Start your
          journey today.
        </p>
        <form action={formAction}>
          <input
            type="text"
            name="userName"
            required
            placeholder="What is your name?"
            aria-label="Your Name"
            autoComplete="given-name"
          />
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
      </div>
      <img src="/illustration.jpg" alt="Person with money" width={600} />
    </div>
  );
}
