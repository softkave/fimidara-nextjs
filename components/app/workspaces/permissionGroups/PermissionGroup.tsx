import { appWorkspacePaths } from "@/lib/definitions/system";
import { getBaseError } from "@/lib/utils/errors";
import { Space } from "antd";
import assert from "assert";
import { useRouter } from "next/router";
import React from "react";
import { useWorkspacePermissionGroupFetchHook } from "../../../../lib/hooks/fetchHooks";
import ComponentHeader from "../../../utils/ComponentHeader";
import LabeledNode from "../../../utils/LabeledNode";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import PermissionGroupMenu from "./PermissionGroupMenu";

export interface IPermissionGroupProps {
  permissionGroupId: string;
}

function PermissionGroup(props: IPermissionGroupProps) {
  const { permissionGroupId } = props;
  const router = useRouter();
  const data = useWorkspacePermissionGroupFetchHook({ permissionGroupId });
  const error = data.store.error;
  const { resource } = data.store.get(undefined);
  const isLoading = data.store.loading || !data.store.initialized;

  const onCompleteDeletePermissionGroup = React.useCallback(async () => {
    assert(resource, new Error("Permission group not found."));
    router.push(appWorkspacePaths.collaboratorList(resource.workspaceId));
  }, [data, router]);

  if (error) {
    return (
      <PageError
        messageText={getBaseError(error) || "Error fetching permission group."}
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading permission group..." />;
  } else if (!resource) {
    return <PageNothingFound messageText="Permission group not found." />;
  }

  return (
    <div>
      <Space
        direction="vertical"
        size={32}
        style={{ width: "100%", padding: "16px" }}
      >
        <ComponentHeader
          title={resource.name}
          className={appClasses.mainNoPadding}
        >
          <PermissionGroupMenu
            permissionGroup={resource}
            onCompleteDelete={onCompleteDeletePermissionGroup}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={resource.resourceId}
          className={appClasses.mainNoPadding}
        />
        {resource.description && (
          <LabeledNode
            nodeIsText
            label="Description"
            node={resource.description}
            direction="vertical"
            className={appClasses.mainNoPadding}
          />
        )}
      </Space>
    </div>
  );
}

export default PermissionGroup;
