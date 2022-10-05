import React from "react";
import FolderForm from "../../../../../components/app/workspaces/files/FolderForm";
import {
  getWorkspaceServerSideProps,
  IWorkspaceComponentProps,
} from "../../../../../components/app/workspaces/utils";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";
import { IWorkspace } from "../../../../../lib/definitions/workspace";

const CreateRootLevelFolderFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props;
  const renderFormWithWorkspace = React.useCallback(
    (workspace: IWorkspace) => {
      return (
        <FolderForm
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
      render={renderFormWithWorkspace}
    />
  );
};

export default withPageAuthRequiredHOC(CreateRootLevelFolderFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
