import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { useWorkspaceFolderFetchHook } from "@/lib/hooks/fetchHooks/folder.ts";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { getBaseError } from "@/lib/utils/errors";
import { Folder } from "fimidara";
import React from "react";

export interface FolderContainerProps {
  folderId: string;
  render: (folder: Folder) => React.ReactElement;
}

const FolderContainer: React.FC<FolderContainerProps> = (props) => {
  const { folderId, render } = props;
  const { fetchState } = useWorkspaceFolderFetchHook({ folderId });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  if (resource) {
    return render(resource);
  } else if (error) {
    return (
      <PageError message={getBaseError(error) || "Error fetching folder"} />
    );
  } else if (isLoading) {
    return <PageLoading message="Loading folder..." />;
  } else {
    return <PageNothingFound message="Folder not found" />;
  }
};

export default FolderContainer;
