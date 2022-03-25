import { RightOutlined } from "@ant-design/icons";
import { Button, Space, Tabs } from "antd";
import Link from "next/link";
import React from "react";
import { appOrgPaths } from "../../../lib/definitions/system";
import useOrg from "../../../lib/hooks/orgs/useOrg";
import { getBaseError } from "../../../lib/utilities/errors";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import { appClasses } from "../../utils/theme";
import AppHeader from "../AppHeader";
import OrgHeader from "./OrgHeader";

export interface IOrganizationProps {
  orgId: string;
  activeKey: string;
}

const Organization: React.FC<IOrganizationProps> = (props) => {
  const { orgId, activeKey, children } = props;
  const { data, error, isLoading } = useOrg(orgId);

  if (error) {
    return (
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <AppHeader />
        <PageError
          className={appClasses.main}
          messageText={getBaseError(error) || "Error fetching organization"}
        />
      </Space>
    );
  }

  if (isLoading || !data) {
    return (
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <AppHeader />
        <PageLoading messageText="Loading organization..." />
      </Space>
    );
  }

  const org = data?.organization!;
  const paths = {
    files: appOrgPaths.rootFolderList(org.resourceId),
    collaborators: appOrgPaths.collaboratorList(org.resourceId),
    requests: appOrgPaths.requestList(org.resourceId),
    programTokens: appOrgPaths.programTokenList(org.resourceId),
    clientTokens: appOrgPaths.clientTokenList(org.resourceId),
    permissionGroups: appOrgPaths.permissionGroupList(org.resourceId),
  };

  return (
    <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
      <OrgHeader org={org} />
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

export default Organization;
