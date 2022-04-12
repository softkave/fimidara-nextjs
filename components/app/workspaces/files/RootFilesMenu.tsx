import { Button, Dropdown, Menu } from "antd";
import React from "react";
import { AppResourceType } from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";
import { BsThreeDots } from "react-icons/bs";
import useGrantPermission from "../../../hooks/useGrantPermission";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";

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
    itemResourceType: AppResourceType.Folder,
    permissionOwnerId: workspaceId,
    permissionOwnerType: AppResourceType.Workspace,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const childrenFilesGrantPermission = useGrantPermission({
    workspaceId,
    itemResourceType: AppResourceType.File,
    permissionOwnerId: workspaceId,
    permissionOwnerType: AppResourceType.Workspace,
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

  return (
    <React.Fragment>
      <Dropdown
        trigger={["click"]}
        overlay={
          <Menu onClick={onSelectMenuItem} style={{ minWidth: "150px" }}>
            <Menu.Item key={MenuKeys.ChildrenFoldersGrantPermission}>
              Grant Permission To Children Folders
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.ChildrenFilesGrantPermission}>
              Grant Permission to Children Files
            </Menu.Item>
          </Menu>
        }
      >
        <Button
          // type="text"
          className={appClasses.iconBtn}
          icon={<BsThreeDots />}
        ></Button>
      </Dropdown>
      {childrenFoldersGrantPermission.grantPermissionFormNode}
      {childrenFilesGrantPermission.grantPermissionFormNode}
    </React.Fragment>
  );
};

export default RootFilesMenu;
