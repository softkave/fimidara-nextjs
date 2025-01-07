import { DropdownItems } from "@/components/ui/dropdown-items.tsx";
import IconButton from "@/components/utils/buttons/IconButton";
import { insertMenuDivider } from "@/components/utils/utils";
import { Ellipsis } from "lucide-react";
import React from "react";
import useTargetGrantPermissionModal from "../../../hooks/useTargetGrantPermissionModal";

export interface IRootFilesMenuProps {
  workspaceId: string;
}

enum MenuKeys {
  Permissions = "permissions",
}

const RootFilesMenu: React.FC<IRootFilesMenuProps> = (props) => {
  const { workspaceId } = props;
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId,
    targetId: workspaceId,
    targetType: "workspace",
  });

  const onSelectMenuItem = (key: string) => {
    if (key === MenuKeys.Permissions) {
      permissionsHook.toggle();
    }
  };

  const items = insertMenuDivider([
    {
      key: MenuKeys.Permissions,
      label: "Permissions",
    },
  ]);

  return (
    <React.Fragment>
      <DropdownItems items={items} onSelect={onSelectMenuItem}>
        <IconButton icon={<Ellipsis className="w-4 h-4" />} />
      </DropdownItems>
      {permissionsHook.node}
    </React.Fragment>
  );
};

export default RootFilesMenu;
