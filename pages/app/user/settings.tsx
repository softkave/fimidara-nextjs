import { Divider } from "antd";
import React from "react";
import UserProfile from "../../../components/app/user/UserProfile";
import ChangeUserPassword from "../../../components/app/user/ChangeUserPassword";

export interface IUserSettingsProps {}

export default function UserSettings(props: IUserSettingsProps) {
  return (
    <div>
      <UserProfile />
      <Divider />
      <ChangeUserPassword />
    </div>
  );
}
