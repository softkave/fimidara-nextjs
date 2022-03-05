import { Divider } from "antd";
import React from "react";
import UserProfile from "../../../components/app/user/UserProfile";
import ChangeUserPassword from "../../../components/app/user/ChangeUserPassword";
import UploadUserAvatar from "../../../components/app/user/UploadUserAvatar";

export interface IUserSettingsProps {}

export default function UserSettings(props: IUserSettingsProps) {
  return (
    <div>
      <UploadUserAvatar />
      <Divider>Details</Divider>
      <UserProfile />
      <Divider>Password</Divider>
      <ChangeUserPassword />
    </div>
  );
}
