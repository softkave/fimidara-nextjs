import useTargetGrantPermissionModal from "@/components/hooks/useTargetGrantPermissionModal";
import IconButton from "@/components/utils/buttons/IconButton";
import { appClasses } from "@/components/utils/theme";
import { MenuInfo } from "@/components/utils/types";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { Dropdown, MenuProps } from "antd";
import { FimidaraResourceType } from "fimidara";
import React from "react";
import { BsThreeDots } from "react-icons/bs";

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

  const onSelectMenuItem = (info: MenuInfo) => {
    if (info.key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    }
  };

  const items: MenuProps["items"] = insertAntdMenuDivider([
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
  ]);

  return (
    <React.Fragment>
      {permissionsHook.node}
      <Dropdown
        trigger={["click"]}
        menu={{
          items,
          style: { minWidth: "150px" },
          onClick: onSelectMenuItem,
        }}
        placement="bottomRight"
      >
        <IconButton className={appClasses.iconBtn} icon={<BsThreeDots />} />
      </Dropdown>
    </React.Fragment>
  );
};

export default WorkspaceResourceListMenu;
