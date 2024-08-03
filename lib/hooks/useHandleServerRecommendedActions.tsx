"use client";

import { message, notification } from "antd";
import { usePathname } from "next/navigation";
import { isFimidaraEndpointError } from "../api/localUtils";
import { appAccountPaths } from "../definitions/system";
import { AnyFn } from "../utils/types";
import { useRequestLogout } from "./session/useRequestLogout.ts";

const kTimeout = 3000; // 3 seconds
const kMessageDuration = 10; // seconds

export function useHandleRequiresPasswordChange() {
  const { requestLogout } = useRequestLogout();

  const handleRequiresPasswordChange = () => {
    const closeMessageFn: AnyFn = message.loading({
      type: "loading",
      content: "An error occurred, logging you out...",
      duration: 0,
    });

    setTimeout(() => {
      closeMessageFn();
      notification.error({
        message: "Logged Out",
        description:
          "An error occurred involving your session. " +
          "Because your account requires a password change, " +
          "we're going to log you out and route you to the change password page. " +
          "Please change your password to continue, thank you",
        duration: kMessageDuration,
      });
      requestLogout(appAccountPaths.forgotPassword);
    }, kTimeout);
  };

  return { handleRequiresPasswordChange };
}

export function useHandleLoginAgain() {
  const { requestLogout } = useRequestLogout();
  const pathname = usePathname();

  const handleLoginAgain = () => {
    let closeMessageFn: AnyFn = message.loading({
      type: "loading",
      content: "An error occurred, logging you out...",
      duration: 0,
    });

    setTimeout(() => {
      closeMessageFn();

      /**
       * TODO:
       * Warning: [antd: message] Static function can not consume context like
       * dynamic theme. Please use 'App' component instead.
       */
      notification.error({
        message: "Logged Out",
        description:
          "An error occurred involving your session, please login again, thank you",
        duration: kMessageDuration,
      });
      requestLogout(appAccountPaths.loginWithReturnPath(pathname));
    }, kTimeout);
  };

  return { handleLoginAgain };
}

export function useHandleServerRecommendedActions() {
  const { handleRequiresPasswordChange } = useHandleRequiresPasswordChange();
  const { handleLoginAgain } = useHandleLoginAgain();

  const handleServerRecommendedActions = (error: unknown) => {
    if (!isFimidaraEndpointError(error)) return;

    const actions = error.errors.map((e) => e.action);
    const hasLogout = actions.includes("logout");
    const hasLoginAgain = actions.includes("loginAgain");
    const hasRequestPasswordChange = actions.includes("requestChangePassword");

    if (hasLogout || hasLoginAgain) {
      handleLoginAgain();
    } else if (hasRequestPasswordChange) {
      handleRequiresPasswordChange();
    }
  };

  return { handleServerRecommendedActions };
}
