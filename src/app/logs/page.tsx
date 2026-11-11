"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { useParking } from "@/lib/use-parking";
import { formatDateTime, type LogAction } from "@/lib/parking-store";

export default function LogsPage() {
  const { logs } = useParking();
  const [query, setQuery] = useState("");
  const [action, setAction] = useState<"ALL" | LogAction>("ALL");
  const filtered = logs.filter((log) => (action === "ALL" || log.action === action) &&
    `${log.plate_number} ${log.slot_number}`.toLowerCase().includes(query.trim().toLowerCase()));

  return <AdminShell title="Parking Logs" subtitle="A complete history of simulated arrivals and departures.">
    <section className="overflow-hidden rounded-xl border border-[#e2eae4] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8eee9] p-5 sm:p-6">
        <div><h2 className="text-lg font-bold">All activity</h2><p className="mt-1 text-sm text-[#6b7d70]">{logs.length} total events</p></div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <label className="relative min-w-[180px] flex-1 sm:flex-none"><span className="sr-only">Search plate or slot</span><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#819487]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search plate or slot" className="h-10 w-full rounded-lg border border-[#dbe5dd] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#27814b] focus:ring-2 focus:ring-[#d4ebdb] sm:w-[210px]" /></label>
          <label><span className="sr-only">Filter action</span><select value={action} onChange={(event) => setAction(event.target.value as "ALL" | LogAction)} className="h-10 rounded-lg border border-[#dbe5dd] bg-white px-3 text-sm font-medium outline-none focus:border-[#27814b] focus:ring-2 focus:ring-[#d4ebdb]"><option value="ALL">All actions</option><option value="ENTRY">Entry</option><option value="EXIT">Exit</option></select></label>
        </div>
      </div>
      {filtered.length === 0 ? <div className="px-5 py-16 text-center text-sm text-[#6b7d70]">{logs.length === 0 ? "No parking events yet. Use the dashboard simulation controls to create one." : "No logs match your search."}</div> : <div className="overflow-x-auto"><table className="w-full min-w-[590px] text-left text-sm"><thead className="bg-[#f7faf7] text-xs font-semibold uppercase tracking-wide text-[#667a6b]"><tr><th className="px-5 py-3 sm:px-6">Time</th><th className="px-5 py-3">Slot</th><th className="px-5 py-3">Plate number</th><th className="px-5 py-3">Action</th></tr></thead><tbody className="divide-y divide-[#edf1ed]">{filtered.map((log) => <tr key={log.id}><td className="whitespace-nowrap px-5 py-4 text-[#566b5c] sm:px-6">{formatDateTime(log.time)}</td><td className="px-5 py-4 font-semibold">Slot {log.slot_number}</td><td className="px-5 py-4 font-mono text-xs font-semibold tracking-wide">{log.plate_number}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${log.action === "ENTRY" ? "bg-[#e5f3e9] text-[#176b3c]" : "bg-[#fff1df] text-[#946019]"}`}>{log.action}</span></td></tr>)}</tbody></table></div>}
    </section>
  </AdminShell>;
}
