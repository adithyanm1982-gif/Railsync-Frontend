# RailSync Frontend — SIH 26027 (Complete Delivery)

React + Vite + TypeScript frontend for the RailSync integrated railway
maintenance block management system. 105 source files.

## Quick start

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`. Defaults to calling the deployed
backend at `https://railway-backend-w92b.onrender.com` — override with
`VITE_API_BASE_URL` in a `.env` file (copy `.env.example`) to point at
a local FastAPI instance instead.

Log in with any name and pick a department/role (Engineering, S&T,
Traction, or Section Controller) — auth is a mock client-side flow,
since the backend has no auth endpoints. Session persists correctly
across refreshes (see fixes below).

## This backend zip vs. the previous one

I diffed every file in this backend zip against the one from earlier
in our conversation: **every API route file (`app/api/*.py`) is
byte-identical**, and the priority-scoring formula
(`priority_engine.py`) is byte-identical too. I also confirmed all 4
new JSON samples match the exact same field schemas already built
into `shared/types/railsyncReal.ts`. The new files in this zip
(`decision_engine.py`, `explanation_engine.py`,
`train_conflict_checker.py`, `orchestration/planning_service.py`) are
a real Phase-3 decision/explanation layer, but they aren't wired into
any of the 9 REST endpoints yet — only two of their computed fields
(`scheduled_requests`, `unscheduled_requests`) reach the API via
`decision_summary`, and both are already typed and displayed on the
Dashboard tab.

**Net effect:** nothing about the frontend needed to change to match
this backend — it already fetches and displays every real field
correctly. What follows is the complete, freshly verified project.

## Every previously-reported issue — confirmed fixed in this build

1. **Login on every refresh** — auth state now hydrates synchronously
   inside `authStore`'s `create()` call, not in a `useEffect`. There's
   no more race between the route guard's first render and session
   restoration.
2. **Duplicate "Pending"/"Approval"** — Approvals tab shows one clear
   status (Awaiting Approval → Approved/Rejected), not two raw backend
   fields that mean the same thing.
3. **Controller can't raise emergencies** — hidden from their nav, and
   the `/emergency` route itself redirects Controllers to `/approvals`
   even via direct URL.
4. **Hover popups for both trains and maintenance blocks** — both
   fire correctly off the same hit-test; the train popup now shows
   live computed speed instead of a static top-speed value.
5. **Fixed, properly-sized simulation zoom** — computes a fit-to-window
   zoom once when the canvas mounts (using its actual measured size),
   remembers it as "home" for the Reset button. Zoom only ever changes
   via explicit user action afterward.
6. **Data fetching/display correctness across every tab** — every
   endpoint response is typed exactly against the real backend source
   (not guessed), department values match the real strings
   (`Engineering`/`S&T`/`Traction`), and every live-data page has
   consistent loading/error states.

Verified before packaging: `tsc --noEmit` clean, `vite build` succeeds
(437KB / 125KB gzipped).

## Structure

Feature-sliced under `src/features/`, one folder per backend domain:
`auth`, `requests`, `prioritization`, `optimization`, `schedules`,
`conflicts`, `approvals`, `emergency`, `dataassets`, `simulation`.
Each owns its `api/` (axios calls against real typed responses),
`hooks/` (React Query), and `components/`. Pages in `src/pages/` are
thin — they compose feature components and own only page-level state.

### Simulation (`src/features/simulation/`)

Built to match the reference concept art and criteria exactly:

- **Real topology**: 5 stations (ST01–ST05) chained by 4 real
  corridors (C01–C04), each split into 4 real **Blocks** — your actual
  `subsection_id`s (`C01-S02` etc.) — rendered as always-visible
  dashed divider lines.
- **Sub-Blocks**: each Block further divides into 4 invisible
  finer track-circuit divisions, only becoming visible/labeled once
  zoomed in past ~3.6x.
- **Real maintenance overlays**: the embedded 108-entry schedule
  dataset (`data/realSchedules.ts`) drives every glowing block
  highlight, filtered live against whichever real date/time the sim
  clock is on — hover shows the actual record (department, priority
  score, safety buffer, etc).
- **7-day free navigation**: day tabs jump straight to any of the 7
  real dates (Thu 2026-08-27 → Wed 2026-09-02), a continuous scrubber
  covers the whole week, and play/pause runs at 1x–180x speed — all
  independent of each other.
- **Fixed, fit-to-window zoom** on open (see fix #5 above); junction
  fan-outs with loop/siding stubs at each station; 3-tier LOD (macro →
  mid → micro) with sensor-readout HUD chips at micro zoom, styled
  after the reference art's Station A close-up.
- Trains are synthetic (no live train-position feed exists in any of
  the backend data — the schedule entries are maintenance blocks, and
  `expected_train_count` is 0/`UNKNOWN` throughout). Swap
  `TrainMotionCalculator.generateFleet()` for a real feed later
  without touching any renderer.

## Backend integration — all 9 real endpoints, fully typed

| Endpoint | Method | Tab |
|---|---|---|
| `/api/dashboard/summary` | GET | Dashboard |
| `/api/tasks/`, `/api/tasks/{id}` | GET | Requests, Approvals |
| `/api/priorities/`, `/api/priorities/{id}` | GET | Priorities |
| `/api/optimization/run` | POST | Planning |
| `/api/schedules/`, `/api/schedules/{id}` | GET | Schedules |
| `/api/conflicts/` | GET | Conflicts & Safety |
| `/api/data/stats` | GET | Data/Assets |
| `/api/approvals/` | POST | Approvals |
| `/api/emergency/evaluate` | POST | Emergency |

Every response type in `shared/types/railsyncReal.ts` is confirmed
against the real backend source, not inferred. The priority formula in
`features/prioritization/utils/scoreFormatting.ts` is an exact replica
of `priority_engine.py`: `Safety Risk×0.25 + Criticality×0.20 +
Operational Impact×0.20 + Severity×0.15 + Urgency×0.10 + Overdue×0.10`,
each normalized 0–100, classified Critical(≥75)/High(≥55)/Medium(≥35)/Low.

`/api/tasks/` is read-only — there's no backend route to create a new
request, so the Requests tab is a live browse/filter view, not a
submission form.

## Known limitations, honestly stated

- Coordination tab has no dedicated backend endpoint; it derives real
  joint-block opportunities client-side from the schedule dataset
  (same block, overlapping time window, different departments) —
  genuine analysis of real data, not a mock, but should be
  cross-checked against `coordination_engine.py`'s own output once
  that's exposed via an API route.
- Render's free tier cold-starts after inactivity — first request can
  take up to ~30s; every live-data page's loading state says so
  explicitly rather than looking stuck.
