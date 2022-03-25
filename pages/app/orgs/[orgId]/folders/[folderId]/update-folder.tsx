import { GetServerSideProps } from "next";
import React from "react";
import FolderContainer from "../../../../../../components/app/orgs/files/FolderContainer";
import FolderForm from "../../../../../../components/app/orgs/files/FolderForm";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { IFolder } from "../../../../../../lib/definitions/folder";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type IUpdateFolderFormPageProps = {
  orgId: string;
  folderId: string;
};

const UpdateFolderFormPage: React.FC<IUpdateFolderFormPageProps> = (props) => {
  const { orgId, folderId } = props;
  const renderForm = React.useCallback(
    (folder: IFolder) => {
      return <FolderForm orgId={orgId} folder={folder} />;
    },
    [orgId]
  );

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FolderContainer folderId={folderId} orgId={orgId} render={renderForm} />
    </Organization>
  );
};

export default withPageAuthRequired(UpdateFolderFormPage);

export const getServerSideProps: GetServerSideProps<
  IUpdateFolderFormPageProps,
  IUpdateFolderFormPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      folderId: context.params!.folderId,
    },
  };
};
