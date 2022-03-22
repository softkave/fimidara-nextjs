import { GetServerSideProps } from "next";
import React from "react";
import Organization from "../../../../../../components/app/orgs/Organization";
import RequestForm from "../../../../../../components/app/orgs/requests/RequestForm";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appOrgPaths } from "../../../../../../lib/definitions/system";
import useCollaborationRequest from "../../../../../../lib/hooks/requests/useRequest";
import { getBaseError } from "../../../../../../lib/utilities/errors";

export type IOrganizationRequestFormPageProps = {
  orgId: string;
  requestId: string;
};

const OrganizationRequestFormPage: React.FC<
  IOrganizationRequestFormPageProps
> = (props) => {
  const { orgId, requestId } = props;
  const { error, isLoading, data } = useCollaborationRequest(requestId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching collaboration request"
        }
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading collaboration request..." />;
  } else {
    content = (
      <RequestForm orgId={data.request.organizationId} request={data.request} />
    );
  }

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.requestList(orgId)}>
      {content}
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
