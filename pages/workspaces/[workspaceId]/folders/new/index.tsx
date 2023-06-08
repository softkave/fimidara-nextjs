import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FolderForm from "@/components/app/workspaces/files/FolderForm";
import {
  IWorkspaceComponentProps,
  getWorkspaceServerSideProps,
} from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

const CreateRootLevelFolderFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props;

  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => {
        return (
          <FolderForm
            workspaceId={workspaceId}
            workspaceRootname={workspace.rootname}
          />
        );
      }}
    />
  );
};

export default withPageAuthRequiredHOC(CreateRootLevelFolderFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
