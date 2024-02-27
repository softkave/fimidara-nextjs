import { appWorkspacePaths } from "@/lib/definitions/system";
import { formatDateTime } from "@/lib/utils/dateFns";
import { Space, Typography } from "antd";
import { Workspace } from "fimidara";
import { useRouter } from "next/router";
import React from "react";
import ComponentHeader from "../../utils/ComponentHeader";
import LabeledNode from "../../utils/LabeledNode";
import { appClasses } from "../../utils/theme";
import WorkspaceMenu from "./WorkspaceMenu";

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
              <Typography.Paragraph
                ellipsis={{ rows: 2 }}
                className={appClasses.muteMargin}
              >
                {resource.description}
              </Typography.Paragraph>
            }
          />
        )}
      </Space>
    </div>
  );
}

export default WorkspaceComponent;
