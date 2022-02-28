import { getItem, removeItem, setItem } from "../utilities/storage";
import { StorageKeys } from "./types";

function getUserToken() {
    return getItem(StorageKeys.Token);
}

function saveUserToken(token: string) {
    setItem(StorageKeys.Token, token);
}

function deleteUserToken() {
    removeItem(StorageKeys.Token);
}

function saveTokenIfExists(token: string) {
    if (getUserToken()) {
        saveUserToken(token);
    }
}

export default class UserSessionStorageFns {
    public static getUserToken = getUserToken;
    public static saveUserToken = saveUserToken;
    public static deleteUserToken = deleteUserToken;
    public static saveTokenIfExists = saveTokenIfExists;
}
