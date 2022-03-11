import { RightOutlined } from "@ant-design/icons";
import { Space, Tabs } from "antd";
import React from "react";
import { IOrganization } from "../../../lib/definitions/organization";
import { appOrgPaths } from "../../../lib/definitions/system";
import OrganizationClientTokens from "./clientTokens/OrganizationClientTokens";
import OrganizationCollaborators from "./collaborators/OrganizationCollaborators";
import OrganizationFiles from "./files/OrganizationFiles";
import OrgHeader from "./OrgHeader";
import OrganizationPermissionGroups from "./permissionGroups/OrganizationPermissionGroups";
import OrganizationProgramTokens from "./programTokens/OrganizationProgramTokens";
import OrganizationRequests from "./requests/OrganizationRequests";

export interface IOrganizationProps {
  org: IOrganization;
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
  const { org } = props;
  const pathname = window.location.pathname;
  const paths = React.useMemo(() => {
    return {
      files: appOrgPaths.files(org.resourceId),
      collaborators: appOrgPaths.collaborators(org.resourceId),
      requests: appOrgPaths.requests(org.resourceId),
      programTokens: appOrgPaths.programTokens(org.resourceId),
      clientTokens: appOrgPaths.clientTokens(org.resourceId),
      permissionGroups: appOrgPaths.permissionGroups(org.resourceId),
    };
  }, [org]);

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
