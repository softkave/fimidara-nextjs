import { GetServerSideProps } from "next";
import React from "react";
import Collaborator from "../../../../../../components/app/orgs/collaborators/Collaborator";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type IOrganizationCollaboratorPageProps = {
  orgId: string;
  collaboratorId: string;
};

const OrganizationCollaboratorPage: React.FC<
  IOrganizationCollaboratorPageProps
> = (props) => {
  const { orgId, collaboratorId } = props;
  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.collaboratorList(orgId)}>
      <Collaborator collaboratorId={collaboratorId} orgId={orgId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationCollaboratorPage);

export const getServerSideProps: GetServerSideProps<
  IOrganizationCollaboratorPageProps,
  IOrganizationCollaboratorPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      collaboratorId: context.params!.collaboratorId,
    },
  };
};
