import {
  makeGetFnForKey,
  makeRemoveFnForKey,
  makeSetFnForKey,
  makeSetIfExistFnForKey,
} from "../utilities/storage";
import { StorageKeys } from "./types";

export default class UserSessionStorageFns {
  public static getUserToken = makeGetFnForKey(StorageKeys.UserToken);
  public static saveUserToken = makeSetFnForKey(StorageKeys.UserToken);
  public static deleteUserToken = makeRemoveFnForKey(StorageKeys.UserToken);
  public static saveUserTokenIfExists = makeSetIfExistFnForKey(
    StorageKeys.UserToken
  );

  public static getClientAssignedToken = makeGetFnForKey(
    StorageKeys.ClientAssignedToken
  );
  public static saveClientAssignedToken = makeSetFnForKey(
    StorageKeys.ClientAssignedToken
  );
  public static deleteClientAssignedToken = makeRemoveFnForKey(
    StorageKeys.ClientAssignedToken
  );
  public static saveClientAssignedTokenIfExists = makeSetIfExistFnForKey(
    StorageKeys.ClientAssignedToken
  );
}
