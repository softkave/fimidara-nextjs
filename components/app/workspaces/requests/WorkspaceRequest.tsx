import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { formatDateTime } from "@/lib/utils/dateFns";
import { Space, Typography } from "antd";
import assert from "assert";
import { CollaborationRequestForWorkspace } from "fimidara";
import { useRouter } from "next/router";
import React from "react";
import { appClasses } from "../../../utils/theme";
import WorkspaceRequestMenu from "./WorkspaceRequestMenu";

export interface IWorkspaceRequestProps {
  request: CollaborationRequestForWorkspace;
}

function WorkspaceRequest(props: IWorkspaceRequestProps) {
  const { request: resource } = props;
  const router = useRouter();

  const onCompleteDeleteRequest = React.useCallback(async () => {
    assert(resource, new Error("Collaboration request not found."));
    router.push(appWorkspacePaths.requestList(resource.workspaceId));
  }, [resource, router]);

  return (
    <div>
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
          code
          direction="vertical"
          label="Resource ID"
          node={resource.resourceId}
        />
        {resource.message && (
          <LabeledNode
            direction="vertical"
            label="Message"
            node={
              <Typography.Paragraph
                ellipsis={{ rows: 2 }}
                className={appClasses.muteMargin}
              >
                {resource.message}
              </Typography.Paragraph>
            }
          />
        )}
        {resource.expiresAt && (
          <LabeledNode
            nodeIsText
            label="Expires"
            direction="vertical"
            node={formatDateTime(resource.expiresAt)}
          />
        )}
        <LabeledNode
          nodeIsText
          code
          label="Status"
          direction="vertical"
          node={resource.status}
        />
        <LabeledNode
          nodeIsText
          direction="vertical"
          label="Last Updated"
          node={formatDateTime(resource.lastUpdatedAt)}
        />
      </Space>
    </div>
  );
}

export default WorkspaceRequest;
