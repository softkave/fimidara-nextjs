import { Button, Dropdown, Menu } from "antd";
import React from "react";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";
import { BsThreeDots } from "react-icons/bs";
import useGrantPermission, {
  GrantPermissionKey,
  IUseGrantPermissionProps,
} from "../../../hooks/useGrantPermission";

const GrantPermissionMenu: React.FC<IUseGrantPermissionProps> = (props) => {
  const { toggleVisibility, grantPermissionFormNode } =
    useGrantPermission(props);

  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
      if (info.key === GrantPermissionKey.GrantPermission) {
        toggleVisibility();
      }
    },
    [toggleVisibility]
  );

  return (
    <React.Fragment>
      {grantPermissionFormNode}
      <Dropdown
        trigger={["click"]}
        overlay={
          <Menu onClick={onSelectMenuItem} style={{ minWidth: "150px" }}>
            <Menu.Item key={GrantPermissionKey.GrantPermission}>
              Grant Permission
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
    </React.Fragment>
  );
};

export default GrantPermissionMenu;