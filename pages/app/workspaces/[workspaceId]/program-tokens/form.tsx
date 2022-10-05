import React from "react";
import ProgramTokenForm from "../../../../../components/app/workspaces/programTokens/ProgramTokenForm";
import {
  getWorkspaceServerSideProps,
  IWorkspaceComponentProps,
} from "../../../../../components/app/workspaces/utils";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../components/hoc/withPageAuthRequired";
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

export default withPageAuthRequiredHOC(WorkspaceCreateProgramTokenFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
