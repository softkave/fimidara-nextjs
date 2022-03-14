import { Space } from "antd";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useOrgClientTokenList from "../../../../lib/hooks/orgs/useOrgClientTokenList";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import ClientTokenList from "./ClientTokenList";

export interface IOrganizationClientTokensProps {
  orgId: string;
}

const OrganizationClientTokens: React.FC<IOrganizationClientTokensProps> = (
  props
) => {
  const { orgId } = props;
  const { data, error, isLoading } = useOrgClientTokenList(orgId);
  let content: React.ReactNode = null;

  if (isLoading || !data) {
    content = <PageLoading messageText="Loading client assigned tokens..." />;
  } else if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={error?.message || "Error fetching client assigned tokens"}
      />
    );
  } else if (data.tokens.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText={
          "No client assigned tokens yet. " +
          "You can create one using the plus button above or using a program access token."
        }
      />
    );
  } else {
    content = <ClientTokenList orgId={orgId} tokens={data.tokens} />;
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          title="Client Assigned Tokens"
          formLinkPath={appOrgPaths.createClientTokenForm(orgId)}
        />
        {content}
      </Space>
    </div>
  );
};

export default OrganizationClientTokens;
