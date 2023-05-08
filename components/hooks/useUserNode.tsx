import assert from "assert";
import { LoginResult } from "fimidara";
import React from "react";
import { useUserActions } from "../../lib/hooks/actionHooks/useUserActions";
import { useFetchSingleResourceFetchState } from "../../lib/hooks/fetchHookUtils";
import { useUserSessionFetchHook } from "../../lib/hooks/singleResourceFetchHooks";
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
  const { fetchState } = useUserSessionFetchHook(undefined);
  const { isLoading, error, resource, initialized, other } =
    useFetchSingleResourceFetchState(fetchState);
  const userActions = useUserActions();
  let renderedNode: React.ReactElement | null = null;
  const renderNodeProps = props.renderNode || {};

  if (error) {
    renderedNode = (
      <PageError
        {...renderNodeProps}
        messageText={getBaseError(error) || "Error fetching user."}
        actions={[
          { children: "Logout", onClick: userActions.logout, danger: true },
        ]}
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
