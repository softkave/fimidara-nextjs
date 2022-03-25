import { GetServerSideProps } from "next";
import React from "react";
import Folder from "../../../../../../components/app/orgs/files/Folder";
import FolderContainer from "../../../../../../components/app/orgs/files/FolderContainer";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { IFolder } from "../../../../../../lib/definitions/folder";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type IFolderPageProps = {
  orgId: string;
  folderId: string;
};

const FolderPage: React.FC<IFolderPageProps> = (props) => {
  const { orgId, folderId } = props;
  const renderFolder = React.useCallback(
    (folder: IFolder) => {
      return <Folder folder={folder} />;
    },
    [orgId]
  );

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FolderContainer
        folderId={folderId}
        orgId={orgId}
        render={renderFolder}
      />
    </Organization>
  );
};

export default withPageAuthRequired(FolderPage);

export const getServerSideProps: GetServerSideProps<
  IFolderPageProps,
  IFolderPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      folderId: context.params!.folderId,
    },
  };
};
