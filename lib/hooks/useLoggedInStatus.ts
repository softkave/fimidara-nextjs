import { useRequest } from "ahooks";
import { message } from "antd";
import { first } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import UserAPI from "../api/endpoints/user";
import { appWorkspacePaths, appRootPaths } from "../definitions/system";
import UserSessionStorageFns from "../storage/userSession";
import SessionActions from "../store/session/actions";
import SessionSelectors from "../store/session/selectors";
import { getBaseError } from "../utilities/errors";

function cleanupLoginArtifacts(error: any) {
  const msg = getBaseError(error) || "Error logging in";
  message.warning(msg);
  UserSessionStorageFns.deleteUserToken();
  UserSessionStorageFns.deleteClientAssignedToken();
}

export default function useLoggedInStatus() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isSignedIn = useSelector(SessionSelectors.isUserSignedIn);
  const [isReady, setReadyState] = React.useState(false);
  const signInWithToken = React.useCallback(async () => {
    try {
      const token = UserSessionStorageFns.getUserToken();

      if (token) {
        const result = await UserAPI.getUserData({ token });

        if (result.errors) {
          cleanupLoginArtifacts(result.errors);
        } else {
          UserSessionStorageFns.saveUserToken(result.token);
          UserSessionStorageFns.saveClientAssignedToken(
            result.clientAssignedToken
          );

          dispatch(
            SessionActions.loginUser({
              userToken: result.token,
              userId: result.user.resourceId,
              clientAssignedToken: result.clientAssignedToken,
            })
          );

          if (first(window.location.pathname.split("/")) !== appRootPaths.app) {
            router.push(appWorkspacePaths.workspaces);
          }

          setReadyState(true);
          return;
        }
      }

      router.push(appRootPaths.home);
    } catch (error) {
      cleanupLoginArtifacts(error);
    }
  }, []);

  const signinHelper = useRequest(signInWithToken, { manual: true });

  React.useEffect(() => {
    if (!isSignedIn && !isReady) {
      signinHelper.run();
    }
  }, [isSignedIn, isReady]);

  return {
    isReady,
  };
}
