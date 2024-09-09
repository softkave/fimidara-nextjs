import React from "react";
import { cn } from "../utils.ts";
import { StyleableComponentProps } from "./styling/types.ts";

export interface ITextProps extends StyleableComponentProps {
  type?: "secondary" | "danger" | "warning" | "success";
  code?: boolean;
  copyable?: boolean;
  children?: React.ReactNode;
}

export function Text(props: ITextProps) {
  const { type, style, code, copyable, className, children } = props;
  const textClassName = cn(
    type === "secondary"
      ? "text-secondary"
      : type === "success"
      ? "text-green-600"
      : type === "danger"
      ? "text-red-600"
      : type === "warning"
      ? "text-yellow-600"
      : undefined,
    className
  );

  // TODO: implement copy. Issue is copy needs navigator which is client-side
  // dependent

  if (code) {
    return (
      <code style={style} className={textClassName}>
        {children}
      </code>
    );
  }

  return (
    <span style={style} className={textClassName}>
      {children}
    </span>
  );
}
