import { isNull, isUndefined } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import UserSessionStorageFns from "../storage/userSession";
import SessionSelectors from "../store/session/selectors";

/**
 * @returns {boolean | undefined} - `undefined` means a decision is not yet made
 * so maybe return `null` if relying on value for rendering, `true` means user
 * is logged in, and `false` means user is not logged in
 */
export function useUserLoggedIn() {
  const tokenFromStore = useSelector(SessionSelectors.getUserToken);
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    isUndefined(tokenFromStore) || isNull(tokenFromStore) ? undefined : true
  );
  React.useEffect(() => {
    if (isUndefined(isLoggedIn)) {
      const tokenFromLocalStorage = UserSessionStorageFns.getUserToken();
      setIsLoggedIn(!!tokenFromLocalStorage);
    }
  }, [isLoggedIn]);

  return isLoggedIn;
}
