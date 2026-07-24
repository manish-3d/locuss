import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import LogoutButton from "./logout-button";
import { Button } from "./ui/button";

export default async function UserNav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/sign-in">
          <Button variant="ghost">Login</Button>
        </Link>

        <Link href="/sign-up">
          <Button>Get Started</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="hidden font-medium sm:inline">{session.user.name}</span>

      <Link href="/dashboard">
        <Button variant="outline">Dashboard</Button>
      </Link>

      <LogoutButton />
    </div>
  );
}
