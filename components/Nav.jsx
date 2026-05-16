import Link from "next/link";
import DeleteUserButton from "./DeleteUserButton";
import LogoutButton from "./LogoutButton";

export default function Nav({ userName }) {
  return (
    <nav>
      <Link href="/" aria-label="Go to home">
        <img src="/logomark.svg" alt="" height={30} />
        <span>HomeBudget</span>
      </Link>
      {userName ? (
        <div className="flex-sm">
          <LogoutButton />
          <DeleteUserButton />
        </div>
      ) : null}
    </nav>
  );
}
