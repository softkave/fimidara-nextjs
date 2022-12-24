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
  const tokenFromRedux = useSelector(SessionSelectors.getUserToken);
  const [tokenFromLocalStorage, setTokenFromLocalStorage] = React.useState<
    string | null | undefined
  >(null);

  const token = tokenFromRedux || tokenFromLocalStorage;
  const isLoggedIn = React.useMemo(
    () => (isUndefined(token) || isNull(token) ? false : true),
    [token]
  );

  React.useEffect(() => {
    const tokenFromLocalStorage = UserSessionStorageFns.getUserToken();
    setTokenFromLocalStorage(tokenFromLocalStorage);
  }, [isLoggedIn]);

  return isLoggedIn;
}
