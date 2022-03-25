import React from "react";
import FolderForm from "../../../../../components/app/orgs/files/FolderForm";
import Organization from "../../../../../components/app/orgs/Organization";
import {
  getOrgServerSideProps,
  IOrgComponentProps,
} from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

const CreateRootLevelFolderFormPage: React.FC<IOrgComponentProps> = (props) => {
  const { orgId } = props;

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FolderForm orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(CreateRootLevelFolderFormPage);
export const getServerSideProps = getOrgServerSideProps;
