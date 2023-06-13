import assert from "assert";
import { LoginResult } from "fimidara";
import React from "react";
import { useFetchSingleResourceFetchState } from "../../lib/hooks/fetchHookUtils";
import { useUserSessionFetchHook } from "../../lib/hooks/singleResourceFetchHooks";
import { useHandleRequiresPasswordChange } from "../../lib/hooks/useHandleServerRecommendedActions";
import { useUserLoggedIn } from "../../lib/hooks/useUserLoggedIn";
import { getBaseError } from "../../lib/utils/errors";
import PageError from "../utils/page/PageError";
import PageLoading from "../utils/page/PageLoading";
import PageNothingFound from "../utils/page/PageNothingFound";

export interface IUseUserNodeResult {
  renderedNode: React.ReactElement | null;

  /**
   * Make sure to check for and return `renderNode` or make sure to check that
   * result is not loading or in error state before using `assertGet`
   */
  assertGet: () => NonNullable<LoginResult>;
}

export function useUserNode(): IUseUserNodeResult {
  const { handleRequiresPasswordChange } = useHandleRequiresPasswordChange();
  const { fetchState } = useUserSessionFetchHook(undefined);
  const { isLoading, error, resource, initialized, other } =
    useFetchSingleResourceFetchState(fetchState);
  const { logout } = useUserLoggedIn();
  let renderedNode: React.ReactElement | null = null;

  // React.useEffect(() => {
  //   if (resource?.requiresPasswordChange) {
  //     handleRequiresPasswordChange();
  //   }
  // }, [resource?.requiresPasswordChange]);

  if (error) {
    renderedNode = (
      <PageError
        message={getBaseError(error) || "Error fetching user."}
        actions={[
          { children: "Logout", onClick: () => logout(), danger: true },
        ]}
      />
    );
  } else if (isLoading || !initialized) {
    renderedNode = <PageLoading message="Loading user..." />;
  } else if (!resource) {
    renderedNode = <PageNothingFound message="User not found." />;
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
