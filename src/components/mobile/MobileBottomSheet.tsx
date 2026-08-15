"use client";

import React, { useEffect } from "react";
import { X, Check } from "lucide-react";
import { triggerHaptic } from "@/lib/mobile/capacitor";

interface OptionItem<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface MobileBottomSheetProps<T extends string> {
  open: boolean;
  onClose: () => void;
  title: string;
  options: OptionItem<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
}

export function MobileBottomSheet<T extends string>({
  open,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}: MobileBottomSheetProps<T>) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg bg-[#09090B] text-white border-t-2 border-x-2 border-gray-800 rounded-t-3xl p-6 space-y-5 shadow-2xl z-10 max-h-[80vh] overflow-y-auto animate-slide-up">
        {/* Drag Handle Indicator */}
        <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto" />

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-mono text-white uppercase tracking-wider">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {options.map((opt) => {
            const isSelected = opt.value === selectedValue;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  void triggerHaptic("light");
                  onSelect(opt.value);
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-purple-600/20 border-purple-500 text-white font-bold"
                    : "bg-gray-900/80 border-gray-800 text-gray-300 hover:bg-gray-800"
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{opt.label}</div>
                  {opt.description && (
                    <div className="text-xs text-gray-400 font-sans mt-0.5">{opt.description}</div>
                  )}
                </div>
                {isSelected && <Check className="w-5 h-5 text-purple-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
