"use client";

import { useState } from "react";
import CreateAccountForm from "./CreateAccountForm";
import LoginForm from "./LoginForm";

export default function Intro() {
  const [tab, setTab] = useState("create");

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
        <div className="flex-sm">
          <button
            type="button"
            className={
              tab === "create" ? "btn btn--dark" : "btn btn--outline"
            }
            onClick={() => setTab("create")}
          >
            Create Account
          </button>
          <button
            type="button"
            className={
              tab === "login" ? "btn btn--dark" : "btn btn--outline"
            }
            onClick={() => setTab("login")}
          >
            Login
          </button>
        </div>
        {tab === "create" ? <CreateAccountForm /> : <LoginForm />}
      </div>
      <img src="/illustration.jpg" alt="Person with money" width={600} />
    </div>
  );
}
