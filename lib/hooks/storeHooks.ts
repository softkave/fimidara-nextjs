import { isArray } from "lodash";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type KVStore = {
  items: Record<string, any>;
  set(key: string, value: any): void;
  get<T = any>(key: string): T | undefined;
  remove(key: string | string[]): void;
  setList(values: Array<[string, any]>): void;
  getList: (keys: string[]) => any[];
};

export enum KeyValueKeys {
  LoginAgain = "LoginAgain",
  UserImageLastUpdateTime = "UserImageLastUpdateTime",
  WorkspaceImageLastUpdateTime = "WorkspaceImageLastUpdateTime",
}

export class KeyValueDynamicKeys {
  static getWorkspaceImageLastUpdateTime = (workspaceId: string) =>
    `${KeyValueKeys.WorkspaceImageLastUpdateTime}_${workspaceId}`;
}

export const useKvStore = create<
  KVStore,
  [["zustand/immer", {}], ["zustand/devtools", {}]]
>(
  immer(
    devtools((set, get) => ({
      items: {},
      get<T>(key: string) {
        return get().items[key] as T | undefined;
      },
      getList(keys) {
        const store = get();
        return keys.map((key) => store.items[key]);
      },
      remove(key) {
        set((store) => {
          if (isArray(key))
            key.forEach((nextKey) => {
              delete store.items[nextKey];
            });
          else delete store.items[key];
        });
      },
      set(key, value) {
        set((store) => {
          store.items[key] = value as any;
        });
      },
      setList(values) {
        set((store) => {
          values.forEach(([key, value]) => (store.items[key] = value as any));
        });
      },
    }))
  )
);
