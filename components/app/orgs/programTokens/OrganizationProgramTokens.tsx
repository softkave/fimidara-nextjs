import { Space } from "antd";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useOrgProgramTokenList from "../../../../lib/hooks/orgs/useOrgProgramTokenList";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import ProgramTokenList from "./ProgramTokenList";

export interface IOrganizationProgramTokensProps {
  orgId: string;
}

const OrganizationProgramTokens: React.FC<IOrganizationProgramTokensProps> = (
  props
) => {
  const { orgId } = props;
  const { data, error, isLoading } = useOrgProgramTokenList(orgId);
  let content: React.ReactNode = null;

  if (isLoading || !data) {
    content = <PageLoading messageText="Loading program access tokens..." />;
  } else if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={error?.message || "Error fetching program access tokens"}
      />
    );
  } else if (data.tokens.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No program access tokens yet. Create one using the plus button above."
      />
    );
  } else {
    content = <ProgramTokenList orgId={orgId} tokens={data.tokens} />;
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          title="Program Access Tokens"
          formLinkPath={appOrgPaths.createProgramTokenForm(orgId)}
        />
        {content}
      </Space>
    </div>
  );
};

export default OrganizationProgramTokens;
