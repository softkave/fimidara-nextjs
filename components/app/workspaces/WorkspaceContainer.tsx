import { useUserWorkspaceFetchHook } from "@/lib/hooks/fetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { Workspace } from "fimidara";
import React from "react";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import PageNothingFound from "../../utils/PageNothingFound";
import { appClasses } from "../../utils/theme";

export interface WorkspaceContainerProps {
  workspaceId: string;
  render?: (workspace: Workspace) => React.ReactElement;
}

const WorkspaceContainer: React.FC<WorkspaceContainerProps> = (props) => {
  const { workspaceId, render, children } = props;
  const data = useUserWorkspaceFetchHook({ workspaceId });
  const error = data.store.error;
  const { resource } = data.store.get(undefined);
  const isLoading = data.store.loading || !data.store.initialized;

  if (error) {
    return (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching workspace."}
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading workspace..." />;
  } else if (!resource) {
    return <PageNothingFound messageText="Workspace not found." />;
  }

  const contentNode = render ? render(resource) : children;
  return <React.Fragment>{contentNode}</React.Fragment>;
};

export default WorkspaceContainer;
