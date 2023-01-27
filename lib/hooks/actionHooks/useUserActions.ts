import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { appRootPaths } from "../../definitions/system";
import UserSessionStorageFns from "../../storage/userSession";
import SessionActions from "../../store/session/actions";

export interface IUserActions {
  logout: () => Promise<void>;
}

export function useUserActions(): IUserActions {
  const dispatch = useDispatch();
  const router = useRouter();
  const logout = async () => {
    // TODO: delete all cache keys
    router.push(appRootPaths.home);
    UserSessionStorageFns.clearSessionData();
    dispatch(SessionActions.logoutUser());
  };

  return { logout };
}
