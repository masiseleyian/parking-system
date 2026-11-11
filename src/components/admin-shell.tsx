"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, ClipboardList, LayoutDashboard, LogOut } from "lucide-react";
import { isLoggedIn, logout } from "@/lib/auth";
import { ParkingLogo } from "@/components/parking-logo";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/logs", label: "Logs", icon: ClipboardList },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function AdminShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login");
    else setReady(true);
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!ready) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-[#f8faf9] text-[#172b24] lg:pl-[248px]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-[#132d25] px-5 text-white lg:flex">
        <Link href="/dashboard" className="flex h-24 items-center gap-3 border-b border-white/10 px-2">
          <ParkingLogo light caption="ADMIN CONSOLE" />
        </Link>
        <nav aria-label="Main navigation" className="mt-8 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
              className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${pathname === href ? "bg-[#2c5641] text-white" : "text-[#b6c9be] hover:bg-white/10 hover:text-white"}`}>
              <Icon size={18} strokeWidth={1.8} />{label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 py-5">
          <div className="mb-4 flex items-center gap-3 px-2">
            <span className="grid size-9 place-items-center rounded-full bg-[#315a45] text-xs font-bold">AD</span>
            <span><strong className="block text-sm">Admin</strong><span className="text-xs text-[#a6c5b3]">admin@parking.com</span></span>
          </div>
          <button onClick={handleLogout} className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#b6c9be] transition-colors hover:bg-white/10 hover:text-white"><LogOut size={18} />Logout</button>
        </div>
      </aside>

      <div className="border-b border-[#e3eae5] bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/dashboard"><ParkingLogo /></Link>
          <button onClick={handleLogout} aria-label="Logout" className="rounded-lg p-2 text-[#476353] hover:bg-[#edf5ef]"><LogOut size={18} /></button>
        </div>
        <nav aria-label="Mobile navigation" className="flex gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${pathname === href ? "bg-[#e6f3e9] text-[#17613a]" : "text-[#64796b]"}`}><Icon size={15} />{label}</Link>)}
        </nav>
      </div>

      <main className="mx-auto max-w-[1600px] px-4 pb-12 pt-6 sm:px-6 lg:px-9 lg:pt-9">
        <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div><h1 className="text-[26px] font-bold tracking-[-0.025em] sm:text-[30px]">{title}</h1><p className="mt-1 text-sm text-[#607268]">{subtitle}</p></div>
          <div className="hidden items-center gap-3 lg:flex"><span className="size-2 rounded-full bg-[#2ba65a]" /><span className="text-xs font-semibold text-[#41604c]">System live</span><span className="mx-2 h-6 w-px bg-[#dce5df]" /><span className="grid size-9 place-items-center rounded-full bg-[#e6f1e8] text-xs font-bold text-[#247346]">AD</span><span className="text-sm font-semibold">Admin</span><button onClick={handleLogout} className="ml-2 rounded-lg border border-[#dce5df] bg-white px-3 py-2 text-xs font-semibold hover:bg-[#f4f8f5]">Logout</button></div>
        </header>
        {children}
      </main>
    </div>
  );
}
