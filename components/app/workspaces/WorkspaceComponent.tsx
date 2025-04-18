import ComponentHeader from "@/components/utils/ComponentHeader.tsx";
import LabeledNode from "@/components/utils/LabeledNode.tsx";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { formatDateTime } from "@/lib/utils/dateFns";
import { Workspace } from "fimidara";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import WorkspaceMenu from "./WorkspaceMenu.tsx";

export interface WorkspaceComponentProps {
  workspace: Workspace;
}

function WorkspaceComponent(props: WorkspaceComponentProps) {
  const { workspace: resource } = props;
  const router = useRouter();
  const onCompeleteDeleteWorkspace = useCallback(async () => {
    router.push(kAppWorkspacePaths.workspaces);
  }, [router]);

  return (
    <div>
      <div className="space-y-8">
        <ComponentHeader title={resource.name || resource.resourceId}>
          <WorkspaceMenu
            workspace={resource}
            onCompleteDelete={onCompeleteDeleteWorkspace}
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
        <LabeledNode
          nodeIsText
          direction="vertical"
          label="Last Updated"
          node={formatDateTime(resource.lastUpdatedAt)}
        />
        {resource.description && (
          <LabeledNode
            direction="vertical"
            label="Description"
            node={<p className="line-clamp-2">{resource.description}</p>}
          />
        )}
      </div>
    </div>
  );
}

export default WorkspaceComponent;
