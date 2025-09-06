import type {
    HeadingProps,
    HeadingSize,
    HeadingWeight,
    HeadingAlign,
  } from "../../types/component/Layer1";
  import type { ElementType } from "react";
  const sizeMap: Record<HeadingSize, string> = {
    display: "text-4xl sm:text-5xl md:text-6xl leading-tight",
    xl:      "text-3xl sm:text-4xl leading-tight",
    lg:      "text-2xl sm:text-3xl leading-snug",
    md:      "text-xl sm:text-2xl leading-snug",
    sm:      "text-lg leading-snug",
  };
  
  const weightMap: Record<HeadingWeight, string> = {
    bold: "font-bold",
    semibold: "font-semibold",
    medium: "font-medium",
    normal: "font-normal",
  };
  
  const alignMap: Record<HeadingAlign, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  
  const cx = (...xs: Array<string | false | null | undefined>) =>
    xs.filter(Boolean).join(" ");
  
  export default function Heading({
    as = "h2",
    size = "xl",
    align = "left",
    weight = "bold",
    gradient = false,
    eyebrow,
    subtitle,
    className,
    children,
    id,
  }: HeadingProps) {
    const Tag = as as ElementType; 
  
    const title = (
      <span
        className={cx(
          gradient
            ? "bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent"
            : "text-gray-900",
        )}
      >
        {children}
      </span>
    );
  
    return (
      <div className={cx("space-y-2", alignMap[align])} id={id}>
        {eyebrow && (
          <div
            className={cx(
              "text-xs tracking-widest uppercase text-gray-500",
              alignMap[align]
            )}
          >
            {eyebrow}
          </div>
        )}
  
        <Tag
          className={cx(
            sizeMap[size],
            weightMap[weight],
            alignMap[align],
            "scroll-mt-24",
            className
          )}
        >
          {title}
        </Tag>
  
        {subtitle && (
          <p
            className={cx(
              "text-sm sm:text-base text-gray-600 max-w-prose",
              alignMap[align],
              align !== "left" && "mx-auto"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  }