import React from "react";
import PermissionGroupForm from "../../../../../components/app/workspaces/permissionGroups/PermissionGroupForm";
import {
  getWorkspaceServerSideProps,
  IWorkspaceComponentProps,
} from "../../../../../components/app/workspaces/utils";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

const WorkspaceCreatePermissionGroupFormPage: React.FC<
  IWorkspaceComponentProps
> = (props) => {
  const { workspaceId } = props;

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.collaboratorList(workspaceId)}
    >
      <PermissionGroupForm workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspaceCreatePermissionGroupFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
