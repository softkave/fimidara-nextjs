import { Space } from "antd";
import { isUndefined } from "lodash";
import React from "react";
import { IPermissionGroup } from "../../../../lib/definitions/permissionGroups";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  appWorkspacePaths,
} from "../../../../lib/definitions/system";
import useWorkspacePermissionGroupList from "../../../../lib/hooks/workspaces/useWorkspacePermissionGroupList";
import { getBaseError } from "../../../../lib/utilities/errors";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import GrantPermissionMenu from "../permissionItems/GrantPermissionMenu";
import PermissionGroupList from "./PermissionGroupList";

export interface IWorkspacePermissionGroupsProps {
  workspaceId: string;
  renderItem?: (item: IPermissionGroup) => React.ReactNode;
  renderList?: (items: IPermissionGroup[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  menu?: React.ReactNode;
}

const WorkspacePermissionGroups: React.FC<IWorkspacePermissionGroupsProps> = (
  props
) => {
  const { workspaceId, menu, renderItem, renderList, renderRoot } = props;
  const { data, error, isLoading } =
    useWorkspacePermissionGroupList(workspaceId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching permission groups"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading permission groups..." />;
  } else if (data.permissionGroups.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No permission groups yet. Create one using the plus button above."
      />
    );
  } else {
    content = renderList ? (
      renderList(data.permissionGroups)
    ) : (
      <PermissionGroupList
        workspaceId={workspaceId}
        permissionGroups={data.permissionGroups}
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
          title="Permission Groups"
          formLinkPath={appWorkspacePaths.createPermissionGroupForm(
            workspaceId
          )}
          actions={
            !isUndefined(menu) ? (
              menu
            ) : (
              <GrantPermissionMenu
                workspaceId={workspaceId}
                itemResourceType={AppResourceType.PermissionGroup}
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

export default WorkspacePermissionGroups;
