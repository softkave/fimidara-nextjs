import { Space, Typography } from "antd";
import React from "react";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import assert from "assert";
import ComponentHeader from "../../../utils/ComponentHeader";
import { useRouter } from "next/router";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import LabeledNode from "../../../utils/LabeledNode";
import useCollaborationRequest from "../../../../lib/hooks/requests/useRequest";
import { getUseWorkspaceRequestListHookKey } from "../../../../lib/hooks/workspaces/useWorkspaceRequestList";
import WorkspaceRequestMenu from "./WorkspaceRequestMenu";
import { formatRelative } from "date-fns";
import { last } from "lodash";
import { appClasses } from "../../../utils/theme";
import { getBaseError } from "../../../../lib/utilities/errors";

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
  }, [data]);

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
      </Space>
    </div>
  );
}

export default WorkspaceRequest;
