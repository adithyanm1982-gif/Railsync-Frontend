# RailSync Simulation Update — How to Apply

This zip contains ONLY the redesigned Simulation feature, as requested.
It does not touch anything else in the frontend.

## What's inside

```
src/features/simulation/          <-- REPLACE your existing folder entirely with this one
src/pages/SimulationPage.tsx      <-- REPLACE this one file
src/pages/CoordinationPage.tsx    <-- REPLACE this one file
```

## How to apply

1. **Delete** your existing `src/features/simulation/` folder completely,
   then copy this zip's `src/features/simulation/` in its place.
   (The internal structure changed — old files like `trackLayout.ts`,
   `blockZones.ts`, `TrackTopologyRenderer.ts` etc. are gone, replaced
   by `lineGeometry.ts`, `lineTopology.ts`, `simCalendar.ts`, and
   restructured engine/component files. A partial merge will break —
   delete-and-replace the whole folder.)

2. **Replace** `src/pages/SimulationPage.tsx` with this zip's version.
   It now uses `DayNavigator`, `FleetMonitorPanel`, and the new
   `engineControls` shape (`seekTo`, `jumpToDay`, `stepForward`,
   `stepBackward` in addition to zoom/reset).

3. **Replace** `src/pages/CoordinationPage.tsx` with this zip's version.
   It previously imported `MaintenanceHoverPopover` with a `block` prop
   from the old mock data; the new component takes an `entry` prop
   (a real schedule record). This version also upgrades Coordination
   to do real joint-block detection against the actual 108-entry
   schedule dataset instead of showing mock cards.

Nothing else in the project needs to change. `mock-data/mockBlocks.ts`,
`mock-data/mockTrackTopology.ts`, and `mock-data/mockTrains.ts` are left
alone — no other page depends on the simulation feature internally, so
this is a self-contained swap.

## What changed, and why

**Topology is now the real one from your data**, not an invented 4-8-4
fan:
- 5 real stations (ST01–ST05), chained by 4 real corridors (C01–C04),
  each linking one consecutive station pair — this is exactly what the
  420-task and 108-schedule datasets showed (`C01`: ST01↔ST02, `C02`:
  ST02↔ST03, etc).
- Each corridor has 4 real **Blocks** — these are your actual
  `subsection_id`s (`C01-S01` .. `C01-S04`). Rendered as dashed
  vertical divider lines with labels, always visible, matching the
  first reference image's "B1 | B2 | B3..." style.
- Each Block is further divided into 4 invisible **Sub-Blocks**
  (`C01-S02-TC1..TC4`) — these only become visible (faint dashed lines
  + labels) once you zoom in past ~3.6x, per your ask.
- Each station is a junction with mainline through-tracks plus local
  loop/siding stubs fanning off it, and a platform box with platform
  numbers — styled after the second/third reference images.

**Maintenance-block highlights are 100% real**, sourced from the
108-entry `GET /api/schedules/` snapshot you sent (embedded in
`data/realSchedules.ts`). A block glows exactly when the sim clock's
current real date+time falls inside that entry's real
`[start_time, end_time)` window (including entries that cross
midnight). Hovering shows the actual record: department, maintenance
type, priority score, match score, safety buffer, etc.

**Trains are still synthetic.** None of the 4 JSON files you sent
contain train positions or a timetable — the 108 schedule entries are
maintenance blocks, and `expected_train_count` is 0/`UNKNOWN` on every
one of them. So `TrainMotionCalculator.generateFleet()` creates a
small illustrative fleet that runs continuously across the whole real
7-day window. If/when a real train-position feed exists, swap that one
function — nothing else needs to change.

**7-day navigation is now built around the real calendar**
(`canvas/physics/simCalendar.ts`), not an abstract "Day N of 7" loop:
- `DayNavigator` — 7 tabs, one per real date (Thu 2026-08-27 through
  Wed 2026-09-02). Click any tab to jump straight there.
- Continuous scrubber — drag to any instant across the full week.
- Play/pause + speed selector, now 1x–180x, so you can skim the whole
  week in a couple of minutes or step through a specific hour slowly.
- All three are independent — dragging the scrubber, hitting a day
  tab, or stepping ±5min all work identically whether the sim is
  playing or paused.

**Zoom (LOD) is now 3-tier** instead of 2 (`ZoomLODController.ts`):
MACRO (line overview + Blocks) → MID (~2.2x: signals, platform
numbers, point-switch labels fade in) → MICRO (~3.6x: Sub-Blocks plus
sensor-readout HUD chips — wheel accel / brake pressure / axle load —
styled after your third reference image).

## Known limitation to flag back to your backend team

Real schedule entries reference `subsection_id` values like
`C01-S02`; the topology assumes exactly 4 stations × 4 corridors × 4
blocks each, which is what both the 420-task and 108-schedule files
showed. If the real dataset ever adds a 5th corridor or a different
block count per corridor, `lineTopology.ts`'s `STATION_ORDER` /
`CORRIDOR_ORDER` / `BLOCKS_PER_CORRIDOR` constants will need updating
to match — it's not auto-derived from the data on purpose, since not
every block necessarily has a schedule entry in any given 7-day
window (deriving structure from schedules would silently drop empty
blocks).
