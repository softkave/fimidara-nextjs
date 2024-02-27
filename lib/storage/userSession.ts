import {
  makeGetFnForKey,
  makeRemoveFnForKey,
  makeSetFnForKey,
  makeSetIfExistFnForKey,
  removeItem,
} from "../utils/storage";
import { StorageKeys } from "./types";

export default class UserSessionStorageFns {
  static getUserToken = makeGetFnForKey(StorageKeys.UserToken);
  static saveUserToken = makeSetFnForKey(StorageKeys.UserToken);
  static deleteUserToken = makeRemoveFnForKey(StorageKeys.UserToken);
  static saveUserTokenIfExists = makeSetIfExistFnForKey(StorageKeys.UserToken);
  static getClientAssignedToken = makeGetFnForKey(
    StorageKeys.ClientAssignedToken
  );
  static saveClientAssignedToken = makeSetFnForKey(
    StorageKeys.ClientAssignedToken
  );
  static deleteClientAssignedToken = makeRemoveFnForKey(
    StorageKeys.ClientAssignedToken
  );
  static saveClientAssignedTokenIfExists = makeSetIfExistFnForKey(
    StorageKeys.ClientAssignedToken
  );

  static clearSessionData = () => {
    removeItem(StorageKeys.UserToken);
    removeItem(StorageKeys.ClientAssignedToken);
  };
}
