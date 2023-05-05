import { getBaseError } from "@/lib/utils/errors";
import { Folder } from "fimidara";
import React from "react";
import { useWorkspaceFolderFetchHook } from "../../../../lib/hooks/fetchHooks";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";

export interface FolderContainerProps {
  folderId: string;
  render: (folder: Folder) => React.ReactElement;
}

const FolderContainer: React.FC<FolderContainerProps> = (props) => {
  const { folderId, render } = props;
  const data = useWorkspaceFolderFetchHook({ folderId });
  const error = data.store.error;
  const { resource } = data.store.get(undefined);
  const isLoading = data.store.loading || !data.store.initialized;

  if (error) {
    return (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching folder"}
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading folder..." />;
  } else if (!resource) {
    return <PageNothingFound messageText="Folder not found." />;
  }

  return render(resource);
};

export default FolderContainer;
