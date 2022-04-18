import { Space } from "antd";
import React from "react";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import AssignedPresetList from "./AssignedPresetList";
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
  presetId: string;
}

function PermissionGroup(props: IPermissionGroupProps) {
  const { presetId } = props;
  const router = useRouter();
  const { error, isLoading, data } = usePermissionGroup(presetId);
  const { mutate: cacheMutate } = useSWRConfig();
  // const onRemovePermissionGroup = React.useCallback(
  //   async (presetId: string) => {
  //     assert(data?.preset, new Error("Permission group not found"));
  //     const updatedPresets = data.preset.presets.filter(
  //       (item) => item.presetId !== presetId
  //     );

  //     const result = await PresetPermissionsGroupAPI.updatePreset({
  //       presetId,
  //       data: { presets: updatedPresets },
  //     });

  //     mutate(result, false);
  //   },
  //   [data, presetId]
  // );

  const onCompleteDeletePreset = React.useCallback(async () => {
    assert(data?.preset, new Error("Permission group not found"));
    cacheMutate(
      getUseWorkspacePermissionGroupListHookKey(data.preset.workspaceId)
    );
    router.push(appWorkspacePaths.collaboratorList(data.preset.workspaceId));
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

  const preset = data.preset;
  return (
    <div>
      <Space
        direction="vertical"
        size={32}
        style={{ width: "100%", padding: "16px" }}
      >
        <ComponentHeader
          title={preset.name}
          className={appClasses.mainNoPadding}
        >
          <PermissionGroupMenu
            preset={preset}
            onCompleteDelete={onCompleteDeletePreset}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={preset.resourceId}
          className={appClasses.mainNoPadding}
        />
        {preset.description && (
          <LabeledNode
            nodeIsText
            label="Description"
            node={preset.description}
            direction="vertical"
            className={appClasses.mainNoPadding}
          />
        )}
        <div className={appClasses.mainNoPadding}>
          <AssignedPresetList
            workspaceId={preset.workspaceId}
            presets={preset.presets}
          />
        </div>
        <EntityPermissionGroupList
          workspaceId={preset.workspaceId}
          entityId={preset.resourceId}
          entityType={AppResourceType.PresetPermissionsGroup}
        />
      </Space>
    </div>
  );
}

export default PermissionGroup;