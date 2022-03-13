import { GetServerSideProps } from "next";
import React from "react";
import ClientToken from "../../../../../../components/app/orgs/clientTokens/ClientToken";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type IOrganizationClientTokenPageProps = {
  orgId: string;
  tokenId: string;
};

const OrganizationClientTokenPage: React.FC<
  IOrganizationClientTokenPageProps
> = (props) => {
  const { orgId, tokenId } = props;
  return (
    <Organization orgId={orgId} key={appOrgPaths.collaboratorList(orgId)}>
      <ClientToken tokenId={tokenId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationClientTokenPage);

export const getServerSideProps: GetServerSideProps<
  IOrganizationClientTokenPageProps,
  IOrganizationClientTokenPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      tokenId: context.params!.tokenId,
    },
  };
};
