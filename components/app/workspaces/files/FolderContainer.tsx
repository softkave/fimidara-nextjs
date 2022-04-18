import React from "react";
import { KeyedMutator, SWRConfiguration } from "swr";
import { IGetFolderEndpointResult } from "../../../../lib/api/endpoints/folder";
import { IFolder } from "../../../../lib/definitions/folder";
import useFolder from "../../../../lib/hooks/workspaces/useFolder";
import { getBaseError } from "../../../../lib/utilities/errors";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import { appClasses } from "../../../utils/theme";

export interface IFolderContainerProps {
  workspaceId: string;
  folderId: string;
  render: (
    folder: IFolder,
    mutate: KeyedMutator<IGetFolderEndpointResult>
  ) => React.ReactElement;
  fetchConfig?: SWRConfiguration;
}

const FolderContainer: React.FC<IFolderContainerProps> = (props) => {
  const { workspaceId, folderId, fetchConfig, render } = props;
  const { data, error, isLoading, mutate } = useFolder(
    {
      folderId,
      workspaceId: workspaceId,
    },
    fetchConfig
  );

  if (error) {
    return (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching folder"}
      />
    );
  } else if (isLoading || !data) {
    return <PageLoading messageText="Loading folder..." />;
  }

  return render(data.folder, mutate);
};

export default FolderContainer;