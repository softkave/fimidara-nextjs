import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { AppError, isError } from "@/lib/utils/errors";
import { Terminal } from "lucide-react";
import React from "react";
import { StyleableComponentProps } from "../styling/types";

export interface IAlertGroupProps extends StyleableComponentProps {
  type?: "destructive";
  messages: string[] | AppError[];
}

export const AlertGroup: React.FC<IAlertGroupProps> = (props) => {
  const { type, messages, className, style } = props;

  const nodes = messages.map((message, index) => (
    <Alert variant={type} key={index}>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        {isError(message) ? message.message : message}
      </AlertDescription>
    </Alert>
  ));

  return (
    <div className={className} style={style}>
      {nodes}
    </div>
  );
};
