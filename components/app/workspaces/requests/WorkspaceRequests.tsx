import { Space } from "antd";
import React from "react";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  appWorkspacePaths,
} from "../../../../lib/definitions/system";
import useWorkspaceRequestList from "../../../../lib/hooks/workspaces/useWorkspaceRequestList";
import { getBaseError } from "../../../../lib/utils/errors";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import GrantPermissionMenu from "../permissionItems/GrantPermissionMenu";
import WorkspaceRequestList from "./WorkspaceRequestList";

export interface IWorkspaceRequestsProps {
  workspaceId: string;
}

const WorkspaceRequests: React.FC<IWorkspaceRequestsProps> = (props) => {
  const { workspaceId } = props;
  const { data, error, isLoading } = useWorkspaceRequestList(workspaceId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={
          getBaseError(error) || "Error fetching collaboration requests"
        }
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading collaboration requests..." />;
  } else if (data.requests.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No collaborations requests yet. Create one using the plus button above."
      />
    );
  } else {
    content = (
      <WorkspaceRequestList
        workspaceId={workspaceId}
        requests={data.requests}
      />
    );
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          title="Collaboration Requests"
          formLinkPath={appWorkspacePaths.createRequestForm(workspaceId)}
          actions={
            <GrantPermissionMenu
              workspaceId={workspaceId}
              itemResourceType={AppResourceType.CollaborationRequest}
              permissionOwnerId={workspaceId}
              permissionOwnerType={AppResourceType.Workspace}
              appliesTo={PermissionItemAppliesTo.Children}
            />
          }
        />
        {content}
      </Space>
    </div>
  );
};

export default WorkspaceRequests;
