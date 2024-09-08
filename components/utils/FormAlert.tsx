import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert.tsx";
import { enrichErrorMessage } from "./errorHandling";

export interface IFormAlertProps {
  error: any;
}

export function FormAlert(props: IFormAlertProps) {
  const { error } = props;
  const errorMessage = enrichErrorMessage(error) ?? "An error occurred";

  return errorMessage ? (
    <div className="mb-4">
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    </div>
  ) : null;
}
