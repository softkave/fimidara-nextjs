import { Space } from "antd";
import React from "react";
import { IOrganization } from "../../../../lib/definitions/organization";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useOrgRequestList from "../../../../lib/hooks/orgs/useOrgRequestList";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import OrgRequestList from "./OrgRequestList";

export interface IOrganizationRequestsProps {
  org: IOrganization;
}

const OrganizationRequests: React.FC<IOrganizationRequestsProps> = (props) => {
  const { org } = props;
  const { data, error, isLoading } = useOrgRequestList(org.resourceId);
  let content: React.ReactNode = null;

  if (isLoading || !data) {
    content = <PageLoading messageText="Loading collaboration requests..." />;
  } else if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={error?.message || "Error fetching collaboration requests"}
      />
    );
  } else if (data.requests.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No collaborations requests yet. Create one using the plus button above."
      />
    );
  } else {
    content = (
      <OrgRequestList orgId={org.resourceId} requests={data.requests} />
    );
  }

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", padding: "16px" }}
      size="large"
    >
      <ListHeader
        title="Collaboration Requests"
        formLinkPath={appOrgPaths.createRequestForm(org.resourceId)}
      />
      {content}
    </Space>
  );
};

export default OrganizationRequests;