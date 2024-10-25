import { StorageFns } from "../utils/storage";
import { StorageKeys } from "./types";

export class UserSessionStorageFns {
  setData = (data: {
    clientJwtToken: string;
    jwtToken: string;
    jwtTokenExpiresAt: number;
    refreshToken: string;
  }) => {
    StorageFns.setItem(StorageKeys.userToken, data.jwtToken);
    StorageFns.setItem(StorageKeys.clientAssignedToken, data.clientJwtToken);
    StorageFns.setItem(StorageKeys.refreshToken, data.refreshToken);
    StorageFns.setItem(
      StorageKeys.jwtTokenExpiresAt,
      data.jwtTokenExpiresAt.toString()
    );
  };

  getData = () => {
    return {
      jwtToken: StorageFns.getItem(StorageKeys.userToken),
      clientJwtToken: StorageFns.getItem(StorageKeys.clientAssignedToken),
      refreshToken: StorageFns.getItem(StorageKeys.refreshToken),
      jwtTokenExpiresAt: parseInt(
        StorageFns.getItem(StorageKeys.jwtTokenExpiresAt) ?? "0"
      ),
    };
  };

  clearData = () => {
    StorageFns.removeItem(StorageKeys.userToken);
    StorageFns.removeItem(StorageKeys.clientAssignedToken);
    StorageFns.removeItem(StorageKeys.refreshToken);
    StorageFns.removeItem(StorageKeys.jwtTokenExpiresAt);
  };
}

export const kUserSessionStorageFns = new UserSessionStorageFns();
