"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { PlannerData, PlannerExercise } from "@/lib/queries";

// ─── Custom stack types ─────────────────────────────────────────────────────

type StackEntry = PlannerExercise & {
  regionSlug: string;
  regionName: string;
  columnKey: string;
};

type ContextMenuState = {
  x: number;
  y: number;
  exercise: PlannerExercise;
  regionSlug: string;
  regionName: string;
  columnKey: string;
};

// ─── Equipment label helpers ────────────────────────────────────────────────

const equipmentLabels: Record<string, string> = {
  "anchor-point": "Anchor point",
  "barbell": "Barbell",
  "belt": "Belt",
  "bench": "Bench",
  "calf-raise-machine": "Calf-raise machine",
  "chair": "Chair",
  "dumbbell": "Dumbbell",
  "flexbar": "FlexBar",
  "foam-roller": "Foam roller",
  "hammer": "Hammer",
  "kettlebell": "Kettlebell",
  "landmine-attachment": "Landmine",
  "leg-press-machine": "Leg-press machine",
  "plyo-box": "Plyo box",
  "pressure-biofeedback-unit": "Pressure biofeedback unit",
  "resistance-band": "Resistance band",
  "rubber-band": "Rubber band",
  "sliders": "Sliders",
  "step": "Step",
  "therapy-ball": "Therapy ball",
  "therapy-putty": "Therapy putty",
  "wrist-splint": "Wrist splint",
};

function labelEquipment(slug: string): string {
  return equipmentLabels[slug] ?? slug.replace(/-/g, " ");
}

// ─── Role badge ─────────────────────────────────────────────────────────────

const roleColors: Record<string, string> = {
  primary: "bg-indigo-100 text-indigo-800",
  secondary: "bg-purple-100 text-purple-800",
  stabilizer: "bg-teal-100 text-teal-800",
  synergist: "bg-sky-100 text-sky-800",
  common_association: "bg-gray-100 text-gray-700",
};

const roleLabels: Record<string, string> = {
  primary: "Primary",
  secondary: "Secondary",
  stabilizer: "Stabilizer",
  synergist: "Synergist",
  common_association: "Associated",
};

// ─── Exercise chip with hover tooltip ───────────────────────────────────────

function ExerciseChip({
  exercise,
  onContextMenu,
  inStack = false,
  onRemove,
}: {
  exercise: PlannerExercise;
  onContextMenu?: (e: React.MouseEvent) => void;
  inStack?: boolean;
  onRemove?: () => void;
}) {
  const grouped = useMemo(() => {
    const m: Record<string, { name: string; slug: string }[]> = {};
    for (const mu of exercise.muscles) {
      if (!m[mu.role]) m[mu.role] = [];
      m[mu.role].push({ name: mu.name, slug: mu.slug });
    }
    return m;
  }, [exercise.muscles]);

  const roleOrder = ["primary", "secondary", "synergist", "stabilizer", "common_association"];

  return (
    <div className="group relative inline-block">
      <Link
        href={`/exercises/${exercise.slug}`}
        onContextMenu={onContextMenu}
        className={
          inStack
            ? "inline-block max-w-full truncate rounded border border-indigo-300 bg-indigo-50 px-2 py-1 pr-6 text-xs text-indigo-800 hover:border-indigo-400 hover:bg-indigo-100"
            : "inline-block max-w-full truncate rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        }
      >
        {exercise.name}
      </Link>
      {inStack && onRemove ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${exercise.name} from stack`}
          title="Remove from stack"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded px-1 text-[10px] font-bold leading-none text-indigo-400 hover:bg-indigo-200 hover:text-indigo-900"
        >
          ×
        </button>
      ) : null}

      {/* Tooltip */}
      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 hidden w-64 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg group-hover:block">
        <div className="mb-2 text-xs font-semibold text-gray-900">{exercise.name}</div>

        {roleOrder.map((role) =>
          grouped[role] && grouped[role].length > 0 ? (
            <div key={role} className="mb-1.5 last:mb-0">
              <span
                className={`mr-1.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${roleColors[role] ?? ""}`}
              >
                {roleLabels[role] ?? role}
              </span>
              <span className="text-[11px] text-gray-700">
                {grouped[role].map((mu) => mu.name).join(", ")}
              </span>
            </div>
          ) : null,
        )}

        {exercise.equipment.length > 0 && (
          <div className="mt-2 border-t border-gray-100 pt-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Equipment
            </span>
            <div className="mt-0.5 text-[11px] text-gray-600">
              {exercise.equipment.map(labelEquipment).join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main planner grid ─────────────────────────────────────────────────────

export function PlannerGrid({ data }: { data: PlannerData }) {
  // Equipment toggle state — default: every equipment available
  const [availableEquipment, setAvailableEquipment] = useState<Set<string>>(
    () => new Set(data.equipment),
  );
  const [bodyweightOn, setBodyweightOn] = useState(true);

  // ─── Custom stack state ──────────────────────────────────────────────────
  // Map from movement column key → list of chosen exercises (preserving
  // the region they came from so exports stay meaningful).
  const [stack, setStack] = useState<Record<string, StackEntry[]>>({});
  const [menu, setMenu] = useState<ContextMenuState | null>(null);

  // Close context menu on any outside interaction or escape.
  useEffect(() => {
    if (!menu) return;
    function close() {
      setMenu(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  function addToStack(entry: StackEntry) {
    setStack((prev) => {
      const existing = prev[entry.columnKey] ?? [];
      if (existing.some((e) => e.id === entry.id)) return prev;
      return {
        ...prev,
        [entry.columnKey]: [...existing, entry].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      };
    });
  }

  function removeFromStack(columnKey: string, exerciseId: string) {
    setStack((prev) => {
      const existing = prev[columnKey] ?? [];
      const next = existing.filter((e) => e.id !== exerciseId);
      const copy = { ...prev };
      if (next.length === 0) delete copy[columnKey];
      else copy[columnKey] = next;
      return copy;
    });
  }

  function clearStack() {
    setStack({});
  }

  const stackEntries = useMemo(
    () => Object.values(stack).flat(),
    [stack],
  );

  function exportStackJSON() {
    const payload = {
      schema: "body-iq-gsd.custom-stack/v1",
      exportedAt: new Date().toISOString(),
      coverage: {
        columnsCovered: Object.keys(stack).length,
        totalMovementColumns: data.movementColumns.length,
        uncoveredColumns: data.movementColumns.filter(
          (c) => !(stack[c] && stack[c].length > 0),
        ),
      },
      equipmentFilter: {
        bodyweight: bodyweightOn,
        available: Array.from(availableEquipment).sort(),
      },
      exerciseCount: stackEntries.length,
      byColumn: data.movementColumns
        .filter((col) => stack[col] && stack[col].length > 0)
        .map((col) => ({
          column: col,
          exercises: stack[col].map((ex) => ({
            id: ex.id,
            slug: ex.slug,
            name: ex.name,
            regionSlug: ex.regionSlug,
            regionName: ex.regionName,
            equipment: ex.equipment,
            muscles: ex.muscles,
          })),
        })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `custom-stack-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ─── Click-and-drag horizontal scroll ────────────────────────────────────
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startScrollLeft: number;
    startScrollTop: number;
    moved: boolean;
  }>({ active: false, startX: 0, startY: 0, startScrollLeft: 0, startScrollTop: 0, moved: false });

  function isInteractiveTarget(el: EventTarget | null): boolean {
    if (!(el instanceof HTMLElement)) return false;
    return !!el.closest("a, button, input, label, select, textarea");
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Only left-click / primary pointer
    if (e.button !== 0) return;
    // Don't hijack clicks on links, buttons, or inputs
    if (isInteractiveTarget(e.target)) return;
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startScrollLeft: el.scrollLeft,
      startScrollTop: el.scrollTop,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const s = dragState.current;
    if (!s.active) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (!s.moved && Math.hypot(dx, dy) > 4) s.moved = true;
    el.scrollLeft = s.startScrollLeft - dx;
    el.scrollTop = s.startScrollTop - dy;
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const s = dragState.current;
    if (!s.active) return;
    s.active = false;
    const el = scrollRef.current;
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
    }
  }

  function toggleEquipment(slug: string) {
    setAvailableEquipment((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function selectAllEquipment() {
    setAvailableEquipment(new Set(data.equipment));
    setBodyweightOn(true);
  }

  function clearAllEquipment() {
    setAvailableEquipment(new Set());
    setBodyweightOn(false);
  }

  // Filter exercises against available equipment.
  // An exercise is shown if every piece of its required equipment is available.
  // Bodyweight (no equipment) exercises are gated by `bodyweightOn`.
  function exerciseAllowed(ex: PlannerExercise): boolean {
    if (ex.equipment.length === 0) return bodyweightOn;
    return ex.equipment.every((eq) => availableEquipment.has(eq));
  }

  // Hide empty columns (movements where no region has a visible exercise)
  const visibleColumns = useMemo(() => {
    return data.movementColumns.filter((col) => {
      for (const region of data.regions) {
        const list = data.cells[region.slug]?.[col] ?? [];
        if (list.some(exerciseAllowed)) return true;
      }
      return false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, availableEquipment, bodyweightOn]);

  // Hide empty rows (regions where every cell is empty after filtering)
  const visibleRegions = useMemo(() => {
    return data.regions.filter((region) => {
      const row = data.cells[region.slug] ?? {};
      for (const col of data.movementColumns) {
        const list = row[col] ?? [];
        if (list.some(exerciseAllowed)) return true;
      }
      return false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, availableEquipment, bodyweightOn]);

  const totalVisible = useMemo(() => {
    const seen = new Set<string>();
    for (const region of data.regions) {
      const row = data.cells[region.slug] ?? {};
      for (const col of data.movementColumns) {
        for (const ex of row[col] ?? []) {
          if (!exerciseAllowed(ex)) continue;
          seen.add(ex.id);
        }
      }
    }
    return seen.size;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, availableEquipment, bodyweightOn]);

  return (
    <div className="flex gap-6">
      {/* Equipment sidebar */}
      <aside className="w-60 shrink-0">
        <div className="sticky top-6 max-h-[calc(100vh-4rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Equipment</h2>
            <div className="flex gap-1.5 text-[10px]">
              <button
                onClick={selectAllEquipment}
                className="text-indigo-600 hover:text-indigo-800"
              >
                All
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={clearAllEquipment}
                className="text-indigo-600 hover:text-indigo-800"
              >
                None
              </button>
            </div>
          </div>

          <p className="mb-3 text-[11px] text-gray-500">
            Toggle the equipment you have on hand. Exercises requiring missing
            equipment are hidden.
          </p>

          <label className="mb-2 flex cursor-pointer items-center gap-2 rounded border border-gray-100 bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-700 hover:border-indigo-200">
            <input
              type="checkbox"
              checked={bodyweightOn}
              onChange={() => setBodyweightOn((v) => !v)}
              className="h-3.5 w-3.5"
            />
            Bodyweight
            <span className="ml-auto text-[10px] text-gray-400">no gear</span>
          </label>

          <div className="space-y-1">
            {data.equipment.map((eq) => (
              <label
                key={eq}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={availableEquipment.has(eq)}
                  onChange={() => toggleEquipment(eq)}
                  className="h-3.5 w-3.5"
                />
                {labelEquipment(eq)}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workout Planner</h1>
            <p className="mt-1 text-sm text-gray-500">
              Plan a session by joint × movement. Hover an exercise for muscle
              activation. Click for full details.
            </p>
          </div>
          <div className="text-xs text-gray-500">
            {totalVisible} exercise{totalVisible !== 1 ? "s" : ""} available
          </div>
        </div>

        <div
          ref={scrollRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="planner-scroll overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm"
          style={{ cursor: "grab", maxHeight: "calc(100vh - 10rem)" }}
        >
          <table className="w-full border-collapse select-none text-left">
            <thead>
              <tr>
                <th
                  className="sticky left-0 top-0 z-30 w-44 border-b border-r border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
                  scope="col"
                >
                  Region
                </th>
                {visibleColumns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="sticky top-0 z-20 min-w-[170px] border-b border-r border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700 last:border-r-0"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRegions.length === 0 || visibleColumns.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="px-4 py-12 text-center text-sm text-gray-500"
                  >
                    No exercises match the selected equipment. Toggle some on in
                    the sidebar.
                  </td>
                </tr>
              ) : (
                visibleRegions.map((region) => {
                  const row = data.cells[region.slug] ?? {};
                  return (
                    <tr key={region.slug} className="align-top hover:bg-gray-50/40">
                      <th
                        scope="row"
                        className="sticky left-0 z-10 w-44 border-b border-r border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800"
                      >
                        <Link
                          href={`/regions/${region.slug}`}
                          className="hover:text-indigo-700"
                        >
                          {region.name}
                        </Link>
                      </th>
                      {visibleColumns.map((col) => {
                        const list = (row[col] ?? []).filter(exerciseAllowed);
                        return (
                          <td
                            key={col}
                            className="border-b border-r border-gray-200 px-2 py-2 align-top last:border-r-0"
                          >
                            {list.length === 0 ? (
                              <span className="text-gray-200">—</span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {list.map((ex) => (
                                  <ExerciseChip
                                    key={ex.id}
                                    exercise={ex}
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      setMenu({
                                        x: e.clientX,
                                        y: e.clientY,
                                        exercise: ex,
                                        regionSlug: region.slug,
                                        regionName: region.name,
                                        columnKey: col,
                                      });
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* ─── Custom stack: separated by a gap spacer row ─────────── */}
            {visibleColumns.length > 0 && (
              <tbody>
                {/* Gap spacer */}
                <tr aria-hidden="true">
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="border-0 bg-gray-50/60 p-0"
                    style={{ height: "1.25rem" }}
                  />
                </tr>
                {/* Stack header */}
                <tr>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 w-44 border-b border-t border-r border-gray-200 bg-indigo-50 px-3 py-2 text-left text-sm font-semibold text-indigo-900"
                  >
                    My Stack
                  </th>
                  {visibleColumns.map((col) => {
                    const filled = (stack[col]?.length ?? 0) > 0;
                    return (
                      <th
                        key={col}
                        scope="col"
                        className={`min-w-[170px] border-b border-t border-r border-gray-200 px-3 py-1 text-[10px] font-medium uppercase tracking-wider last:border-r-0 ${
                          filled
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {filled ? "✓ covered" : "empty"}
                      </th>
                    );
                  })}
                </tr>
                {/* Stack content row */}
                <tr className="align-top">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 w-44 border-b border-r border-gray-200 bg-white px-3 py-2 align-top text-xs text-gray-600"
                  >
                    Right-click any exercise above to add it here.
                  </th>
                  {visibleColumns.map((col) => {
                    const list = stack[col] ?? [];
                    return (
                      <td
                        key={col}
                        className="border-b border-r border-gray-200 px-2 py-2 align-top last:border-r-0"
                      >
                        {list.length === 0 ? (
                          <span className="text-gray-200">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {list.map((ex) => (
                              <ExerciseChip
                                key={ex.id}
                                exercise={ex}
                                inStack
                                onRemove={() => removeFromStack(col, ex.id)}
                              />
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            )}
          </table>
        </div>

        {/* ─── Stack summary + export controls ──────────────────────────── */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="text-xs text-gray-600">
            <span className="font-semibold text-gray-900">
              {stackEntries.length}
            </span>{" "}
            exercise{stackEntries.length === 1 ? "" : "s"} in stack ·{" "}
            <span className="font-semibold text-gray-900">
              {Object.keys(stack).length}
            </span>
            /{visibleColumns.length} column
            {visibleColumns.length === 1 ? "" : "s"} covered
            {visibleColumns.length > 0 &&
            Object.keys(stack).length < visibleColumns.length ? (
              <span className="ml-2 text-amber-700">
                — still uncovered:{" "}
                {visibleColumns
                  .filter((c) => !(stack[c] && stack[c].length > 0))
                  .slice(0, 6)
                  .join(", ")}
                {visibleColumns.filter(
                  (c) => !(stack[c] && stack[c].length > 0),
                ).length > 6
                  ? "…"
                  : ""}
              </span>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearStack}
              disabled={stackEntries.length === 0}
              className="rounded border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={exportStackJSON}
              disabled={stackEntries.length === 0}
              className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* ─── Right-click context menu ─────────────────────────────────── */}
      {menu ? (
        <div
          role="menu"
          className="fixed z-50 min-w-[12rem] overflow-hidden rounded-md border border-gray-200 bg-white text-xs shadow-lg"
          style={{ left: menu.x, top: menu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-gray-100 bg-gray-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            {menu.exercise.name}
          </div>
          <button
            type="button"
            role="menuitem"
            className="block w-full px-3 py-2 text-left hover:bg-indigo-50 hover:text-indigo-700"
            onClick={() => {
              addToStack({
                ...menu.exercise,
                regionSlug: menu.regionSlug,
                regionName: menu.regionName,
                columnKey: menu.columnKey,
              });
              setMenu(null);
            }}
          >
            Add to My Stack
            <span className="ml-2 text-[10px] text-gray-400">
              ({menu.columnKey})
            </span>
          </button>
          <Link
            href={`/exercises/${menu.exercise.slug}`}
            role="menuitem"
            className="block border-t border-gray-100 px-3 py-2 hover:bg-gray-50"
            onClick={() => setMenu(null)}
          >
            Open exercise page →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
