import React from "react";
import OrganizationCollaborators from "../../../../../components/app/orgs/collaborators/OrganizationCollaborators";
import Organization from "../../../../../components/app/orgs/Organization";
import { getOrgServerSideProps } from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

export interface IOrganizationCollaboratorsPageProps {
  orgId: string;
}

const OrganizationCollaboratorsPage: React.FC<
  IOrganizationCollaboratorsPageProps
> = (props) => {
  const { orgId } = props;
  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.collaboratorList(orgId)}>
      <OrganizationCollaborators orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationCollaboratorsPage);
export const getServerSideProps = getOrgServerSideProps;
