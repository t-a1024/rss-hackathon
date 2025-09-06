import type { ReactNode, HTMLAttributes, AnchorHTMLAttributes } from "react";
export type HeadingAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = "display" | "xl" | "lg" | "md" | "sm";
export type HeadingAlign = "left" | "center" | "right";
export type HeadingWeight = "bold" | "semibold" | "medium" | "normal";

export type HeadingProps = {
  as?: HeadingAs;         // セマンティックなタグ
  size?: HeadingSize;     // 見た目サイズ
  align?: HeadingAlign;   // 左右中央
  weight?: HeadingWeight; // 太さ
  gradient?: boolean;     // 文字をグラデーション
  eyebrow?: string;       // 小さな上部ラベル
  subtitle?: string;      // 補助の説明文
  className?: string;     // 追加クラス
  children: ReactNode;
  id?: string;            // アンカー用（必要なら）
};

export type IntegerValue = number | null;
export type IntegerInputSize = "sm" | "md" | "lg";

export interface IntegerInputFieldProps {
  value?: IntegerValue;
  onChange: (v: IntegerValue) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;      // wrapper 用
  inputClassName?: string; // input 自体へ追加
  fullWidth?: boolean;     // true なら w-full
  size?: IntegerInputSize; // 高さ/文字サイズ
}

export interface IntegerStepperFieldProps extends IntegerInputFieldProps {
  step?: number; // 既定 1
}


export interface Birthdate {
  year: IntegerValue; 
  month: IntegerValue; 
  day: IntegerValue;  
}

export interface BirthdateInputProps {
  value: Birthdate;
  onChange: (v: Birthdate) => void;
  minYear?: number; 
  maxYear?: number; 
  disabled?: boolean;
  className?: string;   
  size?: IntegerInputSize;
  yearClassName?: string;
  monthClassName?: string;
  dayClassName?: string;
}

export type TextAs = "p" | "span" | "div" | "small" | "label" | "strong" | "em" | "a";
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "lead";
export type TextWeight = "normal" | "medium" | "semibold" | "bold";
export type TextAlign = "left" | "center" | "right" | "justify";
export type TextTone = "default" | "muted" | "secondary" | "success" | "warning" | "danger" | "info";

export type TextProps =
  & {
      as?: TextAs;
      size?: TextSize;
      weight?: TextWeight;
      align?: TextAlign;
      tone?: TextTone;
      italic?: boolean;
      underline?: boolean;
      strike?: boolean;
      mono?: boolean;
      truncate?: boolean;   
      className?: string;
      children: ReactNode;
      id?: string;
    }
  & HTMLAttributes<HTMLElement>
  & AnchorHTMLAttributes<HTMLAnchorElement>; 