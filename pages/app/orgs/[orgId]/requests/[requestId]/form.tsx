import { GetServerSideProps } from "next";
import React from "react";
import Organization from "../../../../../../components/app/orgs/Organization";
import RequestForm from "../../../../../../components/app/orgs/requests/RequestForm";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appOrgPaths } from "../../../../../../lib/definitions/system";
import useCollaborationRequest from "../../../../../../lib/hooks/requests/useRequest";

export type IOrganizationRequestFormPageProps = {
  orgId: string;
  requestId: string;
};

const OrganizationRequestFormPage: React.FC<
  IOrganizationRequestFormPageProps
> = (props) => {
  const { orgId, requestId } = props;
  const { error, isLoading, data } = useCollaborationRequest(requestId);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading collaboration request..." />;
  } else if (error) {
    return (
      <PageError
        messageText={error?.message || "Error fetching collaboration request"}
      />
    );
  }

  return (
    <Organization orgId={orgId} key={appOrgPaths.collaboratorList(orgId)}>
      <RequestForm orgId={data.request.organizationId} request={data.request} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationRequestFormPage);

export const getServerSideProps: GetServerSideProps<
  IOrganizationRequestFormPageProps,
  IOrganizationRequestFormPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      requestId: context.params!.requestId,
    },
  };
};
