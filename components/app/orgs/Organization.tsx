import { RightOutlined } from "@ant-design/icons";
import { Space, Tabs } from "antd";
import React from "react";
import { appOrgPaths } from "../../../lib/definitions/system";
import useOrg from "../../../lib/hooks/orgs/useOrg";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import { appClasses } from "../../utils/theme";
import OrganizationClientTokens from "./clientTokens/OrganizationClientTokens";
import OrganizationCollaborators from "./collaborators/OrganizationCollaborators";
import OrganizationFiles from "./files/OrganizationFiles";
import OrgHeader from "./OrgHeader";
import OrganizationPermissionGroups from "./permissionGroups/OrganizationPermissionGroups";
import OrganizationProgramTokens from "./programTokens/OrganizationProgramTokens";
import OrganizationRequests from "./requests/OrganizationRequests";

export interface IOrganizationProps {
  orgId: string;
}

enum Tabkeys {
  Files = "Files",
  Collaborators = "Collaborators",
  Requests = "Requests",
  ProgramTokens = "ProgramTokens",
  ClientTokens = "ClientTokens",
  PermissionGroups = "PermissionGroups",
}

const Organization: React.FC<IOrganizationProps> = (props) => {
  const { orgId } = props;
  const { data, error, isLoading } = useOrg(orgId);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading organization..." />;
  } else if (error) {
    return (
      <PageError
        className={appClasses.main}
        messageText={error?.message || "Error fetching organization"}
      />
    );
  }

  const pathname = window.location.pathname;
  const org = data?.organization!;
  const paths = {
    files: appOrgPaths.files(org.resourceId),
    collaborators: appOrgPaths.collaboratorList(org.resourceId),
    requests: appOrgPaths.requestList(org.resourceId),
    programTokens: appOrgPaths.programTokenList(org.resourceId),
    clientTokens: appOrgPaths.clientTokenList(org.resourceId),
    permissionGroups: appOrgPaths.permissionGroupList(org.resourceId),
  };

  return (
    <Space direction="vertical" size={"large"}>
      <OrgHeader org={org} />
      <Tabs
        defaultActiveKey={pathname}
        moreIcon={<RightOutlined />}
        tabBarExtraContent={{
          left: <div style={{ marginLeft: "16px" }} />,
        }}
      >
        <Tabs.TabPane tab="Files" key={paths.files}>
          <OrganizationFiles org={org} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Collaborators" key={paths.collaborators}>
          <OrganizationCollaborators org={org} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Requests" key={paths.requests}>
          <OrganizationRequests org={org} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Program Tokens" key={paths.programTokens}>
          <OrganizationProgramTokens org={org} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Client Tokens" key={paths.clientTokens}>
          <OrganizationClientTokens org={org} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Permission Groups" key={paths.permissionGroups}>
          <OrganizationPermissionGroups org={org} />
        </Tabs.TabPane>
      </Tabs>
    </Space>
  );
};

export default Organization;
