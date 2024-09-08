import { Button } from "@/components/ui/button.tsx";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { FormAlertList } from "@/components/utils/FormAlertList";
import { useToast } from "@/hooks/use-toast.ts";
import {
  clearOutResolvedPermissionFetchStore,
  useMergeMutationHookStates,
  usePermissionsAddMutationHook,
  usePermissionsDeleteMutationHook,
} from "@/lib/hooks/mutationHooks";
import {
  AgentToken,
  Collaborator,
  DeletePermissionItemInput,
  FimidaraPermissionAction,
  FimidaraResourceType,
  PermissionGroup,
  PermissionItemInput,
} from "fimidara";
import { forEach, isBoolean, merge } from "lodash-es";
import AgentTokenListContainer from "../agentTokens/AgentTokenListContainer";
import CollaboratorListContainer from "../collaborators/CollaboratorListContainer";
import PermissionGroupListContainer from "../permissionGroups/PermissionGroupListContainer";
import TargetGrantPermissionFormEntityList, {
  splitKey,
} from "./TargetGrantPermissionFormEntityList";
import { ResolvedPermissionsMap, TargetIdPermissions } from "./types";
import { FC, useState } from "react";

export interface TargetGrantPermissionFormProps {
  workspaceId: string;
  targetId: string;
  targetType: FimidaraResourceType;
  onClose: () => void;
}

enum TabKey {
  Collaborator = "collaborator",
  AgentToken = "agent-token",
  PermissionGroup = "permission-group",
}

const TargetGrantPermissionForm: FC<TargetGrantPermissionFormProps> = (
  props
) => {
  const { workspaceId, targetId, targetType, onClose } = props;
  const { toast } = useToast();

  const [activeKey] = useState(TabKey.PermissionGroup);
  const [targetPermissions, setTargetPermissions] =
    useState<TargetIdPermissions>({ original: {}, updated: {} });

  const handleTargetPermissionsOnChange = (
    updated: ResolvedPermissionsMap,
    original: ResolvedPermissionsMap
  ) => {
    const newPermissions = merge({}, targetPermissions, {
      original,
      updated,
    });
    setTargetPermissions(newPermissions);
  };

  const addHook = usePermissionsAddMutationHook();
  const deleteHook = usePermissionsDeleteMutationHook();
  const { loading, error } = useMergeMutationHookStates(addHook, deleteHook);

  const handleOnSave = async () => {
    const { addItems, deleteItems } = getAddedAndDeletedPermissions(
      targetId,
      targetPermissions
    );

    await Promise.all([
      addItems.length &&
        addHook.runAsync({ body: { workspaceId, items: addItems } }),
      deleteItems &&
        deleteHook.runAsync({ body: { workspaceId, items: deleteItems } }),
    ]);

    if (addItems.length || deleteItems.length) {
      toast({ title: "Permissions updated" });
    }

    // Close first, to prevent a refetch of resolved permissions in this
    // session/modal Assuming once the user saves, we're already done with
    // permission updates.
    onClose();

    // Forces a refetch of resolved permissions. Resolved permission params are
    // quite complex so it's easier just to clear out and refetch.
    clearOutResolvedPermissionFetchStore();
  };

  const renderPermissionGroupList = (items: PermissionGroup[]) => {
    return (
      <TargetGrantPermissionFormEntityList
        key={targetType}
        workspaceId={workspaceId}
        entities={items}
        targetId={targetId}
        targetType={targetType}
        disabled={loading}
        defaultUpdatedPermissions={targetPermissions.updated}
        getInfoFromItem={(item) => ({ name: item.name })}
        onChange={handleTargetPermissionsOnChange}
      />
    );
  };

  const renderAgentTokenList = (items: AgentToken[]) => {
    return (
      <TargetGrantPermissionFormEntityList
        key={targetType}
        workspaceId={workspaceId}
        entities={items}
        targetId={targetId}
        targetType={targetType}
        disabled={loading}
        defaultUpdatedPermissions={targetPermissions.updated}
        getInfoFromItem={(item) => ({ name: item.name ?? item.resourceId })}
        onChange={handleTargetPermissionsOnChange}
      />
    );
  };

  const renderCollaboratorList = (items: Collaborator[]) => {
    return (
      <TargetGrantPermissionFormEntityList
        key={targetType}
        workspaceId={workspaceId}
        entities={items}
        targetId={targetId}
        targetType={targetType}
        disabled={loading}
        defaultUpdatedPermissions={targetPermissions.updated}
        getInfoFromItem={(item) => ({
          name: item.firstName + " " + item.lastName,
        })}
        onChange={handleTargetPermissionsOnChange}
      />
    );
  };

  const tabsNode = (
    <Tabs defaultValue={activeKey} className="w-full">
      <TabsList>
        <TabsTrigger
          value={TabKey.PermissionGroup}
          key={TabKey.PermissionGroup}
        >
          Permission Group
        </TabsTrigger>
        <TabsTrigger value={TabKey.Collaborator} key={TabKey.Collaborator}>
          Collaborator
        </TabsTrigger>
        <TabsTrigger value={TabKey.AgentToken} key={TabKey.AgentToken}>
          Agent Token
        </TabsTrigger>
      </TabsList>
      <TabsContent value={TabKey.PermissionGroup}>
        <PermissionGroupListContainer
          workspaceId={workspaceId}
          renderList={renderPermissionGroupList}
        />
      </TabsContent>
      <TabsContent value={TabKey.Collaborator}>
        <CollaboratorListContainer
          workspaceId={workspaceId}
          renderList={renderCollaboratorList}
        />
      </TabsContent>
      <TabsContent value={TabKey.AgentToken}>
        <AgentTokenListContainer
          workspaceId={workspaceId}
          renderList={renderAgentTokenList}
        />
      </TabsContent>
    </Tabs>
  );

  const errorNode = error.length ? <FormAlertList error={error} /> : null;

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetTitle>Update Permissions</SheetTitle>
      <SheetContent className="w-full sm:w-[500px]">
        <div className="pt-6 w-full space-y-8">
          {errorNode}
          {tabsNode}
          <div>
            <Button loading={loading} onClick={() => handleOnSave()}>
              Save Permissions
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

function getAddedAndDeletedTargetIdPermissions(
  targetId: string,
  targetIdPermissions: TargetIdPermissions
) {
  const { original, updated } = targetIdPermissions;
  const addItems: Array<PermissionItemInput> = [];
  const deleteItems: Array<DeletePermissionItemInput> = [];

  forEach(updated, (updatedPermitted, key) => {
    const [entityId, action] = splitKey(key);
    const originalPermitted = original[key];

    // Target ID permitted is always boolean
    if (!isBoolean(updatedPermitted?.access)) return;

    // No need to update if permission is same and access entity is same as
    // entity
    if (
      originalPermitted &&
      originalPermitted.access === updatedPermitted.access &&
      originalPermitted.entityId === entityId
    )
      return;

    deleteItems.push({
      entityId,
      action: action as FimidaraPermissionAction,
      target: { targetId },

      // Delete opposite of permission
      access: !updatedPermitted.access,
    });
    addItems.push({
      entityId,
      action: action as FimidaraPermissionAction,
      target: { targetId },
      access: updatedPermitted.access,
    });
  });

  return { addItems, deleteItems };
}

function getAddedAndDeletedPermissions(
  targetId: string,
  targetIdPermissions: TargetIdPermissions
) {
  const { addItems, deleteItems } = getAddedAndDeletedTargetIdPermissions(
    targetId,
    targetIdPermissions
  );

  return { addItems, deleteItems };
}

export default TargetGrantPermissionForm;
