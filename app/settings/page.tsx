"use client";

import ChangePasswordWithCurrentPassword from "@/components/app/user/ChangePasswordWithCurrentPassword.tsx";
import EmailVerification from "@/components/app/user/EmailVerification.tsx";
import UploadUserAvatar from "@/components/app/user/UploadUserAvatar.tsx";
import UserContainer from "@/components/app/user/UserContainer.tsx";
import UserProfile from "@/components/app/user/UserProfile.tsx";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import { Divider, Space } from "antd";

function UserSettings() {
  return usePageAuthRequired({
    render: () => (
      <UserContainer
        render={(session) => (
          <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
            <UploadUserAvatar />
            <Divider orientation="left">Email Verification</Divider>
            <EmailVerification session={session} />
            <Divider orientation="left">Profile</Divider>
            <UserProfile session={session} />
            <Divider orientation="left">Password</Divider>
            <ChangePasswordWithCurrentPassword />
          </Space>
        )}
      />
    ),
  });
}

export default UserSettings;
