import { GetServerSideProps } from "next";
import React from "react";
import { SWRConfiguration } from "swr";
import FileContainer from "../../../../../../components/app/workspaces/files/FileContainer";
import FileForm from "../../../../../../components/app/workspaces/files/FileForm";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import WorkspaceContainer from "../../../../../../components/app/workspaces/WorkspaceContainer";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { IFile } from "../../../../../../lib/definitions/file";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type IUpdateFileFormPageProps = {
  workspaceId: string;
  fileId: string;
};

const swrConfig: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const UpdateFileFormPage: React.FC<IUpdateFileFormPageProps> = (props) => {
  const { workspaceId, fileId } = props;
  const renderFormWithWorkspace = React.useCallback(
    (file: IFile) => {
      return (
        <WorkspaceContainer
          workspaceId={workspaceId}
          render={(workspace) => (
            <FileForm
              workspaceId={workspaceId}
              file={file}
              workspaceRootname={workspace.rootname}
            />
          )}
        />
      );
    },
    [workspaceId]
  );

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
      swrConfig={swrConfig}
    >
      <FileContainer
        fileId={fileId}
        workspaceId={workspaceId}
        render={renderFormWithWorkspace}
        swrConfig={swrConfig}
      />
    </Workspace>
  );
};

export default withPageAuthRequired(UpdateFileFormPage, { swrConfig });

export const getServerSideProps: GetServerSideProps<
  IUpdateFileFormPageProps,
  IUpdateFileFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      fileId: context.params!.fileId,
    },
  };
};
