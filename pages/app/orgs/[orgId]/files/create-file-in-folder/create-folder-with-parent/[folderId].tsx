import { GetServerSideProps } from "next";
import React from "react";
import FileForm from "../../../../../../../components/app/orgs/files/FileForm";
import Organization from "../../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../../../lib/definitions/system";

export type ICreateFileInFolderParentFormPageProps = {
  orgId: string;
  folderId: string;
};

const CreateFileInFolderParentFormPage: React.FC<
  ICreateFileInFolderParentFormPageProps
> = (props) => {
  const { orgId, folderId } = props;

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FileForm orgId={orgId} folderId={folderId} />
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
