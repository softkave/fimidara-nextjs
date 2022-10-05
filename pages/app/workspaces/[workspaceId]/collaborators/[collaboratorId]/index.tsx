import { GetServerSideProps } from "next";
import React from "react";
import Collaborator from "../../../../../../components/app/workspaces/collaborators/Collaborator";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type IWorkspaceCollaboratorPageProps = {
  workspaceId: string;
  collaboratorId: string;
};

const WorkspaceCollaboratorPage: React.FC<IWorkspaceCollaboratorPageProps> = (
  props
) => {
  const { workspaceId, collaboratorId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.collaboratorList(workspaceId)}
    >
      <Collaborator collaboratorId={collaboratorId} workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspaceCollaboratorPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspaceCollaboratorPageProps,
  IWorkspaceCollaboratorPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      collaboratorId: context.params!.collaboratorId,
    },
  };
};
