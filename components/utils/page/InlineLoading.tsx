import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { StyleableComponentProps } from "../styling/types";

export interface IInlineLoadingProps extends StyleableComponentProps {
  messageText?: string;
}

const InlineLoading: React.FC<IInlineLoadingProps> = (props) => {
  const { messageText, className, style } = props;

  return (
    <Alert variant="destructive" className={className} style={style}>
      <LoaderCircle className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>{messageText || "Loading..."}</AlertDescription>
    </Alert>
  );
};

export default InlineLoading;
