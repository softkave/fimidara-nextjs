import React from "react";
import Organization from "../../../../../components/app/orgs/Organization";
import RequestForm from "../../../../../components/app/orgs/requests/RequestForm";
import {
  getOrgServerSideProps,
  IOrgComponentProps,
} from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

const OrganizationCreateRequestFormPage: React.FC<IOrgComponentProps> = (
  props
) => {
  const { orgId } = props;

  return (
    <Organization orgId={orgId} key={appOrgPaths.collaboratorList(orgId)}>
      <RequestForm orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationCreateRequestFormPage);
export const getServerSideProps = getOrgServerSideProps;
