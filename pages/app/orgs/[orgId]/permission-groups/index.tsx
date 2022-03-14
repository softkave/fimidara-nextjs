import React from "react";
import Organization from "../../../../../components/app/orgs/Organization";
import OrganizationPermissionGroups from "../../../../../components/app/orgs/permissionGroups/OrganizationPermissionGroups";
import { getOrgServerSideProps } from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

export interface IOrganizationPermissionGroupsPageProps {
  orgId: string;
}

const OrganizationPermissionGroupsPage: React.FC<
  IOrganizationPermissionGroupsPageProps
> = (props) => {
  const { orgId } = props;
  return (
    <Organization
      orgId={orgId}
      activeKey={appOrgPaths.permissionGroupList(orgId)}
    >
      <OrganizationPermissionGroups orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationPermissionGroupsPage);
export const getServerSideProps = getOrgServerSideProps;
