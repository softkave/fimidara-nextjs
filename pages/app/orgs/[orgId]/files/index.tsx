import React from "react";
import FileListContainer from "../../../../../components/app/orgs/files/FileListContainer";
import Organization from "../../../../../components/app/orgs/Organization";
import { getOrgServerSideProps } from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

export interface IOrganizationFilesPageProps {
  orgId: string;
}

const OrganizationFilePage: React.FC<IOrganizationFilesPageProps> = (props) => {
  const { orgId } = props;
  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FileListContainer orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationFilePage);
export const getServerSideProps = getOrgServerSideProps;
