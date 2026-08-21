"use client";

import { typeColor } from "@/lib/types";

export default function TypeTabs({
  types,
  active,
  onChange,
}: {
  types: string[];
  active: string | null;
  onChange: (type: string | null) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto">
      <Tab label="All" isActive={active === null} onClick={() => onChange(null)} />
      {types.map((t) => (
        <Tab
          key={t}
          label={t}
          color={typeColor(t)}
          isActive={active === t}
          onClick={() => onChange(t)}
        />
      ))}
    </div>
  );
}

function Tab({
  label,
  color,
  isActive,
  onClick,
}: {
  label: string;
  color?: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 font-body text-sm transition-colors ${
        isActive
          ? "border-transparent text-ink font-medium"
          : "border-white/10 bg-surface text-parchment/80 hover:text-parchment"
      }`}
      style={{
        backgroundColor: isActive ? color ?? "#C99A3E" : undefined,
        borderColor: !isActive && color ? `${color}66` : undefined,
      }}
    >
      {color && (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: isActive ? "rgba(15,27,21,0.55)" : color }}
        />
      )}
      {label}
    </button>
  );
}
