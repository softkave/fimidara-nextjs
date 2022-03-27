import React from "react";
import { SWRConfiguration } from "swr";
import FileForm from "../../../../../components/app/orgs/files/FileForm";
import Organization from "../../../../../components/app/orgs/Organization";
import {
  getOrgServerSideProps,
  IOrgComponentProps,
} from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

const swrConfig: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const CreateRootLevelFileFormPage: React.FC<IOrgComponentProps> = (props) => {
  const { orgId } = props;
  return (
    <Organization
      orgId={orgId}
      activeKey={appOrgPaths.rootFolderList(orgId)}
      swrConfig={swrConfig}
    >
      <FileForm orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(CreateRootLevelFileFormPage, { swrConfig });
export const getServerSideProps = getOrgServerSideProps;
