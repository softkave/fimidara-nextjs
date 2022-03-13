import { GetServerSideProps } from "next";
import React from "react";
import ClientTokenForm from "../../../../../../components/app/orgs/clientTokens/ClientTokenForm";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appOrgPaths } from "../../../../../../lib/definitions/system";
import useClientToken from "../../../../../../lib/hooks/orgs/useClientToken";

export type IOrganizationClientTokenFormPageProps = {
  orgId: string;
  tokenId: string;
};

const OrganizationClientTokenFormPage: React.FC<
  IOrganizationClientTokenFormPageProps
> = (props) => {
  const { orgId, tokenId } = props;
  const { error, isLoading, data } = useClientToken(tokenId);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading client assigned token..." />;
  } else if (error) {
    return (
      <PageError
        messageText={error?.message || "Error fetching client assigned token"}
      />
    );
  }

  return (
    <Organization orgId={orgId} key={appOrgPaths.collaboratorList(orgId)}>
      <ClientTokenForm
        orgId={data.token.organizationId}
        clientToken={data.token}
      />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationClientTokenFormPage);

export const getServerSideProps: GetServerSideProps<
  IOrganizationClientTokenFormPageProps,
  IOrganizationClientTokenFormPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      tokenId: context.params!.tokenId,
    },
  };
};
