import IconButton from "@/components/utils/buttons/IconButton";
import { appClasses } from "@/components/utils/theme";
import { MenuInfo } from "@/components/utils/types";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { Dropdown, MenuProps } from "antd";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
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
    forTargetTypeOnly: ["file", "folder"],
  });

  const onSelectMenuItem = (info: MenuInfo) => {
    if (info.key === MenuKeys.Permissions) {
      permissionsHook.toggle();
    }
  };

  const items: MenuProps["items"] = insertAntdMenuDivider([
    {
      key: MenuKeys.Permissions,
      label: "Permissions",
    },
  ]);

  return (
    <React.Fragment>
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
      {permissionsHook.node}
    </React.Fragment>
  );
};

export default RootFilesMenu;
