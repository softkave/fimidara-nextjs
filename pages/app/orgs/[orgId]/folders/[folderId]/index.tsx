import { GetServerSideProps } from "next";
import React from "react";
import FileListContainer from "../../../../../../components/app/orgs/files/FileListContainer";
import FolderContainer from "../../../../../../components/app/orgs/files/FolderContainer";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { IFolder } from "../../../../../../lib/definitions/folder";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type IFolderFilesPageProps = {
  orgId: string;
  folderId: string;
};

const FolderFilesPage: React.FC<IFolderFilesPageProps> = (props) => {
  const { orgId, folderId } = props;
  const renderForm = React.useCallback(
    (folder: IFolder) => {
      return <FileListContainer orgId={orgId} folder={folder} />;
    },
    [orgId]
  );

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FolderContainer folderId={folderId} orgId={orgId} render={renderForm} />
    </Organization>
  );
};

export default withPageAuthRequired(FolderFilesPage);

export const getServerSideProps: GetServerSideProps<
  IFolderFilesPageProps,
  IFolderFilesPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      folderId: context.params!.folderId,
    },
  };
};
