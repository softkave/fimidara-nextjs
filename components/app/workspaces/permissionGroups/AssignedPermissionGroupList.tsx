"use client";

import IconButton from "@/components/utils/buttons/IconButton";
import ItemList from "@/components/utils/list/ItemList";
import ListHeader from "@/components/utils/list/ListHeader";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchNonPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useEntityAssignedPermissionGroupsFetchHook } from "@/lib/hooks/fetchHooks";
import { formatDateTime } from "@/lib/utils/dateFns";
import { getBaseError } from "@/lib/utils/errors";
import { indexArray } from "@/lib/utils/indexArray";
import { PlusOutlined } from "@ant-design/icons";
import { useToggle } from "ahooks";
import { Space } from "antd";
import Text from "antd/es/typography/Text";
import { noop } from "lodash-es";
import Link from "next/link";
import React from "react";
import AssignPermissionGroupsForm from "./AssignPermissionGroupsForm";
import PermissionGroupMenu from "./PermissionGroupMenu";

export interface IAssignedPermissionGroupListProps
  extends StyleableComponentProps {
  workspaceId: string;
  entityId: string;
}

// TODO: add bulk remove, and add bulk actions to other lists

const AssignedPermissionGroupList: React.FC<
  IAssignedPermissionGroupListProps
> = (props) => {
  const { workspaceId, entityId, className, style } = props;
  const { fetchState, clearFetchState } =
    useEntityAssignedPermissionGroupsFetchHook({
      entityId,
      workspaceId,
    });
  const { error, isLoading, resourceList, other } =
    useFetchNonPaginatedResourceListFetchState(fetchState);

  const [isAssignFormVisible, toggleHook] = useToggle();

  const permissionGroupsMap = React.useMemo(
    () => indexArray(resourceList, { path: "resourceId" }),
    [resourceList]
  );

  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        message={
          getBaseError(error) || "Error fetching assigned permission groups"
        }
      />
    );
  } else if (isLoading) {
    content = <PageLoading message="Loading assigned permission groups..." />;
  } else if (other) {
    content = (
      <ItemList
        items={other.immediateAssignedPermissionGroupsMeta}
        renderItem={(item) => {
          const permissionGroup = permissionGroupsMap[item.permissionGroupId];

          if (!permissionGroup) {
            return null;
          }

          return (
            <ThumbnailContent
              key={item.permissionGroupId}
              main={
                <div className={appClasses.thumbnailMain}>
                  <Link
                    href={appWorkspacePaths.permissionGroup(
                      workspaceId,
                      item.permissionGroupId
                    )}
                  >
                    {permissionGroup.name}
                  </Link>
                  {permissionGroup.description && (
                    <Text type="secondary">{permissionGroup.description}</Text>
                  )}
                  <Text type="secondary">
                    Assigned {formatDateTime(item.assignedAt)}
                  </Text>
                </div>
              }
              menu={
                <PermissionGroupMenu
                  key="menu"
                  permissionGroup={permissionGroup}
                  unassignParams={{ entityId }}
                  onCompleteDelete={noop}
                  onCompleteUnassignPermissionGroup={noop}
                />
              }
            />
          );
        }}
        getId={(item) => item.permissionGroupId}
        emptyMessage={"No assigned permission groups yet"}
      />
    );
  }

  let assignFormNode: React.ReactNode = null;

  if (other && isAssignFormVisible) {
    assignFormNode = (
      <AssignPermissionGroupsForm
        workspaceId={workspaceId}
        entityId={entityId}
        permissionGroups={other.immediateAssignedPermissionGroupsMeta.map(
          (p) => p.permissionGroupId
        )}
        onClose={toggleHook.toggle}
        onCompleteSubmit={() => {
          clearFetchState();
        }}
      />
    );
  }

  return (
    <React.Fragment>
      <Space
        direction="vertical"
        style={{ width: "100%", ...style }}
        className={className}
        size="large"
      >
        <ListHeader
          label="Assigned Permission Groups"
          buttons={
            <Space>
              <IconButton
                icon={<PlusOutlined />}
                onClick={() => toggleHook.toggle()}
              />
            </Space>
          }
        />
        <PaginatedContent content={content} />
      </Space>
      {assignFormNode}
    </React.Fragment>
  );
};

export default AssignedPermissionGroupList;
