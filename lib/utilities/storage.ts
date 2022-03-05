export type StorageType = "localStorage" | "sessionStorage";
type StorageName = StorageType | "local" | "session";

function getStorageType(storageType: StorageName) {
  switch (storageType) {
    case "local":
    case "localStorage":
      return localStorage;

    case "session":
    case "sessionStorage":
    default:
      return sessionStorage;
  }
}

const defaultStorageType: StorageName = "local";

export function setItem(
  key: string,
  data: string,
  storageType = defaultStorageType
) {
  const storageObject = getStorageType(storageType);

  if (storageObject) {
    storageObject.setItem(key, data);
  }
}

export function removeItem(key: string, storageType = defaultStorageType) {
  const storageObject = getStorageType(storageType);

  if (storageObject) {
    storageObject.removeItem(key);
  }
}

export function getItem(key: string, storageType = defaultStorageType) {
  const storageObject = getStorageType(storageType);

  if (storageObject) {
    return storageObject.getItem(key);
  }
}

export function setItemIfExist(
  key: string,
  data: string,
  storageType = defaultStorageType
) {
  if (getItem(key, storageType)) {
    setItem(key, data, storageType);
  }
}

export function makeSetFnForKey(key: string) {
  return (data: string, storageType = defaultStorageType) =>
    setItem(key, data, storageType);
}

export function makeGetFnForKey(key: string) {
  return (storageType = defaultStorageType) => getItem(key, storageType);
}

export function makeSetIfExistFnForKey(key: string) {
  return (data: string, storageType = defaultStorageType) =>
    setItemIfExist(key, data, storageType);
}

export function makeRemoveFnForKey(key: string) {
  return (storageType = defaultStorageType) => removeItem(key, storageType);
}

export class StorageFns {
  static setItem = setItem;
  static removeItem = removeItem;
  static getItem = getItem;
  static setItemIfExist = setItemIfExist;
  static makeSetFnForKey = makeSetFnForKey;
  static makeGetFnForKey = makeGetFnForKey;
  static makeSetIfExistFnForKey = makeSetIfExistFnForKey;
  static makeRemoveFnForKey = makeRemoveFnForKey;
}
