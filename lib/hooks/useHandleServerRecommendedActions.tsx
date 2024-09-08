"use client";

import { useToast } from "@/hooks/use-toast.ts";
import { usePathname } from "next/navigation";
import { isFimidaraEndpointError } from "../api/localUtils";
import { appAccountPaths } from "../definitions/system";
import { useRequestLogout } from "./session/useRequestLogout.ts";

const kTimeout = 3_000; // 3 seconds
const kMessageDuration = 10_000; // seconds

export function useHandleRequiresPasswordChange() {
  const { toast } = useToast();
  const { requestLogout } = useRequestLogout();

  const handleRequiresPasswordChange = () => {
    setTimeout(() => {
      toast({
        title: "Logged Out",
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
  const { toast } = useToast();
  const { requestLogout } = useRequestLogout();
  const pathname = usePathname();

  const handleLoginAgain = () => {
    setTimeout(() => {
      toast({
        title: "Logged Out",
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
