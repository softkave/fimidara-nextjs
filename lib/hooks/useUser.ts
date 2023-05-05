import { Dispatch } from "@reduxjs/toolkit";
import { LoginResult } from "fimidara";
import { useDispatch, useSelector } from "react-redux";
import useSWR, { SWRConfiguration } from "swr";
import UserAPI, { UserURLs } from "../api/endpoints/user";
import { checkEndpointResult } from "../api/utils";
import UserSessionStorageFns from "../storage/userSession";
import SessionActions from "../store/session/actions";
import SessionSelectors from "../store/session/selectors";
import { swrDefaultConfig } from "./config";

export function saveUserTokenLocal(
  dispatch: Dispatch,
  userId: string,
  token: string,
  clientAssignedToken: string
) {
  UserSessionStorageFns.saveUserTokenIfExists(token);
  UserSessionStorageFns.saveClientAssignedTokenIfExists(clientAssignedToken);
  dispatch(
    SessionActions.loginUser({
      userId,
      userToken: token,
      clientAssignedToken: clientAssignedToken,
    })
  );
}

const fetcher = async (p: string, dispatch: Dispatch, token?: string) => {
  token = token || (UserSessionStorageFns.getUserToken() as string | undefined);
  if (!token) {
    throw new Error("Please sign in");
  }

  const result = await UserAPI.getUserData({ token });
  checkEndpointResult(result);
  saveUserTokenLocal(
    dispatch,
    result.user.resourceId,
    result.token,
    result.clientAssignedToken
  );
  return result;
};

export function getUseUserHookKey(dispatch: Dispatch, token?: string) {
  return [UserURLs.getUserData, dispatch, token];
}

export default function useUser(swrConfig: SWRConfiguration = {}) {
  const dispatch = useDispatch();
  const token = useSelector(SessionSelectors.getUserToken);
  const { data, error, mutate } = useSWR<LoginResult>(
    getUseUserHookKey(dispatch, token),
    fetcher,
    { ...swrDefaultConfig, ...swrConfig }
  );

  return {
    error,
    data,
    mutate,
    isLoading: !error && !data,
  };
}
