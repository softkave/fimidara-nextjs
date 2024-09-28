import { LoginResult } from "@/lib/api-internal/endpoints/privateTypes.ts";
import UserSessionStorageFns from "@/lib/storage/userSession.ts";
import { useUserSessionFetchStore } from "../fetchStores/session.ts";
import { useUsersStore } from "../resourceListStores.ts";

export function updateUserSessionWhenResultIsLoginResult(result: LoginResult) {
  const { user, clientAssignedToken, token } = result;

  // Persist user token to local storage if it's already there. If it's there,
  // it means during the user's last login, the user opted-in to "remember me".
  if (UserSessionStorageFns.getUserToken()) {
    UserSessionStorageFns.saveUserToken(token);
    UserSessionStorageFns.saveClientAssignedToken(clientAssignedToken);
  }

  const states = [...useUserSessionFetchStore.getState().states];
  useUsersStore.getState().set(user.resourceId, user);

  if (states[0]) {
    const [params] = states[0];
    states[0] = [
      params,
      {
        error: undefined,
        loading: false,
        data: {
          id: user.resourceId,
          other: { clientToken: clientAssignedToken, userToken: token },
        },
      },
    ];
  } else {
    states.push([
      // anything is allowed really because `useUserSessionFetchStore`'s
      // `comparisonFn` returns true always making there be only one session in
      // store.
      {},
      {
        loading: false,
        error: undefined,
        data: {
          id: user.resourceId,
          other: { clientToken: clientAssignedToken, userToken: token },
        },
      },
    ]);
  }

  useUserSessionFetchStore.setState({ states });
}
