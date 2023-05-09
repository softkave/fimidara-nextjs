import PageError from "@/components/utils/PageError";
import PageLoading from "@/components/utils/PageLoading";
import PageNothingFound from "@/components/utils/PageNothingFound";
import { appClasses } from "@/components/utils/theme";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceFolderFetchHook } from "@/lib/hooks/singleResourceFetchHooks";
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
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching folder"}
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading folder..." />;
  } else {
    return <PageNothingFound messageText="Folder not found." />;
  }
};

export default FolderContainer;
