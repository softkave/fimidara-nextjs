"use client";

import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { getBaseError } from "@/lib/utils/errors";
import { Workspace } from "fimidara";
import React from "react";
import PageError from "../../utils/page/PageError";
import PageLoading from "../../utils/page/PageLoading";
import PageNothingFound from "../../utils/page/PageNothingFound";
import { useUserWorkspaceFetchHook } from "@/lib/hooks/fetchHooks/workspace.ts";

export interface WorkspaceContainerProps {
  workspaceId: string;
  render?: (workspace: Workspace) => React.ReactElement;
  children?: React.ReactNode;
}

const WorkspaceContainer: React.FC<WorkspaceContainerProps> = (props) => {
  const { workspaceId, render, children } = props;
  const { fetchState } = useUserWorkspaceFetchHook({ workspaceId });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  if (error) {
    return (
      <PageError message={getBaseError(error) || "Error fetching workspace"} />
    );
  } else if (isLoading) {
    return <PageLoading message="Loading workspace..." />;
  } else if (!resource) {
    return <PageNothingFound message="Workspace not found" />;
  }

  const contentNode = render ? render(resource) : children;
  return <React.Fragment>{contentNode}</React.Fragment>;
};

export default WorkspaceContainer;
