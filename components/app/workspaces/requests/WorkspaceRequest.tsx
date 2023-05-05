import { appWorkspacePaths } from "@/lib/definitions/system";
import { getBaseError } from "@/lib/utils/errors";
import { Space } from "antd";
import assert from "assert";
import { formatRelative } from "date-fns";
import { useRouter } from "next/router";
import React from "react";
import { useWorkspaceCollaborationRequestFetchHook } from "../../../../lib/hooks/fetchHooks";
import ComponentHeader from "../../../utils/ComponentHeader";
import LabeledNode from "../../../utils/LabeledNode";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import WorkspaceRequestMenu from "./WorkspaceRequestMenu";

export interface IWorkspaceRequestProps {
  requestId: string;
}

function WorkspaceRequest(props: IWorkspaceRequestProps) {
  const { requestId } = props;
  const router = useRouter();
  const data = useWorkspaceCollaborationRequestFetchHook({ requestId });
  const error = data.store.error;
  const { resource } = data.store.get(undefined);
  const isLoading = data.store.loading || !data.store.initialized;

  const onCompleteDeleteRequest = React.useCallback(async () => {
    assert(resource, new Error("Collaboration request not found."));
    router.push(appWorkspacePaths.requestList(resource.workspaceId));
  }, [data, router]);

  if (error) {
    return (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching collaboration request"
        }
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading collaboration resource..." />;
  } else if (!resource) {
    return <PageNothingFound messageText="Collaboration request not found." />;
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader title={resource.recipientEmail}>
          <WorkspaceRequestMenu
            request={resource}
            onCompleteDeleteRequest={onCompleteDeleteRequest}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={resource.resourceId}
        />
        {resource.message && (
          <LabeledNode
            nodeIsText
            label="Message"
            direction="vertical"
            node={resource.message}
          />
        )}
        {resource.expiresAt && (
          <LabeledNode
            nodeIsText
            label="Expires"
            direction="vertical"
            node={formatRelative(new Date(resource.expiresAt), new Date())}
          />
        )}
        <LabeledNode
          nodeIsText
          label="Status"
          direction="vertical"
          node={resource.status}
        />
      </Space>
    </div>
  );
}

export default WorkspaceRequest;
