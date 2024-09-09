import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { formatDateTime } from "@/lib/utils/dateFns";
import assert from "assert";
import { CollaborationRequestForWorkspace } from "fimidara";
import { useRouter } from "next/navigation";
import WorkspaceRequestMenu from "./WorkspaceRequestMenu";
import { useCallback } from "react";

export interface IWorkspaceRequestProps {
  request: CollaborationRequestForWorkspace;
}

function WorkspaceRequest(props: IWorkspaceRequestProps) {
  const { request: resource } = props;
  const router = useRouter();

  const onCompleteDeleteRequest = useCallback(async () => {
    assert(resource, new Error("Collaboration request not found"));
    router.push(kAppWorkspacePaths.requestList(resource.workspaceId));
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
            node={<p className="line-clamp-2">{resource.message}</p>}
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
