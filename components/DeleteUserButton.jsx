"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import { deleteUser } from "../lib/actions/user";

export default function DeleteUserButton() {
  return (
    <form
      action={deleteUser}
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
