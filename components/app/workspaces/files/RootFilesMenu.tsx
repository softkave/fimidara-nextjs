import { PermissionItemAppliesTo } from "@/lib/definitions/permissionItem";
import { AppResourceType } from "@/lib/definitions/system";
import { Dropdown, MenuProps } from "antd";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useGrantPermission from "../../../hooks/useGrantPermission";
import IconButton from "../../../utils/buttons/IconButton";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";

export interface IRootFilesMenuProps {
  workspaceId: string;
}

enum MenuKeys {
  ChildrenFoldersGrantPermission = "chilldren-folders-grant-permission",
  ChildrenFilesGrantPermission = "children-files-grant-permission",
}

const RootFilesMenu: React.FC<IRootFilesMenuProps> = (props) => {
  const { workspaceId } = props;
  const childrenFoldersGrantPermission = useGrantPermission({
    workspaceId,
    targetType: AppResourceType.Folder,
    containerId: workspaceId,
    containerType: AppResourceType.Workspace,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const childrenFilesGrantPermission = useGrantPermission({
    workspaceId,
    targetType: AppResourceType.File,
    containerId: workspaceId,
    containerType: AppResourceType.Workspace,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
      if (info.key === MenuKeys.ChildrenFoldersGrantPermission) {
        childrenFoldersGrantPermission.toggleVisibility();
      } else if (info.key === MenuKeys.ChildrenFilesGrantPermission) {
        childrenFilesGrantPermission.toggleVisibility();
      }
    },
    [childrenFilesGrantPermission, childrenFoldersGrantPermission]
  );

  const items: MenuProps["items"] = [
    {
      key: MenuKeys.ChildrenFilesGrantPermission,
      label: "Children File Permissions",
    },
    {
      key: MenuKeys.ChildrenFoldersGrantPermission,
      label: "Children Folder Permissions",
    },
  ];

  return (
    <React.Fragment>
      <Dropdown
        trigger={["click"]}
        menu={{
          items,
          style: { minWidth: "150px" },
          onClick: onSelectMenuItem,
        }}
      >
        <IconButton className={appClasses.iconBtn} icon={<BsThreeDots />} />
      </Dropdown>
      {childrenFoldersGrantPermission.grantPermissionFormNode}
      {childrenFilesGrantPermission.grantPermissionFormNode}
    </React.Fragment>
  );
};

export default RootFilesMenu;
