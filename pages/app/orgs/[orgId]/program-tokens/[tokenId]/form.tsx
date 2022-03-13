import { GetServerSideProps } from "next";
import React from "react";
import Organization from "../../../../../../components/app/orgs/Organization";
import ProgramTokenForm from "../../../../../../components/app/orgs/programTokens/ProgramTokenForm";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appOrgPaths } from "../../../../../../lib/definitions/system";
import useProgramToken from "../../../../../../lib/hooks/orgs/useProgramToken";

export type IOrganizationProgramTokenFormPageProps = {
  orgId: string;
  tokenId: string;
};

const OrganizationProgramTokenFormPage: React.FC<
  IOrganizationProgramTokenFormPageProps
> = (props) => {
  const { orgId, tokenId } = props;
  const { error, isLoading, data } = useProgramToken(tokenId);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading program access token..." />;
  } else if (error) {
    return (
      <PageError
        messageText={error?.message || "Error fetching program access token"}
      />
    );
  }

  return (
    <Organization orgId={orgId} key={appOrgPaths.collaboratorList(orgId)}>
      <ProgramTokenForm
        orgId={data.token.organizationId}
        programToken={data.token}
      />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationProgramTokenFormPage);

export const getServerSideProps: GetServerSideProps<
  IOrganizationProgramTokenFormPageProps,
  IOrganizationProgramTokenFormPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      tokenId: context.params!.tokenId,
    },
  };
};
