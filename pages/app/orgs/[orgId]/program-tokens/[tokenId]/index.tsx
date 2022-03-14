import { GetServerSideProps } from "next";
import React from "react";
import ProgramToken from "../../../../../../components/app/orgs/programTokens/ProgramToken";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type IOrganizationProgramTokenPageProps = {
  orgId: string;
  tokenId: string;
};

const OrganizationProgramTokenPage: React.FC<
  IOrganizationProgramTokenPageProps
> = (props) => {
  const { orgId, tokenId } = props;
  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.programTokenList(orgId)}>
      <ProgramToken tokenId={tokenId} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationProgramTokenPage);

export const getServerSideProps: GetServerSideProps<
  IOrganizationProgramTokenPageProps,
  IOrganizationProgramTokenPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      tokenId: context.params!.tokenId,
    },
  };
};
