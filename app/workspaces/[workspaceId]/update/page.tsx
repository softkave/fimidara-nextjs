"use client";

import UploadWorkspaceAvatar from "@/components/app/workspaces/UploadWorkspaceAvatar";
import WorkspaceComponent from "@/components/app/workspaces/WorkspaceComponent.tsx";
import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer.tsx";
import WorkspaceForm from "@/components/app/workspaces/WorkspaceForm";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import { Divider, Space } from "antd";
import { NextPage } from "next";

interface IEditWorkspacePageProps extends IWorkspaceComponentProps {}

const EditWorkspacePage: NextPage<IEditWorkspacePageProps> = (props) => {
  const { workspaceId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <WorkspaceContainer
        workspaceId={workspaceId}
        render={(workspace) => (
          <Space direction="vertical" style={{ width: "100%" }} size={"large"}>
            <UploadWorkspaceAvatar workspaceId={workspace.resourceId} />
            <Divider orientation="left">Workspace Details</Divider>
            <WorkspaceComponent workspace={workspace} />
            <Divider orientation="left">Workspace Form</Divider>
            <WorkspaceForm workspace={workspace} />
          </Space>
        )}
      />
    ),
  });
};

export default EditWorkspacePage;
