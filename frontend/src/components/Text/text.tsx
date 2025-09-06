import type { TextProps, TextSize, TextTone, TextWeight, TextAlign } from "../../types/component/Layer1";
import type { ElementType } from "react";  
const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

const sizeMap: Record<TextSize, string> = {
  xs: "text-xs leading-5",
  sm: "text-sm leading-6",
  md: "text-base leading-7",
  lg: "text-lg leading-7",
  xl: "text-xl leading-8",
  lead: "text-lg sm:text-xl leading-8",
};

const weightMap: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const alignMap: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

const toneMap: Record<TextTone, string> = {
  default: "text-gray-900",
  secondary: "text-gray-700",
  muted: "text-gray-500",
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger:  "text-rose-600",
  info:    "text-sky-600",
};

export default function Text({
  as = "p",
  size = "md",
  weight = "normal",
  align = "left",
  tone = "default",
  italic,
  underline,
  strike,
  mono,
  truncate,
  className,
  children,
  id,
  ...rest
}: TextProps) {
  const Tag = as as ElementType; 

  return (
    <Tag
      id={id}
      className={cx(
        sizeMap[size],
        weightMap[weight],
        alignMap[align],
        toneMap[tone],
        italic && "italic",
        underline && "underline underline-offset-2",
        strike && "line-through",
        mono && "font-mono",
        truncate && "truncate",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
