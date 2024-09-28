import { useUserSessionFetchHook } from "@/lib/hooks/fetchHooks/session.ts";
import { useRequestLogout } from "@/lib/hooks/session/useRequestLogout.ts";
import assert from "assert";
import React from "react";
import { useFetchSingleResourceFetchState } from "../../lib/hooks/fetchHookUtils";
import { getBaseError } from "../../lib/utils/errors";
import PageError from "../utils/page/PageError";
import PageLoading from "../utils/page/PageLoading";
import PageNothingFound from "../utils/page/PageNothingFound";
import { LoginResult } from "@/lib/api-internal/endpoints/privateTypes.ts";

export interface IUseUserNodeResult {
  renderedNode: React.ReactElement | null;

  /**
   * Make sure to check for and return `renderNode` or make sure to check that
   * result is not loading or in error state before using `assertGet`
   */
  assertGet: () => NonNullable<LoginResult>;
}

export function useUserNode(): IUseUserNodeResult {
  const { fetchState } = useUserSessionFetchHook(undefined);
  const { isLoading, error, resource, other } =
    useFetchSingleResourceFetchState(fetchState);
  const { requestLogout } = useRequestLogout();
  let renderedNode: React.ReactElement | null = null;

  if (error) {
    renderedNode = (
      <PageError
        message={getBaseError(error) || "Error fetching user"}
        actions={[
          {
            children: "Logout",
            onClick: () => requestLogout(),
            variant: "destructive",
          },
        ]}
      />
    );
  } else if (isLoading) {
    renderedNode = <PageLoading message="Loading user..." />;
  } else if (!resource) {
    renderedNode = <PageNothingFound message="User not found" />;
  }

  const assertGet = (): LoginResult => {
    assert(resource && other);
    return {
      user: resource,
      token: other.userToken,
      clientAssignedToken: other.clientToken,
    };
  };

  return { renderedNode, assertGet };
}
