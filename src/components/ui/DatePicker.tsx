"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import "react-day-picker/style.css";

function parseIso(iso: string): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DatePicker({
  value,
  onChange,
  min,
  icon = <CalendarIcon size={13} />,
  className,
}: {
  value: string;
  onChange: (iso: string) => void;
  min?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseIso(value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={
            className ??
            "flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-left text-sm text-foreground outline-none focus:border-accent data-[state=open]:border-accent"
          }
        >
          <span className="flex items-center gap-2">
            {icon}
            {selected
              ? selected.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Select date"}
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="rdp-theme card-surface z-[70] rounded-xl border border-border p-3 shadow-2xl shadow-black/40"
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onChange(toIso(date));
                setOpen(false);
              }
            }}
            disabled={(() => {
              const minDate = min ? parseIso(min) : undefined;
              return minDate ? { before: minDate } : undefined;
            })()}
            defaultMonth={selected}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
