"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
}

interface LuxuryDropdownProps {
  id?: string;
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export default function LuxuryDropdown({
  id,
  label,
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  onClose,
  icon,
  className = "",
}: LuxuryDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption && selectedOption.value !== ""
    ? selectedOption.label
    : label;
  const isSelected = !!selectedOption && selectedOption.value !== "";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`group flex h-10 w-full items-center justify-between gap-1.5 rounded-[0.7rem] px-3 text-left text-xs font-medium transition-all duration-200 outline-none md:rounded-none ${
          isOpen
            ? "bg-[#f4ede2] text-[#1e1b17] ring-1 ring-[#b8924a]/30"
            : "bg-[#faf7f2]/60 hover:bg-[#f5f0e6] md:bg-transparent"
        } ${isSelected ? "text-[#1e1b17] font-semibold" : "text-[#7a7268]"}`}
      >
        <div className="flex min-w-0 items-center gap-1.5 truncate">
          {icon && (
            <span className="shrink-0 text-[#9a8f7e] transition-colors group-hover:text-[#b8924a]">
              {icon}
            </span>
          )}
          <span className="truncate">{displayLabel}</span>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[#9a8f7e] transition-transform duration-200 ease-out ${
            isOpen ? "rotate-180 text-[#b8924a]" : "group-hover:text-[#1e1b17]"
          }`}
        />
      </button>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[200px] w-full max-w-xs rounded-2xl border border-[#e5ddd0] bg-[#faf7f2]/98 p-1.5 shadow-[0_16px_36px_rgba(30,27,23,0.12),0_2px_8px_rgba(30,27,23,0.04)] ring-1 ring-black/5 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150 ease-out"
        >
          <div className="max-h-60 overflow-y-auto space-y-0.5 overscroll-contain pr-0.5">
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value || "__default"}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    onClose();
                  }}
                  className={`group/item flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all duration-150 ${
                    active
                      ? "bg-[#1e1b17] text-white font-semibold shadow-xs"
                      : "text-[#544d42] hover:bg-white hover:text-[#1e1b17] hover:shadow-2xs"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#d4af37]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
