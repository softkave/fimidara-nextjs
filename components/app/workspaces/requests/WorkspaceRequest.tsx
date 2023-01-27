import { Space } from "antd";
import assert from "assert";
import { formatRelative } from "date-fns";
import { last } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { useSWRConfig } from "swr";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import useCollaborationRequest from "../../../../lib/hooks/requests/useRequest";
import { getUseWorkspaceRequestListHookKey } from "../../../../lib/hooks/workspaces/useWorkspaceRequestList";
import { getBaseError } from "../../../../lib/utils/errors";
import ComponentHeader from "../../../utils/ComponentHeader";
import LabeledNode from "../../../utils/LabeledNode";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import { appClasses } from "../../../utils/theme";
import AssignedPermissionGroupList from "../permissionGroups/AssignedPermissionGroupList";
import WorkspaceRequestMenu from "./WorkspaceRequestMenu";

export interface IWorkspaceRequestProps {
  requestId: string;
}

function WorkspaceRequest(props: IWorkspaceRequestProps) {
  const { requestId } = props;
  const router = useRouter();
  const { error, isLoading, data, mutate } = useCollaborationRequest(requestId);
  const { mutate: cacheMutate } = useSWRConfig();
  const onCompleteDeleteRequest = React.useCallback(async () => {
    assert(data?.request, new Error("Request not found"));
    cacheMutate(getUseWorkspaceRequestListHookKey(data.request.workspaceId));
    router.push(appWorkspacePaths.requestList(data.request.workspaceId));
  }, [data, cacheMutate, router]);

  if (error) {
    return (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching collaboration request"
        }
      />
    );
  } else if (isLoading || !data) {
    return <PageLoading messageText="Loading collaboration request..." />;
  }

  const request = data.request;
  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader title={request.recipientEmail}>
          <WorkspaceRequestMenu
            request={request}
            onCompleteDeleteRequest={onCompleteDeleteRequest}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={request.resourceId}
        />
        {request.message && (
          <LabeledNode
            nodeIsText
            label="Message"
            direction="vertical"
            node={request.message}
          />
        )}
        {request.expiresAt && (
          <LabeledNode
            nodeIsText
            label="Expires"
            direction="vertical"
            node={formatRelative(new Date(request.expiresAt), new Date())}
          />
        )}
        <LabeledNode
          nodeIsText
          label="Status"
          direction="vertical"
          node={last(request.statusHistory)?.status}
        />
        <div className={appClasses.mainNoPadding}>
          <AssignedPermissionGroupList
            workspaceId={request.workspaceId}
            permissionGroups={request.permissionGroupsOnAccept || []}
            title="Permission Groups Assigned if Accepted"
          />
        </div>
      </Space>
    </div>
  );
}

export default WorkspaceRequest;
