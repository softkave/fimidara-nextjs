import ComponentHeader from "@/components/utils/ComponentHeader.tsx";
import LabeledNode from "@/components/utils/LabeledNode.tsx";
import { appClasses } from "@/components/utils/theme.ts";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { formatDateTime } from "@/lib/utils/dateFns";
import { Space } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { Workspace } from "fimidara";
import { useRouter } from "next/navigation";
import React from "react";
import WorkspaceMenu from "./WorkspaceMenu.tsx";

export interface WorkspaceComponentProps {
  workspace: Workspace;
}

function WorkspaceComponent(props: WorkspaceComponentProps) {
  const { workspace: resource } = props;
  const router = useRouter();
  const onCompeleteDeleteWorkspace = React.useCallback(async () => {
    router.push(appWorkspacePaths.workspaces);
  }, [router]);

  return (
    <div>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
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
            node={
              <Paragraph
                ellipsis={{ rows: 2 }}
                className={appClasses.muteMargin}
              >
                {resource.description}
              </Paragraph>
            }
          />
        )}
      </Space>
    </div>
  );
}

export default WorkspaceComponent;
