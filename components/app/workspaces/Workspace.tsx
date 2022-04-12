import { RightOutlined } from "@ant-design/icons";
import { Button, Space, Tabs } from "antd";
import Link from "next/link";
import React from "react";
import { SWRConfiguration } from "swr";
import { appWorkspacePaths } from "../../../lib/definitions/system";
import useWorkspace from "../../../lib/hooks/workspaces/useWorkspace";
import { getBaseError } from "../../../lib/utilities/errors";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import { appClasses } from "../../utils/theme";
import AppHeader from "../AppHeader";
import WorkspaceHeader from "./WorkspaceHeader";

export interface IWorkspaceProps {
  workspaceId: string;
  activeKey: string;
  swrConfig?: SWRConfiguration;
}

const Workspace: React.FC<IWorkspaceProps> = (props) => {
  const { workspaceId, activeKey, swrConfig, children } = props;
  const { data, error, isLoading } = useWorkspace(workspaceId, swrConfig);

  if (error) {
    return (
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <AppHeader />
        <PageError
          className={appClasses.main}
          messageText={getBaseError(error) || "Error fetching workspace"}
        />
      </Space>
    );
  }

  if (isLoading || !data) {
    return (
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <AppHeader />
        <PageLoading messageText="Loading workspace..." />
      </Space>
    );
  }

  const workspace = data?.workspace!;
  const paths = {
    files: appWorkspacePaths.rootFolderList(workspace.resourceId),
    collaborators: appWorkspacePaths.collaboratorList(workspace.resourceId),
    requests: appWorkspacePaths.requestList(workspace.resourceId),
    programTokens: appWorkspacePaths.programTokenList(workspace.resourceId),
    clientTokens: appWorkspacePaths.clientTokenList(workspace.resourceId),
    permissionGroups: appWorkspacePaths.permissionGroupList(
      workspace.resourceId
    ),
  };

  return (
    <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
      <WorkspaceHeader workspace={workspace} />
      <Tabs
        // centered
        animated={false}
        defaultActiveKey={activeKey}
        moreIcon={<RightOutlined />}
        tabBarExtraContent={{
          left: <div style={{ marginLeft: "16px" }} />,
        }}
      >
        <Tabs.TabPane
          tab={
            <Link href={paths.files}>
              <a>Files</a>
            </Link>
          }
          key={paths.files}
        >
          {paths.files === activeKey && children}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link href={paths.collaborators}>
              <a>Collaborators</a>
            </Link>
          }
          key={paths.collaborators}
        >
          {paths.collaborators === activeKey && children}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link href={paths.requests}>
              <a>Requests</a>
            </Link>
          }
          key={paths.requests}
        >
          {paths.requests === activeKey && children}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link href={paths.programTokens}>
              <a>Program Tokens</a>
            </Link>
          }
          key={paths.programTokens}
        >
          {paths.programTokens === activeKey && children}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link href={paths.clientTokens}>
              <a>Client Tokens</a>
            </Link>
          }
          key={paths.clientTokens}
        >
          {paths.clientTokens === activeKey && children}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link href={paths.permissionGroups}>
              <a>Permission Groups</a>
            </Link>
          }
          key={paths.permissionGroups}
        >
          {paths.permissionGroups === activeKey && children}
        </Tabs.TabPane>
      </Tabs>
    </Space>
  );
};

export default Workspace;
