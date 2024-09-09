"use client";

import { Button } from "@/components/ui/button.tsx";
import styles from "@/components/utils/form/form.module.css";
import { useToast } from "@/hooks/use-toast.ts";
import { useUserSendEmailVerificationCodeMutationHook } from "@/lib/hooks/mutationHooks";
import { LoginResult } from "fimidara";
import React from "react";
import useCooldown from "../../hooks/useCooldown";
import { errorMessageNotificatition } from "../../utils/errorHandling";

export interface EmailVerificationProps {
  session: LoginResult;
}

export default function EmailVerification(props: EmailVerificationProps) {
  const { session } = props;
  const { toast } = useToast();
  const cooldown = useCooldown();
  const sendEmailVerificationHook =
    useUserSendEmailVerificationCodeMutationHook({
      onError(error, params) {
        errorMessageNotificatition(
          error,
          /** defaultMessage */ undefined,
          toast
        );
      },
      onSuccess(data, params) {
        toast({
          description: `Email verification link sent to ${session.user.email}`,
        });
        cooldown.startCooldown();
      },
    });
  let rootNode: React.ReactNode = null;

  if (session.user.isEmailVerified) {
    rootNode = (
      <span className="text-green-600">Your email address is verified.</span>
    );
  } else {
    rootNode = (
      <div className="space-y-4">
        <span className="text-red-600">
          Your email address is not verified.
        </span>
        <Button
          type="button"
          onClick={() => sendEmailVerificationHook.run()}
          loading={sendEmailVerificationHook.loading}
          disabled={cooldown.isInCooldown}
        >
          Send Email Verification Link to {session.user.email}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.formBody}>
      <div className={styles.formContentWrapper}>{rootNode}</div>
    </div>
  );
}
