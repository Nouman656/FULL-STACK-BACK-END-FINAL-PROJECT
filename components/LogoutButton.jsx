"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import { logout } from "../lib/actions/user";

export default function LogoutButton() {
  return (
    <form
      action={logout}
      onSubmit={(event) => {
        if (!confirm("Delete user and all data?")) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="btn btn--warning">
        <span>Delete User</span>
        <TrashIcon width={20} />
      </button>
    </form>
  );
}
