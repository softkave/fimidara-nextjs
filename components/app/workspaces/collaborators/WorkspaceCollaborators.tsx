import { Space } from "antd";
import { isUndefined } from "lodash";
import React from "react";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  appWorkspacePaths,
} from "../../../../lib/definitions/system";
import { ICollaborator } from "../../../../lib/definitions/user";
import usePagination from "../../../../lib/hooks/usePagination";
import useWorkspaceCollaboratorList from "../../../../lib/hooks/workspaces/useWorkspaceCollaboratorList";
import { getBaseError } from "../../../../lib/utils/errors";
import ListHeader from "../../../utils/ListHeader";
import { PaginatedContent } from "../../../utils/page/PaginatedContent";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import GrantPermissionMenu from "../permissionItems/GrantPermissionMenu";
import CollaboratorList from "./CollaboratorList";

export interface IWorkspaceCollaboratorsProps {
  workspaceId: string;
  renderItem?: (item: ICollaborator) => React.ReactNode;
  renderList?: (items: ICollaborator[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  menu?: React.ReactNode;
}

const WorkspaceCollaborators: React.FC<IWorkspaceCollaboratorsProps> = (
  props
) => {
  const { workspaceId, menu, renderList, renderRoot, renderItem } = props;
  const pagination = usePagination();
  const { data, error, isLoading } = useWorkspaceCollaboratorList({
    workspaceId,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  let content: React.ReactNode = null;
  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching collaborators"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading collaborators..." />;
  } else if (data.collaborators.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No collaborators yet. Create one using the plus button above."
      />
    );
  } else {
    content = renderList ? (
      renderList(data.collaborators)
    ) : (
      <CollaboratorList
        workspaceId={workspaceId}
        collaborators={data.collaborators}
        renderItem={renderItem}
      />
    );
  }

  content = <PaginatedContent content={content} pagination={pagination} />;
  if (renderRoot) {
    return renderRoot(content);
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          title="Collaborators"
          formLinkPath={appWorkspacePaths.createRequestForm(workspaceId)}
          actions={
            !isUndefined(menu) ? (
              menu
            ) : (
              <GrantPermissionMenu
                workspaceId={workspaceId}
                itemResourceType={AppResourceType.User}
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

export default WorkspaceCollaborators;
