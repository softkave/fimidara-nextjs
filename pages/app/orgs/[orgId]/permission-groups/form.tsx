import React from "react";
import Organization from "../../../../../components/app/orgs/Organization";
import PresetForm from "../../../../../components/app/orgs/permissionGroups/PresetForm";
import {
  getOrgServerSideProps,
  IOrgComponentProps,
} from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

const OrganizationCreatePermissionGroupFormPage: React.FC<
  IOrgComponentProps
> = (props) => {
  const { orgId } = props;

  return (
    <Organization orgId={orgId} key={appOrgPaths.collaboratorList(orgId)}>
      <PresetForm orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationCreatePermissionGroupFormPage);
export const getServerSideProps = getOrgServerSideProps;
