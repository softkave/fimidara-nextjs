"use client";

import styles from "@/components/utils/form/form.module.css";
import { useUserSendEmailVerificationCodeMutationHook } from "@/lib/hooks/mutationHooks";
import { Button, message, Space } from "antd";
import Text from "antd/es/typography/Text";
import { LoginResult } from "fimidara";
import React from "react";
import useCooldown from "../../hooks/useCooldown";
import { errorMessageNotificatition } from "../../utils/errorHandling";

export interface EmailVerificationProps {
  session: LoginResult;
}

export default function EmailVerification(props: EmailVerificationProps) {
  const { session } = props;
  const cooldown = useCooldown();
  const sendEmailVerificationHook =
    useUserSendEmailVerificationCodeMutationHook({
      onError(e, params) {
        errorMessageNotificatition(e);
      },
      onSuccess(data, params) {
        message.success(
          `Email verification link sent to ${session.user.email}`
        );
        cooldown.startCooldown();
      },
    });
  let rootNode: React.ReactNode = null;

  if (session.user.isEmailVerified) {
    rootNode = <Text type="success">Your email address is verified.</Text>;
  } else {
    rootNode = (
      <Space direction="vertical">
        <Text type="danger">Your email address is not verified.</Text>
        <Button
          onClick={() => sendEmailVerificationHook.run()}
          loading={sendEmailVerificationHook.loading}
          disabled={cooldown.isInCooldown}
        >
          Send Email Verification Link to {session.user.email}
        </Button>
      </Space>
    );
  }

  return (
    <div className={styles.formBody}>
      <div className={styles.formContentWrapper}>{rootNode}</div>
    </div>
  );
}
