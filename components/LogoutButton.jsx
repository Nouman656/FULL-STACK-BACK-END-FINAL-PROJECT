"use client";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { logout } from "../lib/actions/user";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="btn btn--outline">
        <span>Logout</span>
        <ArrowRightOnRectangleIcon width={20} />
      </button>
    </form>
  );
}
