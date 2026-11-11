export type SlotStatus = "FREE" | "OCCUPIED";
export type LogAction = "ENTRY" | "EXIT";

export interface Slot {
  id: number;
  slot_number: number;
  status: SlotStatus;
  plate_number: string | null;
  entry_time: string | null;
}

export interface ParkingLog {
  id: string;
  slot_number: number;
  plate_number: string;
  action: LogAction;
  time: string;
}

export interface ParkingSnapshot {
  slots: Slot[];
  logs: ParkingLog[];
}

// Pages depend on this interface, so a Supabase adapter can replace localStorage later.
export interface ParkingStore {
  read(): Promise<ParkingSnapshot>;
  enter(slotNumber: number): Promise<ParkingSnapshot>;
  leave(slotNumber: number): Promise<ParkingSnapshot>;
}

const STORAGE_KEY = "smart-parking:data:v1";
export const PARKING_UPDATED_EVENT = "smart-parking:updated";

export function emptySnapshot(): ParkingSnapshot {
  return {
    slots: [1, 2, 3].map((number) => ({
      id: number,
      slot_number: number,
      status: "FREE",
      plate_number: null,
      entry_time: null,
    })),
    logs: [],
  };
}

function isSnapshot(value: unknown): value is ParkingSnapshot {
  if (!value || typeof value !== "object") return false;
  const data = value as ParkingSnapshot;
  return Array.isArray(data.slots) && data.slots.length === 3 &&
    [1, 2, 3].every((number) => data.slots.some((slot) => slot.slot_number === number && (slot.status === "FREE" || slot.status === "OCCUPIED"))) &&
    Array.isArray(data.logs);
}

function read(): ParkingSnapshot {
  if (typeof window === "undefined") return emptySnapshot();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptySnapshot();
    const parsed: unknown = JSON.parse(stored);
    return isSnapshot(parsed) ? parsed : emptySnapshot();
  } catch {
    return emptySnapshot();
  }
}

function save(snapshot: ParkingSnapshot): ParkingSnapshot {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  window.dispatchEvent(new Event(PARKING_UPDATED_EVENT));
  return snapshot;
}

function nextPlate(logs: ParkingLog[]): string {
  // Demo plates are generated automatically so each simulation button is one click.
  const next = logs.filter((log) => log.action === "ENTRY").length + 1;
  return `DEMO-${String(next).padStart(3, "0")}`;
}

function updateSlot(slotNumber: number, action: LogAction): ParkingSnapshot {
  const current = read();
  const slot = current.slots.find((item) => item.slot_number === slotNumber);
  if (!slot) throw new Error("Parking slot not found.");
  if (action === "ENTRY" && slot.status === "OCCUPIED") throw new Error(`Slot ${slotNumber} is already occupied.`);
  if (action === "EXIT" && slot.status === "FREE") throw new Error(`Slot ${slotNumber} is already free.`);

  const now = new Date().toISOString();
  const plate = action === "ENTRY" ? nextPlate(current.logs) : slot.plate_number ?? "UNKNOWN";
  const updated: Slot = action === "ENTRY"
    ? { ...slot, status: "OCCUPIED", plate_number: plate, entry_time: now }
    : { ...slot, status: "FREE", plate_number: null, entry_time: null };
  return save({
    slots: current.slots.map((item) => item.slot_number === slotNumber ? updated : item),
    logs: [{ id: crypto.randomUUID(), slot_number: slotNumber, plate_number: plate, action, time: now }, ...current.logs],
  });
}

export const localParkingStore: ParkingStore = {
  read: async () => read(),
  enter: async (slotNumber) => updateSlot(slotNumber, "ENTRY"),
  leave: async (slotNumber) => updateSlot(slotNumber, "EXIT"),
};

export function isToday(value: string): boolean {
  const date = new Date(value);
  const today = new Date();
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
}

export function formatTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}
