import React from "react";
import { SWRConfiguration } from "swr";
import FileForm from "../../../../../components/app/workspaces/files/FileForm";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import {
  getWorkspaceServerSideProps,
  IWorkspaceComponentProps,
} from "../../../../../components/app/workspaces/utils";
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
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
      swrConfig={swrConfig}
    >
      <FileForm workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequired(CreateRootLevelFileFormPage, { swrConfig });
export const getServerSideProps = getWorkspaceServerSideProps;
