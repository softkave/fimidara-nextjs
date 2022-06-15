import { Space } from "antd";
import React from "react";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import AssignedPermissionGroupList from "./AssignedPermissionGroupList";
import assert from "assert";
import ComponentHeader from "../../../utils/ComponentHeader";
import { useRouter } from "next/router";
import {
  appWorkspacePaths,
  AppResourceType,
} from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import usePermissionGroup from "../../../../lib/hooks/workspaces/usePermissionGroup";
import { getUseWorkspacePermissionGroupListHookKey } from "../../../../lib/hooks/workspaces/useWorkspacePermissionGroupList";
import PermissionGroupMenu from "./PermissionGroupMenu";
import { appClasses } from "../../../utils/theme";
import LabeledNode from "../../../utils/LabeledNode";
import EntityPermissionGroupList from "../permissionItems/EntityPermissionItemList";
import { getBaseError } from "../../../../lib/utilities/errors";

export interface IPermissionGroupProps {
  permissionGroupId: string;
}

function PermissionGroup(props: IPermissionGroupProps) {
  const { permissionGroupId } = props;
  const router = useRouter();
  const { error, isLoading, data } = usePermissionGroup(permissionGroupId);
  const { mutate: cacheMutate } = useSWRConfig();
  // const onRemovePermissionGroup = React.useCallback(
  //   async (permissionGroupId: string) => {
  //     assert(data?.permissionGroup, new Error("Permission group not found"));
  //     const updatedPermissionGroups = data.permissionGroup.permissionGroups.filter(
  //       (item) => item.permissionGroupId !== permissionGroupId
  //     );

  //     const result = await PermissionGroupAPI.updatePermissionGroup({
  //       permissionGroupId,
  //       data: { permissionGroups: updatedPermissionGroups },
  //     });

  //     mutate(result, false);
  //   },
  //   [data, permissionGroupId]
  // );

  const onCompleteDeletePermissionGroup = React.useCallback(async () => {
    assert(data?.permissionGroup, new Error("Permission group not found"));
    cacheMutate(
      getUseWorkspacePermissionGroupListHookKey(data.permissionGroup.workspaceId)
    );
    router.push(appWorkspacePaths.collaboratorList(data.permissionGroup.workspaceId));
  }, [data, router, cacheMutate]);

  if (error) {
    return (
      <PageError
        messageText={getBaseError(error) || "Error fetching permission group"}
      />
    );
  }

  if (isLoading || !data) {
    return <PageLoading messageText="Loading permission group..." />;
  }

  const permissionGroup = data.permissionGroup;
  return (
    <div>
      <Space
        direction="vertical"
        size={32}
        style={{ width: "100%", padding: "16px" }}
      >
        <ComponentHeader
          title={permissionGroup.name}
          className={appClasses.mainNoPadding}
        >
          <PermissionGroupMenu
            permissionGroup={permissionGroup}
            onCompleteDelete={onCompleteDeletePermissionGroup}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={permissionGroup.resourceId}
          className={appClasses.mainNoPadding}
        />
        {permissionGroup.description && (
          <LabeledNode
            nodeIsText
            label="Description"
            node={permissionGroup.description}
            direction="vertical"
            className={appClasses.mainNoPadding}
          />
        )}
        <div className={appClasses.mainNoPadding}>
          <AssignedPermissionGroupList
            workspaceId={permissionGroup.workspaceId}
            permissionGroups={permissionGroup.permissionGroups}
          />
        </div>
        <EntityPermissionGroupList
          workspaceId={permissionGroup.workspaceId}
          entityId={permissionGroup.resourceId}
          entityType={AppResourceType.PermissionGroup}
        />
      </Space>
    </div>
  );
}

export default PermissionGroup;
