import assert from "assert";
import React from "react";
import useUser from "../../lib/hooks/useUser";
import { getBaseError } from "../../lib/utilities/errors";
import PageError from "../utils/PageError";
import PageLoading from "../utils/PageLoading";

export interface IUseUserNodeResult extends ReturnType<typeof useUser> {
  renderNode: React.ReactElement | null;

  /**
   * Make sure to check for and return `renderNode` or make sure to check that
   * result is not loading or in error state before using `assertGet`
   */
  assertGet: () => NonNullable<ReturnType<typeof useUser>["data"]>;
}

export function useUserNode(): IUseUserNodeResult {
  const u0 = useUser();
  const { isLoading, error, data } = u0;
  let renderNode: React.ReactElement | null = null;
  if (error) {
    renderNode = (
      <PageError messageText={getBaseError(error) || "Error fetching user"} />
    );
  } else if (isLoading) {
    renderNode = <PageLoading messageText="Loading user..." />;
  }

  const assertGet = React.useCallback(() => {
    assert(data);
    return data;
  }, [data]);

  return { renderNode, assertGet, ...u0 };
}
