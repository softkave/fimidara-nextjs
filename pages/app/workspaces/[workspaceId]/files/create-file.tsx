import React from "react";
import { SWRConfiguration } from "swr";
import FileForm from "../../../../../components/app/workspaces/files/FileForm";
import {
  getWorkspaceServerSideProps,
  IWorkspaceComponentProps,
} from "../../../../../components/app/workspaces/utils";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

const swrConfig: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const CreateRootLevelFileFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props;
  const renderForm = React.useCallback(
    (workspace) => {
      return (
        <FileForm
          workspaceId={workspaceId}
          workspaceRootname={workspace.rootname}
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
      render={renderForm}
    />
  );
};

export default withPageAuthRequired(CreateRootLevelFileFormPage, { swrConfig });
export const getServerSideProps = getWorkspaceServerSideProps;
