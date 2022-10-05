import { RightOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Space, Tabs } from "antd";
import Link from "next/link";
import React from "react";
import { SWRConfiguration } from "swr";
import { appWorkspacePaths } from "../../../lib/definitions/system";
import { IWorkspace } from "../../../lib/definitions/workspace";
import useWorkspace from "../../../lib/hooks/workspaces/useWorkspace";
import { getBaseError } from "../../../lib/utilities/errors";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import { appClasses } from "../../utils/theme";
import LoggedInHeader from "../LoggedInHeader";
import WorkspaceHeader from "./WorkspaceHeader";

export interface IWorkspaceProps {
  workspaceId: string;
  activeKey: string;
  swrConfig?: SWRConfiguration;
  render?: (workspace: IWorkspace) => React.ReactElement;
}

const classes = {
  root: css({
    "& .ant-tabs-nav-wrap": {
      // maxWidth: appDimensions.app.maxWidth,
      // margin: "0 auto",
      // padding: "0px",
    },

    "& .ant-tabs-tab:first-of-type": {
      marginLeft: "16px",
    },

    "& .ant-tabs-tab:last-of-type": {
      marginRight: "16px",
    },

    "@media (min-width: 720px)": {
      "& .ant-tabs-nav-wrap": {
        display: "flex",
        justifyContent: "center",
      },
    },
  }),
};

const Workspace: React.FC<IWorkspaceProps> = (props) => {
  const { workspaceId, activeKey, swrConfig, render, children } = props;
  const { data, error, isLoading } = useWorkspace(workspaceId, swrConfig);
  if (error) {
    return (
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <LoggedInHeader />
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
        <LoggedInHeader />
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
    usageRecords: appWorkspacePaths.usageRecordList(workspace.resourceId),
  };

  const contentNode = render ? render(workspace) : children;
  return (
    <Space
      direction="vertical"
      size={"middle"}
      style={{ width: "100%" }}
      className={classes.root}
    >
      <WorkspaceHeader workspace={workspace} />
      <Tabs animated={false} activeKey={activeKey} moreIcon={<RightOutlined />}>
        <Tabs.TabPane
          tab={
            <Link href={paths.files}>
              <a>Files</a>
            </Link>
          }
          key={paths.files}
        >
          {paths.files === activeKey && contentNode}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link href={paths.collaborators}>
              <a>Collaborators</a>
            </Link>
          }
          key={paths.collaborators}
        >
          {paths.collaborators === activeKey && contentNode}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link href={paths.requests}>
              <a>Requests</a>
            </Link>
          }
          key={paths.requests}
        >
          {paths.requests === activeKey && contentNode}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link href={paths.programTokens}>
              <a>Program Tokens</a>
            </Link>
          }
          key={paths.programTokens}
        >
          {paths.programTokens === activeKey && contentNode}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link href={paths.clientTokens}>
              <a>Client Tokens</a>
            </Link>
          }
          key={paths.clientTokens}
        >
          {paths.clientTokens === activeKey && contentNode}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link href={paths.permissionGroups}>
              <a>Permission Groups</a>
            </Link>
          }
          key={paths.permissionGroups}
        >
          {paths.permissionGroups === activeKey && contentNode}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Link href={paths.usageRecords}>
              <a>Usage Records</a>
            </Link>
          }
          key={paths.usageRecords}
        >
          {paths.usageRecords === activeKey && contentNode}
        </Tabs.TabPane>
      </Tabs>
    </Space>
  );
};

export default Workspace;
