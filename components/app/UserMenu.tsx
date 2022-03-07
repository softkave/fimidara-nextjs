import { CaretDownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Space } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { appRootPaths, appUserPaths } from "../../lib/definitions/system";
import SessionActions from "../../lib/store/session/actions";
import SessionSelectors from "../../lib/store/session/selectors";
import UserAvatar from "./user/UserAvatar";

const LOGOUT_MENU_KEY = "logout";

export default function UserMenu() {
  const userId = useSelector(SessionSelectors.assertGetUserId);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <Dropdown
      trigger={["click"]}
      overlay={
        <Menu
          onSelect={async (info) => {
            if (info.key === LOGOUT_MENU_KEY) {
              // TODO: delete all cache keys
              router.push(appRootPaths.home);
              dispatch(SessionActions.logoutUser());
            }
          }}
          style={{ minWidth: "150px" }}
        >
          <Menu.Item key={appUserPaths.settings}>
            <Link href={appUserPaths.settings}>Settings</Link>
          </Menu.Item>
          <Menu.Divider key={"divider-01"} />
          <Menu.Item key={LOGOUT_MENU_KEY}>Logout</Menu.Item>
        </Menu>
      }
    >
      <Button
        style={{
          padding: 0,
          border: "none",
          boxShadow: "none",
        }}
      >
        <Space size={"small"}>
          <UserAvatar userId={userId} alt="Your profile picture" />
          <CaretDownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
