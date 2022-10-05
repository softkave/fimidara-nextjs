import { GetServerSideProps } from "next";
import React from "react";
import CollaboratorForm from "../../../../../../components/app/workspaces/collaborators/CollaboratorForm";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";
import useCollaborator from "../../../../../../lib/hooks/workspaces/useCollaborator";
import { getBaseError } from "../../../../../../lib/utilities/errors";

export type IWorkspaceCollaboratorFormPageProps = {
  workspaceId: string;
  collaboratorId: string;
};

const WorkspaceCollaboratorFormPage: React.FC<
  IWorkspaceCollaboratorFormPageProps
> = (props) => {
  const { workspaceId, collaboratorId } = props;
  const { error, isLoading, data } = useCollaborator(
    workspaceId,
    collaboratorId
  );
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        messageText={getBaseError(error) || "Error fetching collaborator"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading collaborator..." />;
  } else {
    content = (
      <CollaboratorForm
        workspaceId={data.collaborator.workspaceId}
        collaborator={data.collaborator}
      />
    );
  }

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.collaboratorList(workspaceId)}
    >
      {content}
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspaceCollaboratorFormPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspaceCollaboratorFormPageProps,
  IWorkspaceCollaboratorFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      collaboratorId: context.params!.collaboratorId,
    },
  };
};
