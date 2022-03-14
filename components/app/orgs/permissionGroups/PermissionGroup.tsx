import { Space } from "antd";
import React from "react";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import AssignedPresetList from "./AssignedPresetList";
import assert from "assert";
import ComponentHeader from "../../../utils/ComponentHeader";
import { useRouter } from "next/router";
import {
  appOrgPaths,
  AppResourceType,
} from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import usePermissionGroup from "../../../../lib/hooks/orgs/usePermissionGroup";
import PresetPermissionsGroupAPI from "../../../../lib/api/endpoints/presetPermissionsGroup";
import { getUseOrgPermissionGroupListHookKey } from "../../../../lib/hooks/orgs/useOrgPermissionGroupList";
import PermissionGroupMenu from "./PermissionGroupMenu";
import { appClasses } from "../../../utils/theme";
import LabeledNode from "../../../utils/LabeledNode";
import EntityPermissionGroupList from "../permissionItems/EntityPermissionItemList";

export interface IPermissionGroupProps {
  presetId: string;
}

function PermissionGroup(props: IPermissionGroupProps) {
  const { presetId } = props;
  const router = useRouter();
  const { error, isLoading, data, mutate } = usePermissionGroup(presetId);
  const { mutate: cacheMutate } = useSWRConfig();
  const onRemovePermissionGroup = React.useCallback(
    async (presetId: string) => {
      assert(data?.preset, new Error("Permission group not found"));
      const updatedPresets = data.preset.presets.filter(
        (item) => item.presetId !== presetId
      );

      const result = await PresetPermissionsGroupAPI.updatePreset({
        presetId,
        data: { presets: updatedPresets },
      });

      mutate(result, false);
    },
    [data, presetId]
  );

  const onCompleteDeletePreset = React.useCallback(async () => {
    assert(data?.preset, new Error("Permission group not found"));
    cacheMutate(
      getUseOrgPermissionGroupListHookKey(data.preset.organizationId)
    );
    router.push(appOrgPaths.collaboratorList(data.preset.organizationId));
  }, [data]);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading permission group..." />;
  } else if (error) {
    return (
      <PageError
        messageText={error?.message || "Error fetching permission group"}
      />
    );
  }

  const preset = data.preset;
  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader title={preset.name}>
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
        />
        {preset.description && (
          <LabeledNode
            nodeIsText
            label="Description"
            node={preset.description}
            direction="vertical"
          />
        )}
        <AssignedPresetList
          orgId={preset.organizationId}
          presets={preset.presets}
          onRemoveItem={onRemovePermissionGroup}
        />
        <EntityPermissionGroupList
          orgId={preset.organizationId}
          entityId={preset.resourceId}
          entityType={AppResourceType.PresetPermissionsGroup}
        />
      </Space>
    </div>
  );
}

export default PermissionGroup;
