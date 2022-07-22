import { GetServerSideProps } from "next";
import React from "react";
import FolderContainer from "../../../../../../components/app/workspaces/files/FolderContainer";
import FolderForm from "../../../../../../components/app/workspaces/files/FolderForm";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import WorkspaceContainer from "../../../../../../components/app/workspaces/WorkspaceContainer";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import {
  folderConstants,
  IFolder,
} from "../../../../../../lib/definitions/folder";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";

export type ICreateFolderWithParentFormPageProps = {
  workspaceId: string;
  parentId: string;
};

const CreateFolderWithParentFormPage: React.FC<
  ICreateFolderWithParentFormPageProps
> = (props) => {
  const { workspaceId, parentId } = props;
  const renderFormWithWorkspace = React.useCallback(
    (folder: IFolder) => {
      return (
        <WorkspaceContainer
          workspaceId={workspaceId}
          render={(Workspace) => (
            <FolderForm
              workspaceRootname={Workspace.rootname}
              workspaceId={workspaceId}
              parentId={parentId}
              parentPath={folder.namePath.join(folderConstants.nameSeparator)}
            />
          )}
        />
      );
    },
    [parentId, workspaceId]
  );

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.rootFolderList(workspaceId)}
    >
      <FolderContainer folderId={parentId} render={renderFormWithWorkspace} />
    </Workspace>
  );
};

export default withPageAuthRequired(CreateFolderWithParentFormPage);

export const getServerSideProps: GetServerSideProps<
  ICreateFolderWithParentFormPageProps,
  ICreateFolderWithParentFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      parentId: context.params!.parentId,
    },
  };
};
