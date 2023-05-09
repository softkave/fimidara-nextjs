import assert from "assert";
import { LoginResult } from "fimidara";
import React from "react";
import { useFetchSingleResourceFetchState } from "../../lib/hooks/fetchHookUtils";
import { useUserSessionFetchHook } from "../../lib/hooks/singleResourceFetchHooks";
import { useHandleRequiresPasswordChange } from "../../lib/hooks/useHandleServerRecommendedActions";
import { useUserLogout } from "../../lib/hooks/useUserLoggedIn";
import { getBaseError } from "../../lib/utils/errors";
import PageError from "../utils/PageError";
import PageLoading from "../utils/PageLoading";
import PageNothingFound, {
  IPageNothingFoundPassedDownProps,
} from "../utils/PageNothingFound";

export interface IUseUserNodeResult {
  renderedNode: React.ReactElement | null;

  /**
   * Make sure to check for and return `renderNode` or make sure to check that
   * result is not loading or in error state before using `assertGet`
   */
  assertGet: () => NonNullable<LoginResult>;
}

export function useUserNode(
  props: { renderNode?: IPageNothingFoundPassedDownProps } = {}
): IUseUserNodeResult {
  const { handleRequiresPasswordChange } = useHandleRequiresPasswordChange();
  const { fetchState } = useUserSessionFetchHook(undefined);
  const { isLoading, error, resource, initialized, other } =
    useFetchSingleResourceFetchState(fetchState);
  const { logout } = useUserLogout();
  let renderedNode: React.ReactElement | null = null;
  const renderNodeProps = props.renderNode || {};

  React.useEffect(() => {
    if (resource?.requiresPasswordChange) {
      handleRequiresPasswordChange();
    }
  }, [resource?.requiresPasswordChange]);

  if (error) {
    renderedNode = (
      <PageError
        {...renderNodeProps}
        messageText={getBaseError(error) || "Error fetching user."}
        actions={[{ children: "Logout", onClick: logout, danger: true }]}
      />
    );
  } else if (isLoading || !initialized) {
    renderedNode = (
      <PageLoading {...renderNodeProps} messageText="Loading user..." />
    );
  } else if (!resource) {
    renderedNode = <PageNothingFound messageText="User not found." />;
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
