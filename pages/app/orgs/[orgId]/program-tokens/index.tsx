import React from "react";
import Organization from "../../../../../components/app/orgs/Organization";
import OrganizationProgramTokens from "../../../../../components/app/orgs/programTokens/OrganizationProgramTokens";
import { getOrgServerSideProps } from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

export interface IOrganizationProgramTokensPageProps {
  orgId: string;
}

const OrganizationProgramTokensPage: React.FC<
  IOrganizationProgramTokensPageProps
> = (props) => {
  const { orgId } = props;
  return (
    <Organization orgId={orgId} key={appOrgPaths.programTokenList(orgId)}>
      <OrganizationProgramTokens orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationProgramTokensPage);
export const getServerSideProps = getOrgServerSideProps;
