import React from "react";
import FileForm from "../../../../../components/app/orgs/files/FileForm";
import Organization from "../../../../../components/app/orgs/Organization";
import {
  getOrgServerSideProps,
  IOrgComponentProps,
} from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

const CreateRootLevelFileFormPage: React.FC<IOrgComponentProps> = (props) => {
  const { orgId } = props;

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FileForm orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(CreateRootLevelFileFormPage);
export const getServerSideProps = getOrgServerSideProps;
