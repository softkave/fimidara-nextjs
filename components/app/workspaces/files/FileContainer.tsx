import { getBaseError } from "@/lib/utils/errors";
import { File } from "fimidara";
import React from "react";
import { useWorkspaceFileFetchHook } from "../../../../lib/hooks/fetchHooks";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";

export interface FileContainerProps {
  workspaceId: string;
  fileId: string;
  render: (file: File) => React.ReactElement;
}

const FileContainer: React.FC<FileContainerProps> = (props) => {
  const { fileId, render } = props;
  const data = useWorkspaceFileFetchHook({ fileId });
  const error = data.store.error;
  const { resource } = data.store.get(undefined);
  const isLoading = data.store.loading || !data.store.initialized;

  if (error) {
    return (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching file"}
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading file..." />;
  } else if (!resource) {
    return <PageNothingFound messageText="File not found." />;
  }

  return render(resource);
};

export default FileContainer;
