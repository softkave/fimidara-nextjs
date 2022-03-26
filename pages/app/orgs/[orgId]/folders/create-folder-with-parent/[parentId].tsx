import { GetServerSideProps } from "next";
import React from "react";
import FolderContainer from "../../../../../../components/app/orgs/files/FolderContainer";
import FolderForm from "../../../../../../components/app/orgs/files/FolderForm";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import {
  folderConstants,
  IFolder,
} from "../../../../../../lib/definitions/folder";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type ICreateFolderWithParentFormPageProps = {
  orgId: string;
  parentId: string;
};

const CreateFolderWithParentFormPage: React.FC<
  ICreateFolderWithParentFormPageProps
> = (props) => {
  const { orgId, parentId } = props;
  const renderForm = React.useCallback((folder: IFolder) => {
    return (
      <FolderForm
        orgId={orgId}
        parentId={parentId}
        parentPath={folder.namePath.join(folderConstants.nameSeparator)}
      />
    );
  }, []);

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FolderContainer orgId={orgId} folderId={parentId} render={renderForm} />
    </Organization>
  );
};

export default withPageAuthRequired(CreateFolderWithParentFormPage);

export const getServerSideProps: GetServerSideProps<
  ICreateFolderWithParentFormPageProps,
  ICreateFolderWithParentFormPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      parentId: context.params!.parentId,
    },
  };
};
