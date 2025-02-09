"use client";

import { kDefaultReturnToQueryKey } from "@/lib/definitions/paths/root.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { useSearchParams } from "next/navigation";

export const kDefaultReturnTo = kAppWorkspacePaths.workspaces;

export function useLoggedInReturnTo(params: { defaultReturnTo?: string } = {}) {
  const { defaultReturnTo = kDefaultReturnTo } = params;
  const searchParams = useSearchParams();
  const returnTo = searchParams.get(kDefaultReturnToQueryKey);

  return returnTo ? decodeURIComponent(returnTo) : defaultReturnTo;
}
