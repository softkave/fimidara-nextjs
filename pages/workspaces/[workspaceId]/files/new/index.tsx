import FileForm from "@/components/app/workspaces/files/FileForm";
import {
  getWorkspaceServerSideProps,
  IWorkspaceComponentProps,
} from "@/components/app/workspaces/utils";
import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

const CreateRootLevelFileFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props;

  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => (
        <FileForm
          workspaceId={workspaceId}
          workspaceRootname={workspace.rootname}
        />
      )}
    />
  );
};

export default withPageAuthRequiredHOC(CreateRootLevelFileFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
