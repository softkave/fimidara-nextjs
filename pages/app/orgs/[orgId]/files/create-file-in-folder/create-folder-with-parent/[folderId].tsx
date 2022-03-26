import { GetServerSideProps } from "next";
import React from "react";
import FileForm from "../../../../../../../components/app/orgs/files/FileForm";
import FolderContainer from "../../../../../../../components/app/orgs/files/FolderContainer";
import Organization from "../../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../../components/hoc/withPageAuthRequired";
import {
  folderConstants,
  IFolder,
} from "../../../../../../../lib/definitions/folder";
import { appOrgPaths } from "../../../../../../../lib/definitions/system";

export type ICreateFileInFolderParentFormPageProps = {
  orgId: string;
  folderId: string;
};

const CreateFileInFolderParentFormPage: React.FC<
  ICreateFileInFolderParentFormPageProps
> = (props) => {
  const { orgId, folderId } = props;
  const renderForm = React.useCallback((folder: IFolder) => {
    return (
      <FileForm
        orgId={orgId}
        folderId={folderId}
        folderPath={folder.namePath.join(folderConstants.nameSeparator)}
      />
    );
  }, []);

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FolderContainer folderId={folderId} orgId={orgId} render={renderForm} />
    </Organization>
  );
};

export default withPageAuthRequired(CreateFileInFolderParentFormPage);

export const getServerSideProps: GetServerSideProps<
  ICreateFileInFolderParentFormPageProps,
  ICreateFileInFolderParentFormPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      folderId: context.params!.folderId,
    },
  };
};
