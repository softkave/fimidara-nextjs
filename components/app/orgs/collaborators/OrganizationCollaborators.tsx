import { Space } from "antd";
import { isUndefined } from "lodash";
import React from "react";
import {
  appOrgPaths,
  AppResourceType,
} from "../../../../lib/definitions/system";
import { ICollaborator } from "../../../../lib/definitions/user";
import useOrgCollaboratorList from "../../../../lib/hooks/orgs/useOrgCollaboratorList";
import { getBaseError } from "../../../../lib/utilities/errors";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import GrantPermissionMenu from "../permissionItems/GrantPermissionMenu";
import CollaboratorList from "./CollaboratorList";

export interface IOrganizationCollaboratorsProps {
  orgId: string;
  renderItem?: (item: ICollaborator) => React.ReactNode;
  renderList?: (items: ICollaborator[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  menu?: React.ReactNode;
}

const OrganizationCollaborators: React.FC<IOrganizationCollaboratorsProps> = (
  props
) => {
  const { orgId, menu, renderList, renderRoot, renderItem } = props;
  const { data, error, isLoading } = useOrgCollaboratorList(orgId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching collaborators"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading collaborators..." />;
  } else if (data.collaborators.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No collaborators yet. Create one using the plus button above."
      />
    );
  } else {
    content = renderList ? (
      renderList(data.collaborators)
    ) : (
      <CollaboratorList
        orgId={orgId}
        collaborators={data.collaborators}
        renderItem={renderItem}
      />
    );
  }

  if (renderRoot) {
    return renderRoot(content);
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          title="Collaborators"
          formLinkPath={appOrgPaths.createRequestForm(orgId)}
          actions={
            !isUndefined(menu) ? (
              menu
            ) : (
              <GrantPermissionMenu
                orgId={orgId}
                itemResourceType={AppResourceType.User}
                permissionOwnerId={orgId}
                permissionOwnerType={AppResourceType.Organization}
              />
            )
          }
        />
        {content}
      </Space>
    </div>
  );
};

export default OrganizationCollaborators;
