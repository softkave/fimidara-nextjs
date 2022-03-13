import { GetServerSideProps } from "next";
import React from "react";
import Organization from "../../../../../../components/app/orgs/Organization";
import PermissionGroup from "../../../../../../components/app/orgs/permissionGroups/PermissionGroup";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type IOrganizationPermissionGroupPageProps = {
  orgId: string;
  presetId: string;
};

const OrganizationPermissionGroupPage: React.FC<
  IOrganizationPermissionGroupPageProps
> = (props) => {
  const { orgId, presetId } = props;
  return (
    <Organization orgId={orgId} key={appOrgPaths.collaboratorList(orgId)}>
      <PermissionGroup presetId={presetId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationPermissionGroupPage);

export const getServerSideProps: GetServerSideProps<
  IOrganizationPermissionGroupPageProps,
  IOrganizationPermissionGroupPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      presetId: context.params!.presetId,
    },
  };
};
