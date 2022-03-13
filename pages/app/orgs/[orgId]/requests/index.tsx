import React from "react";
import Organization from "../../../../../components/app/orgs/Organization";
import OrganizationRequests from "../../../../../components/app/orgs/requests/OrganizationRequests";
import { getOrgServerSideProps } from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

export interface IOrganizationRequestsPageProps {
  orgId: string;
}

const OrganizationRequestsPage: React.FC<IOrganizationRequestsPageProps> = (
  props
) => {
  const { orgId } = props;
  return (
    <Organization orgId={orgId} key={appOrgPaths.requestList(orgId)}>
      <OrganizationRequests orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationRequestsPage);
export const getServerSideProps = getOrgServerSideProps;
