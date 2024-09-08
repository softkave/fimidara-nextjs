import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { cn } from "@/components/utils.ts";
import { Terminal } from "lucide-react";
import React from "react";

export interface IEmptyMessageProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  title?: React.ReactNode;
}

const EmptyMessage: React.FC<IEmptyMessageProps> = (props) => {
  const { children, className, style, title } = props;

  return (
    <div
      className={cn("flex items-center align-center h-full w-full", className)}
      style={style}
    >
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>{title || "Heads up!"}</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    </div>
  );
};

export default EmptyMessage;
