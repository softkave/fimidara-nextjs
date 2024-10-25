import { LoginResult } from "@/lib/api-internal/endpoints/privateTypes.ts";
import { RefreshUserToken } from "@/lib/api-internal/RefreshUserToken.ts";
import { getPrivateFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints.ts";
import { kUserSessionStorageFns } from "@/lib/storage/UserSessionStorageFns.ts";
import { useUserSessionFetchStore } from "../fetchStores/session.ts";
import { useUsersStore } from "../resourceListStores.ts";

export function updateUserSessionWhenResultIsLoginResult(result: LoginResult) {
  const { user, clientJwtToken, jwtToken, jwtTokenExpiresAt, refreshToken } =
    result;

  // Persist user token to local storage if it's already there. If it's there,
  // it means during the user's last login, the user opted-in to "remember me".
  if (kUserSessionStorageFns.getData().jwtToken) {
    kUserSessionStorageFns.setData({
      clientJwtToken,
      jwtToken,
      jwtTokenExpiresAt,
      refreshToken,
    });
  }

  const states = [...useUserSessionFetchStore.getState().states];
  useUsersStore.getState().set(user.resourceId, user);

  if (states[0]) {
    const [existingParams, existingState] = states[0];

    if (existingState.data?.other?.refresh) {
      existingState.data.other.refresh.stop();
    }

    states[0] = [
      existingParams,
      {
        error: undefined,
        loading: false,
        data: {
          id: user.resourceId,
          other: {
            session: result,
            refresh: new RefreshUserToken({
              endpoints: getPrivateFimidaraEndpointsUsingUserToken(),
              user: result,
            }),
          },
        },
      },
    ];
  } else {
    states.push([
      /** anything is allowed really because `useUserSessionFetchStore`'s
       * `comparisonFn` returns true always making there be only one session in
       * store.  */ {},
      {
        loading: false,
        error: undefined,
        data: {
          id: user.resourceId,
          other: {
            session: result,
            refresh: new RefreshUserToken({
              endpoints: getPrivateFimidaraEndpointsUsingUserToken(),
              user: result,
            }),
          },
        },
      },
    ]);
  }

  useUserSessionFetchStore.setState({ states });
}
