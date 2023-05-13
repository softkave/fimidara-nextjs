import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceCollaborationRequestFetchHook } from "@/lib/hooks/singleResourceFetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { CollaborationRequestForWorkspace } from "fimidara";
import React from "react";

export interface IWorkspaceRequestContainerProps {
  requestId: string;
  render(request: CollaborationRequestForWorkspace): React.ReactElement;
}

const WorkspaceRequestContainer: React.FC<IWorkspaceRequestContainerProps> = (
  props: IWorkspaceRequestContainerProps
) => {
  const { requestId, render } = props;
  const { fetchState } = useWorkspaceCollaborationRequestFetchHook({
    requestId,
  });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  if (resource) {
    return render(resource);
  } else if (error) {
    return (
      <PageError
        message={getBaseError(error) || "Error fetching collaboration request."}
      />
    );
  } else if (isLoading) {
    return <PageLoading message="Loading collaboration resource..." />;
  } else {
    return <PageNothingFound message="Collaboration request not found." />;
  }
};

export default WorkspaceRequestContainer;
