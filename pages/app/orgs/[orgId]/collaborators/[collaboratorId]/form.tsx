import { last } from "lodash";
import { GetServerSideProps } from "next";
import React from "react";
import CollaboratorForm from "../../../../../../components/app/orgs/collaborators/CollaboratorForm";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appOrgPaths } from "../../../../../../lib/definitions/system";
import useCollaborator from "../../../../../../lib/hooks/orgs/useCollaborator";
import { getBaseError } from "../../../../../../lib/utilities/errors";

export type IOrganizationCollaboratorFormPageProps = {
  orgId: string;
  collaboratorId: string;
};

const OrganizationCollaboratorFormPage: React.FC<
  IOrganizationCollaboratorFormPageProps
> = (props) => {
  const { orgId, collaboratorId } = props;
  const { error, isLoading, data } = useCollaborator(orgId, collaboratorId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        messageText={getBaseError(error) || "Error fetching collaborator"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading collaborator..." />;
  } else {
    content = (
      <CollaboratorForm
        orgId={last(data.collaborator.organizations)!.organizationId}
        collaborator={data.collaborator}
      />
    );
  }

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.collaboratorList(orgId)}>
      {content}
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationCollaboratorFormPage);

export const getServerSideProps: GetServerSideProps<
  IOrganizationCollaboratorFormPageProps,
  IOrganizationCollaboratorFormPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      collaboratorId: context.params!.collaboratorId,
    },
  };
};
