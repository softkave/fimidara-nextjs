import { Space } from "antd";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useOrgPermissionGroupList from "../../../../lib/hooks/orgs/useOrgPermissionGroupList";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import PermissionGroupList from "./PermissionGroupList";

export interface IOrganizationPermissionGroupsProps {
  orgId: string;
}

const OrganizationPermissionGroups: React.FC<
  IOrganizationPermissionGroupsProps
> = (props) => {
  const { orgId } = props;
  const { data, error, isLoading } = useOrgPermissionGroupList(orgId);
  let content: React.ReactNode = null;

  if (isLoading || !data) {
    content = <PageLoading messageText="Loading preset permission groups..." />;
  } else if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={
          error?.message || "Error fetching preset permission groups"
        }
      />
    );
  } else if (data.presets.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No permission groups yet. Create one using the plus button above."
      />
    );
  } else {
    content = <PermissionGroupList orgId={orgId} presets={data.presets} />;
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          title="Preset Permission Groups"
          formLinkPath={appOrgPaths.createPermissionGroupForm(orgId)}
        />
        {content}
      </Space>
    </div>
  );
};

export default OrganizationPermissionGroups;
