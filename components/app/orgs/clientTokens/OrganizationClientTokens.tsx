import { Space } from "antd";
import React from "react";
import { IOrganization } from "../../../../lib/definitions/organization";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useOrgClientTokenList from "../../../../lib/hooks/orgs/useOrgClientTokenList";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import { appClasses } from "../../../utils/theme";
import ClientTokenList from "./ClientTokenList";

export interface IOrganizationClientTokensProps {
  org: IOrganization;
}

const OrganizationClientTokens: React.FC<IOrganizationClientTokensProps> = (
  props
) => {
  const { org } = props;
  const { data, error, isLoading } = useOrgClientTokenList(org.resourceId);
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
  } else {
    content = <ClientTokenList orgId={org.resourceId} tokens={data.tokens} />;
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader
        title="Client Assigned Tokens"
        formLinkPath={appOrgPaths.createClientTokenForm(org.resourceId)}
      />
      {content}
    </Space>
  );
};

export default OrganizationClientTokens;
