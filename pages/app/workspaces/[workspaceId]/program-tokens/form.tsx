import React from "react";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import ProgramTokenForm from "../../../../../components/app/workspaces/programTokens/ProgramTokenForm";
import {
  getWorkspaceServerSideProps,
  IWorkspaceComponentProps,
} from "../../../../../components/app/workspaces/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

const WorkspaceCreateProgramTokenFormPage: React.FC<
  IWorkspaceComponentProps
> = (props) => {
  const { workspaceId } = props;

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.programTokenList(workspaceId)}
    >
      <ProgramTokenForm workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequired(WorkspaceCreateProgramTokenFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
