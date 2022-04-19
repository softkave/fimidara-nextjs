import { Divider, Space } from "antd";
import React from "react";
import UserProfile from "../../../components/app/user/UserProfile";
import ChangeUserPassword from "../../../components/app/user/ChangeUserPassword";
import UploadUserAvatar from "../../../components/app/user/UploadUserAvatar";
import AppHeader from "../../../components/app/AppHeader";
import withPageAuthRequired from "../../../components/hoc/withPageAuthRequired";
import EmailVerification from "../../../components/app/user/EmailVerification";

function UserSettings() {
  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <AppHeader />
      <Divider orientation="left">Profile picture</Divider>
      <UploadUserAvatar />
      <Divider orientation="left">Email Verification</Divider>
      <EmailVerification />
      <Divider orientation="left">Profile</Divider>
      <UserProfile />
      <Divider orientation="left">Password</Divider>
      <ChangeUserPassword />
    </Space>
  );
}

export default withPageAuthRequired(UserSettings);
