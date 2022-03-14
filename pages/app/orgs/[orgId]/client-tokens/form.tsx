import React from "react";
import ClientTokenForm from "../../../../../components/app/orgs/clientTokens/ClientTokenForm";
import Organization from "../../../../../components/app/orgs/Organization";
import {
  getOrgServerSideProps,
  IOrgComponentProps,
} from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

const OrganizationCreateClientTokenFormPage: React.FC<IOrgComponentProps> = (
  props
) => {
  const { orgId } = props;

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.clientTokenList(orgId)}>
      <ClientTokenForm orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationCreateClientTokenFormPage);
export const getServerSideProps = getOrgServerSideProps;
