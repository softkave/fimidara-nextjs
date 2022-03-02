import { CaretDownOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Space } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSWRConfig } from "swr";
import { useDispatch, useSelector } from "react-redux";
import { getUserImagePath } from "../../lib/api/endpoints/file";
import { appRootPaths, appUserPaths } from "../../lib/definitions/system";
import SessionActions from "../../lib/store/session/actions";
import SessionSelectors from "../../lib/store/session/selectors";
import { appDimensions } from "../utils/theme";

const LOGOUT_MENU_KEY = "logout";

export default function UserMenu() {
  const userId = useSelector(SessionSelectors.assertGetUserId);
  const dispatch = useDispatch();
  const router = useRouter();
  const { cache } = useSWRConfig();

  return (
    <Dropdown
      overlay={
        <Menu
          onSelect={async (info) => {
            if (info.key === LOGOUT_MENU_KEY) {
              // TODO: delete all cache keys
              router.push(appRootPaths.home);
              dispatch(SessionActions.logoutUser());
            }
          }}
        >
          <Menu.Item key={appUserPaths.settings}>
            <Link href={appUserPaths.settings}>Settings</Link>
          </Menu.Item>
          <Menu.Divider key={"divider-01"} />
          <Menu.Item key={LOGOUT_MENU_KEY}>Logout</Menu.Item>
        </Menu>
      }
    >
      <Space size={"middle"}>
        <Avatar
          icon={<UserOutlined />}
          src={getUserImagePath(
            userId,
            appDimensions.avatar.width,
            appDimensions.avatar.height
          )}
          size="large"
          alt={"Your profile picture"}
          shape="circle"
        />
        <CaretDownOutlined />
      </Space>
    </Dropdown>
  );
}
