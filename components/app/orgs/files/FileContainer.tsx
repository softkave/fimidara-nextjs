import React from "react";
import { KeyedMutator } from "swr";
import { IGetFileDetailsEndpointResult } from "../../../../lib/api/endpoints/file";
import { IFile } from "../../../../lib/definitions/file";
import useFile from "../../../../lib/hooks/orgs/useFile";
import { getBaseError } from "../../../../lib/utilities/errors";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import { appClasses } from "../../../utils/theme";

export interface IFileContainerProps {
  orgId: string;
  fileId: string;
  render: (
    file: IFile,
    mutate: KeyedMutator<IGetFileDetailsEndpointResult>
  ) => React.ReactElement;
}

const FileContainer: React.FC<IFileContainerProps> = (props) => {
  const { orgId, fileId, render } = props;
  const { data, error, isLoading, mutate } = useFile({
    fileId,
    organizationId: orgId,
  });

  if (error) {
    return (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching file"}
      />
    );
  } else if (isLoading || !data) {
    return <PageLoading messageText="Loading file..." />;
  }

  return render(data.file, mutate);
};

export default FileContainer;
