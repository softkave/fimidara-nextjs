import { message } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import UserAPI from "../api/endpoints/user";
import { appOrgPaths } from "../definitions/system";
import UserSessionStorageFns from "../storage/userSession";
import SessionActions from "../store/session/actions";
import SessionSelectors from "../store/session/selectors";
import { getBaseError } from "../utilities/error";

export default function useLoggedInStatus() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isSignedIn = useSelector(SessionSelectors.isUserSignedIn);
  const signInWithToken = React.useCallback(async () => {
    const token = UserSessionStorageFns.getUserToken();

    if (token) {
      const result = await UserAPI.getUserData({ token });

      if (result.errors) {
        message.warning(getBaseError(result.errors) || "Error logging in");
        UserSessionStorageFns.deleteUserToken();
      } else {
        UserSessionStorageFns.saveUserToken(result.token);
        dispatch(
          SessionActions.loginUser({
            token: result.token,
            userId: result.user.resourceId,
          })
        );

        router.push(appOrgPaths.orgs);
      }
    }
  }, []);

  React.useEffect(() => {
    if (!isSignedIn) {
      signInWithToken();
    }
  }, [isSignedIn, signInWithToken]);
}
