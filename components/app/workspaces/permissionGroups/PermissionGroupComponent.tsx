import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { useWorkspacePermissionGroupFetchHook } from "@/lib/hooks/fetchHooks/permissionGroup.ts";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { formatDateTime } from "@/lib/utils/dateFns";
import { getBaseError } from "@/lib/utils/errors";
import assert from "assert";
import { noop } from "lodash-es";
import { useRouter } from "next/navigation";
import AssignedPermissionGroupList from "./AssignedPermissionGroupList";
import PermissionGroupMenu from "./PermissionGroupMenu";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { useCallback } from "react";

export interface PermissionGroupComponentProps {
  permissionGroupId: string;
}

function PermissionGroupComponent(props: PermissionGroupComponentProps) {
  const { permissionGroupId } = props;
  const router = useRouter();
  const { fetchState } = useWorkspacePermissionGroupFetchHook({
    permissionGroupId,
  });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  const onCompleteDeletePermissionGroup = useCallback(async () => {
    assert(resource, new Error("Permission group not found"));
    router.push(kAppWorkspacePaths.collaboratorList(resource.workspaceId));
  }, [router, resource]);

  if (resource) {
    return (
      <div>
        <div className="space-y-8">
          <ComponentHeader title={resource.name}>
            <PermissionGroupMenu
              permissionGroup={resource}
              onCompleteDelete={onCompleteDeletePermissionGroup}
              onCompleteUnassignPermissionGroup={noop}
            />
          </ComponentHeader>
          <LabeledNode
            nodeIsText
            copyable
            code
            direction="vertical"
            label="Resource ID"
            node={resource.resourceId}
          />
          <LabeledNode
            nodeIsText
            direction="vertical"
            label="Last Updated"
            node={formatDateTime(resource.lastUpdatedAt)}
          />
          {resource.description && (
            <LabeledNode
              direction="vertical"
              label="Description"
              node={<p className="line-clamp-2">{resource.description}</p>}
            />
          )}
          <AssignedPermissionGroupList
            entityId={permissionGroupId}
            workspaceId={resource.workspaceId}
          />
        </div>
      </div>
    );
  } else if (error) {
    return (
      <PageError
        message={getBaseError(error) || "Error fetching permission group"}
      />
    );
  } else if (isLoading) {
    return <PageLoading message="Loading permission group.." />;
  } else {
    return <PageNothingFound message="Permission group not found" />;
  }
}

export default PermissionGroupComponent;
