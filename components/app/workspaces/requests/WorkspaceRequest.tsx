import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import PageError from "@/components/utils/PageError";
import PageLoading from "@/components/utils/PageLoading";
import PageNothingFound from "@/components/utils/PageNothingFound";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceCollaborationRequestFetchHook } from "@/lib/hooks/singleResourceFetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { Space } from "antd";
import assert from "assert";
import { formatRelative } from "date-fns";
import { useRouter } from "next/router";
import React from "react";
import WorkspaceRequestMenu from "./WorkspaceRequestMenu";

export interface IWorkspaceRequestProps {
  requestId: string;
}

function WorkspaceRequest(props: IWorkspaceRequestProps) {
  const { requestId } = props;
  const router = useRouter();
  const { fetchState } = useWorkspaceCollaborationRequestFetchHook({
    requestId,
  });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  const onCompleteDeleteRequest = React.useCallback(async () => {
    assert(resource, new Error("Collaboration request not found."));
    router.push(appWorkspacePaths.requestList(resource.workspaceId));
  }, [resource, router]);

  if (resource) {
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
  } else if (error) {
    return (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching collaboration request"
        }
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading collaboration resource..." />;
  } else {
    return <PageNothingFound messageText="Collaboration request not found." />;
  }
}

export default WorkspaceRequest;
