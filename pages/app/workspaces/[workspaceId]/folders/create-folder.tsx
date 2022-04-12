import React from "react";
import FolderForm from "../../../../../components/app/workspaces/files/FolderForm";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import {
  getWorkspaceServerSideProps,
  IWorkspaceComponentProps,
} from "../../../../../components/app/workspaces/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

const CreateRootLevelFolderFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props;

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
    >
      <FolderForm workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequired(CreateRootLevelFolderFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
