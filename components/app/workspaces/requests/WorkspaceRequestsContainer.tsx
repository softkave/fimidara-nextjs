import { Space } from "antd";
import React from "react";
import { ICollaborationRequest } from "../../../../lib/definitions/collaborationRequest";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  appWorkspacePaths,
} from "../../../../lib/definitions/system";
import useWorkspaceRequestList from "../../../../lib/hooks/workspaces/useWorkspaceRequestList";
import { getBaseError } from "../../../../lib/utilities/errors";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import { appClasses } from "../../../utils/theme";
import GrantPermissionMenu from "../permissionItems/GrantPermissionMenu";
import WorkspaceRequestList from "./WorkspaceRequestList";

export interface IWorkspaceRequestsContainerProps {
  workspaceId: string;
  render: (
    loading: boolean,
    error: any,
    requests?: ICollaborationRequest
  ) => React.ReactNode;
}

const WorkspaceRequestsContainer: React.FC<IWorkspaceRequestsContainerProps> = (
  props
) => {
  const { workspaceId, render } = props;
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

export default WorkspaceRequestsContainer;
