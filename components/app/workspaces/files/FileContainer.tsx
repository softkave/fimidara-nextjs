import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceFileFetchHook } from "@/lib/hooks/singleResourceFetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { File } from "fimidara";
import React from "react";

export interface FileContainerProps {
  workspaceId: string;
  fileId: string;
  render: (file: File) => React.ReactElement;
}

const FileContainer: React.FC<FileContainerProps> = (props) => {
  const { fileId, render } = props;
  const { fetchState } = useWorkspaceFileFetchHook({ fileId });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  if (resource) {
    return render(resource);
  } else if (error) {
    return <PageError message={getBaseError(error) || "Error fetching file"} />;
  } else if (isLoading) {
    return <PageLoading message="Loading file..." />;
  } else {
    return <PageNothingFound message="File not found." />;
  }
};

export default FileContainer;
