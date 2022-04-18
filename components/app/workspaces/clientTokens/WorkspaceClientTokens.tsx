import { Space } from "antd";
import { isUndefined } from "lodash";
import React from "react";
import { IClientAssignedToken } from "../../../../lib/definitions/clientAssignedToken";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import {
  appWorkspacePaths,
  AppResourceType,
} from "../../../../lib/definitions/system";
import useWorkspaceClientTokenList from "../../../../lib/hooks/workspaces/useWorkspaceClientTokenList";
import { getBaseError } from "../../../../lib/utilities/errors";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import GrantPermissionMenu from "../permissionItems/GrantPermissionMenu";
import ClientTokenList from "./ClientTokenList";

export interface IWorkspaceClientTokensProps {
  workspaceId: string;
  renderItem?: (item: IClientAssignedToken) => React.ReactNode;
  renderList?: (items: IClientAssignedToken[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  menu?: React.ReactNode;
}

const WorkspaceClientTokens: React.FC<IWorkspaceClientTokensProps> = (
  props
) => {
  const { workspaceId, menu, renderList, renderRoot, renderItem } = props;
  const { data, error, isLoading } = useWorkspaceClientTokenList(workspaceId);
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
        workspaceId={workspaceId}
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
          formLinkPath={appWorkspacePaths.createClientTokenForm(workspaceId)}
          actions={
            !isUndefined(menu) ? (
              menu
            ) : (
              <GrantPermissionMenu
                workspaceId={workspaceId}
                itemResourceType={AppResourceType.ClientAssignedToken}
                permissionOwnerId={workspaceId}
                permissionOwnerType={AppResourceType.Workspace}
                appliesTo={PermissionItemAppliesTo.Children}
              />
            )
          }
        />
        {content}
      </Space>
    </div>
  );
};

export default WorkspaceClientTokens;