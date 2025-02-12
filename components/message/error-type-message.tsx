"use client";

import { useSearchParams } from "next/navigation";

enum AuthError {
  Configuration = "Configuration",
  Unknown = "Unknown",
}

const errorMap = {
  [AuthError.Configuration]: (
    <p>
      There was a problem when trying to authenticate. Please contact us if this
      error persists. Unique error code:{" "}
      <code className="rounded-sm bg-slate-100 p-1 text-xs">Configuration</code>
    </p>
  ),
  [AuthError.Unknown]: (
    <p>An unknown error occurred. Please contact us if this error persists.</p>
  ),
};

export function ErrorTypeMessage() {
  const search = useSearchParams();
  const error = (search.get("error") || AuthError.Unknown) as AuthError;

  return (
    <div className="font-normal text-gray-700 dark:text-gray-400">
      {errorMap[error] || "Please contact us if this error persists."}
    </div>
  );
}
