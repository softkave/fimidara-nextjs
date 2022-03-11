import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import UserAPI, { UserURLs } from "../api/endpoints/user";
import { checkEndpointResult } from "../api/utils";
import UserSessionStorageFns from "../storage/userSession";
import SessionActions from "../store/session/actions";
import SessionSelectors from "../store/session/selectors";

const fetcher = async (p: string, dispatch: Dispatch, token?: string) => {
  token = token || (UserSessionStorageFns.getUserToken() as string | undefined);

  if (!token) {
    throw new Error("Please sign in");
  }

  const result = await UserAPI.getUserData({ token });
  checkEndpointResult(result);
  UserSessionStorageFns.saveUserTokenIfExists(result.token);
  UserSessionStorageFns.saveClientAssignedTokenIfExists(
    result.clientAssignedToken
  );

  dispatch(
    SessionActions.loginUser({
      userToken: result.token,
      userId: result.user.resourceId,
      clientAssignedToken: result.clientAssignedToken,
    })
  );

  return result;
};

export function getUseUserHookKey() {
  return [UserURLs.getUserData];
}

export default function useUser() {
  const dispatch = useDispatch();
  const token = useSelector(SessionSelectors.getUserToken);
  const { data, error, mutate } = useSWR(
    [getUseUserHookKey(), dispatch, token],
    fetcher
  );

  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
