import React from "react";
import OrganizationClientTokens from "../../../../../components/app/orgs/clientTokens/OrganizationClientTokens";
import Organization from "../../../../../components/app/orgs/Organization";
import { getOrgServerSideProps } from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

export interface IOrganizationClientTokensPageProps {
  orgId: string;
}

const OrganizationClientTokensPage: React.FC<
  IOrganizationClientTokensPageProps
> = (props) => {
  const { orgId } = props;
  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.clientTokenList(orgId)}>
      <OrganizationClientTokens orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationClientTokensPage);
export const getServerSideProps = getOrgServerSideProps;
