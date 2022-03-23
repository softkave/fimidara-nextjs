import { Space } from "antd";
import React from "react";
import { IProgramAccessToken } from "../../../../lib/definitions/programAccessToken";
import {
  appOrgPaths,
  AppResourceType,
} from "../../../../lib/definitions/system";
import useOrgProgramTokenList from "../../../../lib/hooks/orgs/useOrgProgramTokenList";
import { getBaseError } from "../../../../lib/utilities/errors";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import GrantPermissionMenu from "../permissionItems/GrantPermissionMenu";
import ProgramTokenList from "./ProgramTokenList";

export interface IOrganizationProgramTokensProps {
  orgId: string;
  renderItem?: (item: IProgramAccessToken) => React.ReactNode;
  renderList?: (items: IProgramAccessToken[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
}

const OrganizationProgramTokens: React.FC<IOrganizationProgramTokensProps> = (
  props
) => {
  const { orgId, renderItem, renderList, renderRoot } = props;
  const { data, error, isLoading } = useOrgProgramTokenList(orgId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={
          getBaseError(error) || "Error fetching program access tokens"
        }
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading program access tokens..." />;
  } else if (data.tokens.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No program access tokens yet. Create one using the plus button above."
      />
    );
  } else {
    content = renderList ? (
      renderList(data.tokens)
    ) : (
      <ProgramTokenList
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
          title="Program Access Tokens"
          formLinkPath={appOrgPaths.createProgramTokenForm(orgId)}
          actions={
            <GrantPermissionMenu
              orgId={orgId}
              itemResourceType={AppResourceType.ProgramAccessToken}
              permissionOwnerId={orgId}
              permissionOwnerType={AppResourceType.Organization}
            />
          }
        />
        {content}
      </Space>
    </div>
  );
};

export default OrganizationProgramTokens;
