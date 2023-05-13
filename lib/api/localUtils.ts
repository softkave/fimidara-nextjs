import { FimidaraEndpointError } from "fimidara";

export function isFimidaraEndpointError(
  error: unknown
): error is FimidaraEndpointError {
  //  The second check is for private endpoints where though the error name is
  //  the same, instanceof will not return true since they are technically two
  //  different classes.
  return (
    error instanceof FimidaraEndpointError ||
    (error as any)?.name === FimidaraEndpointError.name
  );
}
