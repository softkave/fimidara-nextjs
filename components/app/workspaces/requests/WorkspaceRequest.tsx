import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { formatDateTime } from "@/lib/utils/dateFns";
import Paragraph from "antd/es/typography/Paragraph";
import assert from "assert";
import { CollaborationRequestForWorkspace } from "fimidara";
import { useRouter } from "next/navigation";
import React from "react";
import WorkspaceRequestMenu from "./WorkspaceRequestMenu";

export interface IWorkspaceRequestProps {
  request: CollaborationRequestForWorkspace;
}

function WorkspaceRequest(props: IWorkspaceRequestProps) {
  const { request: resource } = props;
  const router = useRouter();

  const onCompleteDeleteRequest = React.useCallback(async () => {
    assert(resource, new Error("Collaboration request not found"));
    router.push(appWorkspacePaths.requestList(resource.workspaceId));
  }, [resource, router]);

  return (
    <div>
      <div className="space-y-8">
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
              <Paragraph
                ellipsis={{ rows: 2 }}
                className={appClasses.muteMargin}
              >
                {resource.message}
              </Paragraph>
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
      </div>
    </div>
  );
}

export default WorkspaceRequest;
