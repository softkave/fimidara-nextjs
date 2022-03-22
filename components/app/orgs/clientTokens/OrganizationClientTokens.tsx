import { Space } from "antd";
import React from "react";
import { IClientAssignedToken } from "../../../../lib/definitions/clientAssignedToken";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useOrgClientTokenList from "../../../../lib/hooks/orgs/useOrgClientTokenList";
import { getBaseError } from "../../../../lib/utilities/errors";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import ClientTokenList from "./ClientTokenList";

export interface IOrganizationClientTokensProps {
  orgId: string;
  renderItem?: (item: IClientAssignedToken) => React.ReactNode;
  renderList?: (items: IClientAssignedToken[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
}

const OrganizationClientTokens: React.FC<IOrganizationClientTokensProps> = (
  props
) => {
  const { orgId, renderList, renderRoot, renderItem } = props;
  const { data, error, isLoading } = useOrgClientTokenList(orgId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={
          getBaseError(error) || "Error fetching client assigned tokens"
        }
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading client assigned tokens..." />;
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
    content = renderList ? (
      renderList(data.tokens)
    ) : (
      <ClientTokenList
        orgId={orgId}
        tokens={data.tokens}
        renderItem={renderItem}
      />
    );
  }

  if (renderRoot) {
    return renderRoot(content);
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
