import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import UserAPI, { UserURLs } from "../api/endpoints/user";
import { checkEndpointResult } from "../api/utils";
import UserSessionStorageFns from "../storage/userSession";
import SessionActions from "../store/session/actions";

const fetcher = async (p: string, dispatch: Dispatch) => {
  const result = await UserAPI.getUserData();
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
  const { data, error } = useSWR([getUseUserHookKey(), dispatch], fetcher);

  return {
    error,
    data,
    isLoading: !error && !data,
  };
}
