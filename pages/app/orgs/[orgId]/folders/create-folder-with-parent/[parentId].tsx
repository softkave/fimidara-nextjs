import { GetServerSideProps } from "next";
import React from "react";
import FolderForm from "../../../../../../components/app/orgs/files/FolderForm";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type ICreateFolderWithParentFormPageProps = {
  orgId: string;
  parentId: string;
};

const CreateFolderWithParentFormPage: React.FC<
  ICreateFolderWithParentFormPageProps
> = (props) => {
  const { orgId, parentId } = props;

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FolderForm orgId={orgId} parentId={parentId} />
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
