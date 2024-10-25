import { ValueOf } from "type-fest";

export const kStorageType = {
  localStorage: "localStorage",
  sessionStorage: "sessionStorage",
  local: "local",
  session: "session",
};

export type StorageName = ValueOf<typeof kStorageType>;

function getStorageType(storageType: StorageName) {
  switch (storageType) {
    case kStorageType.local:
    case kStorageType.localStorage:
      return globalThis?.localStorage;
    case kStorageType.session:
    case kStorageType.sessionStorage:
    default:
      return globalThis?.sessionStorage;
  }
}

function setItem(
  key: string,
  data: string,
  storageType: StorageName = kStorageType.local
) {
  const storageObject = getStorageType(storageType);

  if (storageObject) {
    storageObject.setItem(key, data);
  }
}

function removeItem(
  key: string,
  storageType: StorageName = kStorageType.local
) {
  const storageObject = getStorageType(storageType);

  if (storageObject) {
    storageObject.removeItem(key);
  }
}

function getItem(key: string, storageType: StorageName = kStorageType.local) {
  const storageObject = getStorageType(storageType);

  if (storageObject) {
    return storageObject.getItem(key);
  }
}

function setItemIfExist(
  key: string,
  data: string,
  storageType: StorageName = kStorageType.local
) {
  if (getItem(key, storageType)) {
    setItem(key, data, storageType);
  }
}

export class StorageFns {
  static setItem = setItem;
  static removeItem = removeItem;
  static getItem = getItem;
  static setItemIfExist = setItemIfExist;
}
