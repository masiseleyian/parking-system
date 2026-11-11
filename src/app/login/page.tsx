"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { isLoggedIn, login } from "@/lib/auth";
import { ParkingLogo } from "@/components/parking-logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn()) router.replace("/dashboard");
  }, [router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (login(email, password)) router.replace("/dashboard");
    else setError("Invalid email or password");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-7 flex justify-center"><ParkingLogo large /></div>
        <div className="rounded-2xl border border-[#e1e9e3] bg-white px-6 py-8 shadow-[0_18px_48px_rgba(31,70,43,0.07)] sm:px-9 sm:py-10">
          <h1 className="text-center text-[27px] font-bold tracking-[-0.03em]">Smart Parking Admin</h1>
          <p className="mt-2 text-center text-sm text-[#66796d]">Sign in to monitor your parking spaces.</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <div><label htmlFor="email" className="mb-2 block text-sm font-semibold">Email address</label><div className="relative"><Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82958a]" /><input id="email" type="email" autoComplete="username" required value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="admin@parking.com" className="h-12 w-full rounded-lg border border-[#d8e3da] bg-white pl-10 pr-3 text-sm outline-none transition-colors focus:border-[#27814b] focus:ring-2 focus:ring-[#d4ebdb]" /></div></div>
            <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">Password</label><div className="relative"><LockKeyhole size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82958a]" /><input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Enter your password" className="h-12 w-full rounded-lg border border-[#d8e3da] bg-white pl-10 pr-3 text-sm outline-none transition-colors focus:border-[#27814b] focus:ring-2 focus:ring-[#d4ebdb]" /></div></div>
            {error && <p role="alert" className="rounded-lg bg-[#fff0ed] px-3 py-2 text-sm font-medium text-[#b33c32]">{error}</p>}
            <button type="submit" className="h-12 w-full rounded-lg bg-[#176b3c] text-sm font-bold text-white transition-colors hover:bg-[#11532f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b3c]">Login</button>
          </form>
        </div>
        <p className="mt-5 text-center text-xs text-[#718476]">Demo access: admin@parking.com · admin123</p>
      </div>
    </main>
  );
}
