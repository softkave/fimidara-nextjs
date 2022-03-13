import { GetServerSideProps } from "next";
import React from "react";
import Organization from "../../../../../../components/app/orgs/Organization";
import OrgRequest from "../../../../../../components/app/orgs/requests/OrgRequest";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type IOrganizationRequestPageProps = {
  orgId: string;
  requestId: string;
};

const OrganizationRequestPage: React.FC<IOrganizationRequestPageProps> = (
  props
) => {
  const { orgId, requestId } = props;
  return (
    <Organization orgId={orgId} key={appOrgPaths.collaboratorList(orgId)}>
      <OrgRequest requestId={requestId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationRequestPage);

export const getServerSideProps: GetServerSideProps<
  IOrganizationRequestPageProps,
  IOrganizationRequestPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      requestId: context.params!.requestId,
    },
  };
};
