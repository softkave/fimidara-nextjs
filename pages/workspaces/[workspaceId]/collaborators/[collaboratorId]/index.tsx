import Collaborator from "@/components/app/workspaces/collaborators/Collaborator";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { GetServerSideProps } from "next";
import React from "react";

export type IWorkspaceCollaboratorPageProps = {
  workspaceId: string;
  collaboratorId: string;
};

const WorkspaceCollaboratorPage: React.FC<IWorkspaceCollaboratorPageProps> = (
  props
) => {
  const { workspaceId, collaboratorId } = props;
  return (
    <Collaborator collaboratorId={collaboratorId} workspaceId={workspaceId} />
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
