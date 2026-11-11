"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, CarFront, Clock3, DoorOpen, Gauge, ParkingCircle, Play, Plus, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { useParking } from "@/lib/use-parking";
import { formatTime, isToday, localParkingStore, type ParkingLog, type Slot } from "@/lib/parking-store";

type GateState = "CLOSED" | "OPEN" | "PARKING FULL";

function StatCard({ label, value, icon: Icon, hint }: { label: string; value: number; icon: typeof ParkingCircle; hint: string }) {
  return <div className="rounded-xl border border-[#e2eae4] bg-white p-5">
    <div className="flex items-start justify-between"><span className="text-sm font-medium text-[#607268]">{label}</span><span className="grid size-9 place-items-center rounded-lg bg-[#edf5ef] text-[#267448]"><Icon size={18} strokeWidth={1.8} /></span></div>
    <div className="mt-4 text-[34px] font-bold leading-none tracking-[-0.04em] tabular-nums">{value}</div>
    <p className="mt-2 text-xs text-[#718276]">{hint}</p>
  </div>;
}

function SlotCard({ slot }: { slot: Slot }) {
  const occupied = slot.status === "OCCUPIED";
  return <article className={`flex min-h-[222px] flex-col justify-between rounded-xl border p-5 ${occupied ? "border-[#f2d0cb] bg-[#fff0ee]" : "border-[#c9e6d1] bg-[#eaf7ee]"}`}>
    <div className="flex items-start justify-between gap-2"><span className={`grid size-10 place-items-center rounded-lg ${occupied ? "bg-[#f9d9d4] text-[#b33d32]" : "bg-[#d5eddb] text-[#267448]"}`}><CarFront size={22} strokeWidth={1.8} /></span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${occupied ? "bg-[#f6d5d1] text-[#a5362d]" : "bg-[#d0ead7] text-[#17643b]"}`}>{slot.status}</span></div>
    <div><h3 className="text-xl font-bold tracking-tight">Slot {slot.slot_number}</h3><p className={`mt-1 text-sm font-semibold ${occupied ? "text-[#9e3c33]" : "text-[#277049]"}`}>{occupied ? slot.plate_number : "Ready for next car"}</p></div>
    <div className={`flex items-center gap-2 border-t pt-3 text-xs ${occupied ? "border-[#efcbc6] text-[#865952]" : "border-[#cce8d4] text-[#4e795e]"}`}><Clock3 size={14} />Entry time: {slot.entry_time ? formatTime(slot.entry_time) : "—"}</div>
  </article>;
}

function LogFeed({ logs }: { logs: ParkingLog[] }) {
  return <section className="rounded-xl border border-[#e2eae4] bg-white p-5">
    <div className="flex items-center justify-between"><h2 className="text-base font-bold">Live log feed</h2><Activity size={17} className="text-[#388656]" /></div>
    <p className="mt-1 text-xs text-[#718276]">Latest parking activity</p>
    {logs.length === 0 ? <div className="mt-8 rounded-lg bg-[#f6f9f6] px-4 py-8 text-center text-sm text-[#6b7d70]">No activity yet. Simulate a car entering to get started.</div> :
      <ol className="mt-5 max-h-[430px] space-y-0 overflow-y-auto pr-1">
        {logs.slice(0, 10).map((log) => <li key={log.id} className="flex gap-3 border-b border-[#edf1ed] py-3 last:border-0">
          <span className={`mt-1.5 size-2 shrink-0 rounded-full ${log.action === "ENTRY" ? "bg-[#2d9d57]" : "bg-[#d08a36]"}`} />
          <div className="min-w-0"><p className="text-sm font-medium text-[#293b30]">Car {log.action === "ENTRY" ? "entered" : "left"} Slot {log.slot_number}</p><p className="mt-0.5 text-xs text-[#728277]">{log.plate_number} · {formatTime(log.time)}</p></div>
        </li>)}
      </ol>}
  </section>;
}

export default function DashboardPage() {
  const { slots, logs } = useParking();
  const [gate, setGate] = useState<GateState>("CLOSED");
  const [message, setMessage] = useState("");
  const gateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (gateTimer.current) clearTimeout(gateTimer.current); }, []);

  const occupied = slots.filter((slot) => slot.status === "OCCUPIED").length;
  const free = slots.length - occupied;
  const todayCars = logs.filter((log) => log.action === "ENTRY" && isToday(log.time)).length;

  async function simulate(slotNumber: number, action: "ENTRY" | "EXIT") {
    try {
      if (action === "ENTRY") await localParkingStore.enter(slotNumber);
      else await localParkingStore.leave(slotNumber);
      setMessage(`Car ${action === "ENTRY" ? "entered" : "left"} Slot ${slotNumber}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Simulation failed.");
    }
  }

  async function simulateGate() {
    if (gateTimer.current) clearTimeout(gateTimer.current);
    const snapshot = await localParkingStore.read();
    setGate(snapshot.slots.some((slot) => slot.status === "FREE") ? "OPEN" : "PARKING FULL");
    gateTimer.current = setTimeout(() => setGate("CLOSED"), 3000);
  }

  return <AdminShell title="Smart Parking Dashboard" subtitle="Live overview of all three parking slots.">
    <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Slots" value={3} icon={ParkingCircle} hint="Parking capacity" />
      <StatCard label="Free Slots" value={free} icon={Gauge} hint="Available right now" />
      <StatCard label="Occupied" value={occupied} icon={CarFront} hint="Cars currently parked" />
      <StatCard label="Today's Cars" value={todayCars} icon={Activity} hint="Entries since midnight" />
    </div>

    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_290px] 2xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-6">
        <section>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Parking slots</h2><span className="flex items-center gap-2 text-xs font-medium text-[#607268]"><span className="size-2 rounded-full bg-[#2ba65a]" />Refreshes every 2 seconds</span></div>
          <div className="grid gap-4 sm:grid-cols-3">{slots.map((slot) => <SlotCard key={slot.id} slot={slot} />)}</div>
        </section>

        <section className="rounded-xl border border-[#e2eae4] bg-white p-5 sm:p-6">
          <div className="mb-5"><h2 className="text-lg font-bold">Simulation controls</h2><p className="mt-1 text-sm text-[#67796d]">Test each sensor event as if it came from an Arduino.</p></div>
          <div className="grid gap-3 sm:grid-cols-3">{slots.map((slot) => <div key={slot.id} className="rounded-lg border border-[#e6ece7] bg-[#fbfcfb] p-3">
            <h3 className="mb-3 text-sm font-bold">Slot {slot.slot_number}</h3>
            <div className="grid gap-2"><button onClick={() => simulate(slot.slot_number, "ENTRY")} disabled={slot.status === "OCCUPIED"} className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#176b3c] px-2 text-xs font-bold text-white hover:bg-[#11532f] disabled:cursor-not-allowed disabled:bg-[#dce6de] disabled:text-[#748477]"><Plus size={14} />Simulate Car Enters</button>
            <button onClick={() => simulate(slot.slot_number, "EXIT")} disabled={slot.status === "FREE"} className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#d7e3da] bg-white px-2 text-xs font-bold text-[#285b3a] hover:bg-[#f0f7f1] disabled:cursor-not-allowed disabled:text-[#a4b1a7]"><Play size={13} className="rotate-180" />Simulate Car Leaves</button></div>
          </div>)}</div>
          {message && <p role="status" className="mt-4 text-sm font-medium text-[#45674f]">{message}</p>}
        </section>
      </div>

      <div className="space-y-6">
        <section className={`rounded-xl border p-5 ${gate === "OPEN" ? "border-[#c9e6d1] bg-[#eaf7ee]" : gate === "PARKING FULL" ? "border-[#f2d0cb] bg-[#fff0ee]" : "border-[#e2eae4] bg-white"}`}>
          <div className="flex items-center justify-between"><h2 className="text-base font-bold">Gate Status</h2><DoorOpen size={19} className="text-[#43845a]" /></div>
          <div aria-live="polite" className={`mt-5 flex items-center gap-2 text-xl font-bold ${gate === "OPEN" ? "text-[#176b3c]" : gate === "PARKING FULL" ? "text-[#ad4035]" : "text-[#34493c]"}`}><span className={`size-2.5 rounded-full ${gate === "OPEN" ? "bg-[#2ba65a]" : gate === "PARKING FULL" ? "bg-[#d65b4d]" : "bg-[#83978a]"}`} />Gate: {gate}</div>
          <p className="mt-2 min-h-9 text-xs leading-relaxed text-[#607268]">{gate === "OPEN" ? "A free slot is available. The gate closes in 3 seconds." : gate === "PARKING FULL" ? "All three slots are occupied. Entry is denied." : "Waiting for a vehicle at the entrance."}</p>
          <button onClick={simulateGate} className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#173f2b] px-3 text-xs font-bold text-white hover:bg-[#0d3020]"><ShieldCheck size={16} />Simulate Car at Gate</button>
        </section>
        <LogFeed logs={logs} />
      </div>
    </div>
  </AdminShell>;
}
