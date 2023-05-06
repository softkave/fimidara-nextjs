import assert from "assert";
import { LoginResult } from "fimidara";
import React from "react";
import { useUserActions } from "../../lib/hooks/actionHooks/useUserActions";
import { useUserDataFetchHook } from "../../lib/hooks/fetchHooks";
import { getBaseError } from "../../lib/utils/errors";
import PageError from "../utils/PageError";
import PageLoading from "../utils/PageLoading";
import PageNothingFound, {
  IPageNothingFoundPassedDownProps,
} from "../utils/PageNothingFound";

export interface IUseUserNodeResult
  extends ReturnType<typeof useUserDataFetchHook> {
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
  const user = useUserDataFetchHook(undefined);
  const session = user.store.get(undefined);
  const { resource } = session;
  const isLoading = user.store.loading || !user.store.initialized;
  const userActions = useUserActions();
  let renderedNode: React.ReactElement | null = null;
  const renderNodeProps = props.renderNode || {};

  if (user.store.error) {
    renderedNode = (
      <PageError
        {...renderNodeProps}
        messageText={getBaseError(user.store.error) || "Error fetching user."}
        actions={[
          { children: "Logout", onClick: userActions.logout, danger: true },
        ]}
      />
    );
  } else if (isLoading) {
    renderedNode = (
      <PageLoading {...renderNodeProps} messageText="Loading user..." />
    );
  } else if (!resource) {
    renderedNode = <PageNothingFound messageText="User not found." />;
  }

  const assertGet = React.useCallback((): LoginResult => {
    assert(session.resource && session.other);
    return {
      user: session.resource,
      token: session.other.userToken,
      clientAssignedToken: session.other.clientToken,
    };
  }, [session]);

  return { renderedNode, assertGet, ...user };
}
