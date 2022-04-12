import React from "react";
import ClientTokenForm from "../../../../../components/app/workspaces/clientTokens/ClientTokenForm";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import {
  getWorkspaceServerSideProps,
  IWorkspaceComponentProps,
} from "../../../../../components/app/workspaces/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

const WorkspaceCreateClientTokenFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props;

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.clientTokenList(workspaceId)}
    >
      <ClientTokenForm workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequired(WorkspaceCreateClientTokenFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
