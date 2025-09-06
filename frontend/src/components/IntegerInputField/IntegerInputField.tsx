// src/components/IntegerExtras.tsx
import React, { useEffect, useMemo, useState } from "react";


type IntegerValue = number | null;
type IntegerInputSize = "sm" | "md" | "lg";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

const sizeMap = {
  sm: { input: "h-8 text-sm px-2", btn: "h-8 px-2 text-sm" },
  md: { input: "h-10 text-base px-3", btn: "h-10 px-3 text-base" },
  lg: { input: "h-11 text-base px-3", btn: "h-11 px-3 text-base" },
} as const;

function toHalfWidthDigits(input: string): string {
  return input
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    .replace(/[－ー―‐–—]/g, "-");
}
function isIntegerTyping(s: string): boolean {
  return /^-?\d*$/.test(s);
}

export interface IntegerStepperFieldProps {
  value?: IntegerValue;
  onChange: (v: IntegerValue) => void;
  min?: number;
  max?: number;
  step?: number;              // 既定 1
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;         // ラッパ
  inputClassName?: string;    // input へ追加
  fullWidth?: boolean;        // true で w-full
  size?: IntegerInputSize;    // sm/md/lg
}
export function IntegerStepperField({
    value = null,
    onChange,
    min,
    max,
    step = 1,
    placeholder,
    required,
    disabled,
    name,
    id,
    className,
    inputClassName,
    fullWidth,
    size = "md",
  }: IntegerStepperFieldProps) {
    const [text, setText] = useState<string>(
      value === null || value === undefined ? "" : String(value)
    );
  
    useEffect(() => {
      setText(value === null || value === undefined ? "" : String(value));
    }, [value]);
  
    const hasError = useMemo(() => {
      if (text === "" || text === "-") return !!required;
      const n = Number(text);
      if (!Number.isInteger(n)) return true;
      if (min !== undefined && n < min) return true;
      if (max !== undefined && n > max) return true;
      return false;
    }, [text, min, max, required]);
  
    const commit = () => {
      const raw = text.trim();
      if (raw === "" || raw === "-") {
        onChange(null);
        setText("");
        return;
      }
      let n = parseInt(raw, 10);
      if (!Number.isFinite(n)) {
        onChange(null);
        setText("");
        return;
      }
      if (min !== undefined && n < min) n = min;
      if (max !== undefined && n > max) n = max;
      onChange(n);
      setText(String(n));
    };
  
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const hw = toHalfWidthDigits(e.target.value);
      if (isIntegerTyping(hw)) setText(hw);
    };
  
    const adjust = (delta: number) => {
      const cur = Number.isInteger(Number(text)) ? parseInt(text, 10) : 0;
      let next = cur + delta * step;
      if (min !== undefined && next < min) next = min;
      if (max !== undefined && next > max) next = max;
      onChange(next);
      setText(String(next));
    };
  
    // デフォルト幅を細めに（必要なら inputClassName で上書き）
    const widths = fullWidth ? "w-full" : "w-20";
  
    return (
      <div className={cx("inline-flex items-stretch", className)}>
        {/* − ボタン：中央揃え＆境界線あり（右側は0で二重線を回避） */}
        <button
          type="button"
          className={cx(
            "flex items-center justify-center select-none",
            "rounded-l-md border border-r-0 border-gray-300",
            "bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10",
            sizeMap[size].btn
          )}
          onClick={() => adjust(-1)}
          disabled={disabled}
          aria-label="decrement"
        >
          −
        </button>
  
        {/* 入力：左右の線を表示（ボタン側を0にして二重線を避ける） */}
        <input
          id={id}
          name={name}
          inputMode="numeric"
          pattern="-?[0-9]*"
          placeholder={placeholder}
          value={text}
          onChange={handleInput}
          onBlur={commit}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          className={cx(
            "border border-gray-300 bg-white outline-none transition text-center rounded-lg",
            hasError
              ? "focus:ring-2 focus:ring-rose-200"
              : "focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10",
            sizeMap[size].input,
            widths,
            inputClassName
          )}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              adjust(+1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              adjust(-1);
            }
          }}
        />
  
        {/* ＋ ボタン：中央揃え＆境界線あり（左側は0で二重線を回避） */}
        <button
          type="button"
          className={cx(
            "flex items-center justify-center select-none",
            "rounded-r-md border border-l-0 border-gray-300",
            "bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10",
            sizeMap[size].btn
          )}
          onClick={() => adjust(+1)}
          disabled={disabled}
          aria-label="increment"
        >
          ＋
        </button>
      </div>
    );
  }

export interface Birthdate {
    year: IntegerValue;  // 例: 1990
    month: IntegerValue; // 1-12
    day: IntegerValue;   // 1-31
  }
  export interface BirthdateDatePickerProps {
    value: Birthdate;
    onChange: (v: Birthdate) => void;
    minYear?: number; // 既定 1900
    maxYear?: number; // 既定: 今年
    disabled?: boolean;
    className?: string;
  }
  
  function pad2(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
  }
  function toISODate(value: Birthdate | null): string {
    if (!value || value.year == null || value.month == null || value.day == null) return "";
    return `${value.year}-${pad2(value.month)}-${pad2(value.day)}`;
  }
  function fromISODate(iso: string): Birthdate {
    // iso: "YYYY-MM-DD"
    const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
    return {
      year: Number.isFinite(y) ? y : null,
      month: Number.isFinite(m) ? m : null,
      day: Number.isFinite(d) ? d : null,
    };
  }
  
  export function BirthdateDatePicker({
    value,
    onChange,
    minYear = 1900,
    maxYear = new Date().getFullYear(),
    disabled,
    className,
  }: BirthdateDatePickerProps) {
    const iso = toISODate(value);
    const minIso = `${minYear}-01-01`;
    const maxIso = `${maxYear}-12-31`;
  
    return (
      <input
        type="date"
        value={iso}
        onChange={(e) => onChange(fromISODate(e.target.value))}
        min={minIso}
        max={maxIso}
        disabled={disabled}
        className={cx(
          "rounded-md border bg-white outline-none transition",
          "border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10",
          "h-10 text-base px-3 w-44", 
          className
        )}
        inputMode="numeric"
        pattern="\d{4}-\d{2}-\d{2}"
        aria-label="Birthdate"
      />
    );
  }