# Smart Parking System

A three-slot parking admin dashboard for a final year project. It simulates Arduino occupancy and gate events in the browser.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/login` or `/dashboard` based on the stored demo session.

Demo credentials: **admin@parking.com** / **admin123**.

## Pages

- `/login` — demo admin sign-in, with a persistent localStorage session.
- `/dashboard` — live counts, three slot cards, gate status, recent activity, and simulation controls.
- `/logs` — searchable, filterable entry and exit history.
- `/reports` — daily totals, current capacity, and usage by slot.

The dashboard reads localStorage every two seconds. Changes also appear immediately in the current tab and across browser tabs. Entering a car generates a `DEMO-001` style plate. Gate simulation opens the gate for three seconds when any slot is free; otherwise it displays `PARKING FULL`.

## Data design

The browser store is in [`src/lib/parking-store.ts`](src/lib/parking-store.ts). Its `ParkingStore` interface exposes `read`, `enter`, and `leave`, so a future Supabase implementation can replace `localParkingStore` without changing the pages. The matching PostgreSQL tables and seed slots are in [`supabase/schema.sql`](supabase/schema.sql).

| Table | Fields |
| --- | --- |
| `slots` | `id`, `slot_number`, `status`, `plate_number`, `entry_time` |
| `logs` | `id`, `slot_number`, `plate_number`, `action`, `time` |

The demo login is client-side and is suitable for testing only. Before deployment with real users, replace it with Supabase Auth, add admin-specific row level security policies, and move slot updates plus log inserts into a single server-side transaction. Gate state is transient UI state; hardware integration will need a durable gate controller and sensor event endpoint.

The [system design notes](https://github.com/liquidslr/system-design-notes) linked for this project informed the explicit separation of requirements, data model, current limitations, and migration path. This demo deliberately stays small for three slots.

## Scripts

- `npm run dev` — start Next.js locally
- `npm run typecheck` — check TypeScript
- `npm run build` — build the app
