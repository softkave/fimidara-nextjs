import { notification } from "antd";
import { FimidaraEndpointError } from "fimidara";
import { useUserLogout } from "./useUserLoggedIn";

export function useHandleRequiresPasswordChange() {
  const { logout } = useUserLogout();

  const handleRequiresPasswordChange = () => {
    logout();
    notification.error({
      message:
        "An error occurred involving your session, because your account requires a password change. " +
        "Please change your password to continue, thank you.",
    });
  };

  return { handleRequiresPasswordChange };
}

export function useHandleServerRecommendedActions() {
  const { logout } = useUserLogout();
  const { handleRequiresPasswordChange } = useHandleRequiresPasswordChange();

  const handleServerRecommendedActions = (error: unknown) => {
    if (!isFimidaraEndpointError(error)) return;

    const actions = error.errors.map((e) => e.action);
    const hasLogout = actions.includes("logout");
    const hasLoginAgain = actions.includes("loginAgain");
    const hasRequestPasswordChange = actions.includes("requestChangePassword");

    if (hasLogout || hasLoginAgain) {
      logout();
      notification.error({
        message:
          "An error occurred involving your session, please login again, thank you.",
      });
    } else if (hasRequestPasswordChange) {
      handleRequiresPasswordChange();
    }
  };

  return { handleServerRecommendedActions };
}

function isFimidaraEndpointError(
  error: unknown
): error is FimidaraEndpointError {
  //  The second check is for private endpoints where though the error name is
  //  the same, instanceof will not return true since they are technically two
  //  different classes.
  return (
    error instanceof FimidaraEndpointError ||
    (error as any)?.name === FimidaraEndpointError.name
  );
}
