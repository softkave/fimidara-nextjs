import { GetServerSideProps } from "next";
import React from "react";
import Organization from "../../../../../../components/app/orgs/Organization";
import ProgramTokenForm from "../../../../../../components/app/orgs/programTokens/ProgramTokenForm";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appOrgPaths } from "../../../../../../lib/definitions/system";
import useProgramToken from "../../../../../../lib/hooks/orgs/useProgramToken";
import { getBaseError } from "../../../../../../lib/utilities/errors";

export type IOrganizationProgramTokenFormPageProps = {
  orgId: string;
  tokenId: string;
};

const OrganizationProgramTokenFormPage: React.FC<
  IOrganizationProgramTokenFormPageProps
> = (props) => {
  const { orgId, tokenId } = props;
  const { error, isLoading, data } = useProgramToken(tokenId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching program access token"
        }
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading program access token..." />;
  } else {
    content = (
      <ProgramTokenForm
        orgId={data.token.organizationId}
        programToken={data.token}
      />
    );
  }

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.programTokenList(orgId)}>
      {content}
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
