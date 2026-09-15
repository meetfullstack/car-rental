"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { passwordRules } from "@/lib/validation";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  showChecklist = false,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showChecklist?: boolean;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);

  return (
    <div>
      <div className="relative">
        <input
          required
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 pr-10 text-sm outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>

      {showChecklist && (touched || value.length > 0) && (
        <ul className="mt-2 space-y-1">
          {passwordRules.map((rule) => {
            const passed = rule.test(value);
            return (
              <li
                key={rule.id}
                className={`flex items-center gap-1.5 text-xs ${
                  passed ? "text-accent" : "text-muted"
                }`}
              >
                {passed ? <Check size={12} /> : <X size={12} />}
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
