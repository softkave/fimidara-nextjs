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
