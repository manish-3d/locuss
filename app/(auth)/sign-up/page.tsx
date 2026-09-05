"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Unable to create your account. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#e5ddd0] bg-white p-7 sm:p-9 shadow-sm">
        {/* Brand Icon */}
        <div className="flex justify-center mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e8e4de] bg-[#faf7f2] shadow-xs">
            <Home className="h-5 w-5 text-[#1e1b17]" />
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1e1b17] text-center">
          Join Locus
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#7a7268] text-center mb-6">
          Find your dream home or list luxury properties with AI.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#7a7268]">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Eleanor Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#7a7268]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#7a7268]">
              Password
            </label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-full bg-[#1e1b17] py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-md disabled:opacity-60 shadow-xs"
          >
            {isPending ? "Creating account..." : "Get Started"}
          </button>

          <p className="mt-2 text-center text-xs sm:text-sm text-[#7a7268]">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-[#1e1b17] hover:text-[#b8924a] transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
