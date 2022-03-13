import React from "react";
import Organization from "../../../../../components/app/orgs/Organization";
import ProgramTokenForm from "../../../../../components/app/orgs/programTokens/ProgramTokenForm";
import {
  getOrgServerSideProps,
  IOrgComponentProps,
} from "../../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../lib/definitions/system";

const OrganizationCreateProgramTokenFormPage: React.FC<IOrgComponentProps> = (
  props
) => {
  const { orgId } = props;

  return (
    <Organization orgId={orgId} key={appOrgPaths.collaboratorList(orgId)}>
      <ProgramTokenForm orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationCreateProgramTokenFormPage);
export const getServerSideProps = getOrgServerSideProps;
