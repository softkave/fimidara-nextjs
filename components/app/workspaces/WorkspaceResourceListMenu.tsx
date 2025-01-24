import useTargetGrantPermissionModal from "@/components/hooks/useTargetGrantPermissionModal";
import { DropdownItems } from "@/components/ui/dropdown-items.tsx";
import IconButton from "@/components/utils/buttons/IconButton";
import { insertMenuDivider } from "@/components/utils/utils";
import { FimidaraResourceType } from "fimidara";
import { Ellipsis } from "lucide-react";
import React from "react";

export interface WorkspaceResourceListMenuProps {
  workspaceId: string;
  targetType: FimidaraResourceType;
}

enum MenuKeys {
  GrantPermission = "grant-permission",
}

const WorkspaceResourceListMenu: React.FC<WorkspaceResourceListMenuProps> = (
  props
) => {
  const { workspaceId, targetType } = props;
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId,
    targetType,
    targetId: workspaceId,
  });

  const onSelectMenuItem = (key: string) => {
    if (key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    }
  };

  const items = insertMenuDivider([
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
  ]);

  return (
    <React.Fragment>
      {permissionsHook.node}
      <DropdownItems items={items} onSelect={onSelectMenuItem}>
        <IconButton icon={<Ellipsis className="w-4 h-4" />} />
      </DropdownItems>
    </React.Fragment>
  );
};

export default WorkspaceResourceListMenu;
