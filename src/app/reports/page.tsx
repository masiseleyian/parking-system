"use client";

import { Activity, ArrowDownRight, ArrowUpRight, CarFront } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { useParking } from "@/lib/use-parking";
import { isToday } from "@/lib/parking-store";

export default function ReportsPage() {
  const { logs, slots } = useParking();
  const today = logs.filter((log) => isToday(log.time));
  const entries = today.filter((log) => log.action === "ENTRY").length;
  const exits = today.filter((log) => log.action === "EXIT").length;
  const occupied = slots.filter((slot) => slot.status === "OCCUPIED").length;
  const maximum = Math.max(1, ...[1, 2, 3].map((number) => logs.filter((log) => log.action === "ENTRY" && log.slot_number === number).length));

  return <AdminShell title="Reports" subtitle="Daily activity and parking usage at a glance.">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "Today's Entries", value: entries, icon: ArrowDownRight, color: "text-[#247346]" },
        { label: "Today's Exits", value: exits, icon: ArrowUpRight, color: "text-[#ad751f]" },
        { label: "Currently Parked", value: occupied, icon: CarFront, color: "text-[#ad4035]" },
        { label: "Total Events", value: logs.length, icon: Activity, color: "text-[#456d54]" },
      ].map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-xl border border-[#e2eae4] bg-white p-5"><div className="flex items-center justify-between text-sm font-medium text-[#607268]"><span>{label}</span><Icon size={20} className={color} /></div><div className="mt-5 text-[34px] font-bold leading-none tracking-[-0.04em] tabular-nums">{value}</div></div>)}
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
      <section className="rounded-xl border border-[#e2eae4] bg-white p-5 sm:p-6"><h2 className="text-lg font-bold">Slot usage</h2><p className="mt-1 text-sm text-[#6b7d70]">Total car entries by parking slot</p>
        <div className="mt-8 space-y-7">{[1, 2, 3].map((number) => { const count = logs.filter((log) => log.action === "ENTRY" && log.slot_number === number).length; return <div key={number}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold">Slot {number}</span><span className="text-[#607268]">{count} {count === 1 ? "car" : "cars"}</span></div><div className="h-3 overflow-hidden rounded-full bg-[#edf3ee]"><div className="h-full rounded-full bg-[#2c9254] transition-[width] duration-300" style={{ width: `${(count / maximum) * 100}%` }} /></div></div>; })}</div>
      </section>
      <section className="rounded-xl border border-[#e2eae4] bg-white p-5 sm:p-6"><h2 className="text-lg font-bold">Current capacity</h2><p className="mt-1 text-sm text-[#6b7d70]">Live snapshot of the parking area</p><div className="mt-8 flex items-end gap-2"><span className="text-[52px] font-bold leading-none tracking-[-0.05em] tabular-nums">{occupied}</span><span className="pb-1 text-lg text-[#6b7d70]">/ 3 occupied</span></div><div className="mt-5 flex gap-2">{slots.map((slot) => <div key={slot.id} className={`h-3 flex-1 rounded-full ${slot.status === "OCCUPIED" ? "bg-[#d45b4e]" : "bg-[#4cad6d]"}`} title={`Slot ${slot.slot_number}: ${slot.status}`} />)}</div><div className="mt-4 flex justify-between text-xs font-medium text-[#66796d]"><span>{3 - occupied} free</span><span>{Math.round((occupied / 3) * 100)}% occupancy</span></div></section>
    </div>
  </AdminShell>;
}
