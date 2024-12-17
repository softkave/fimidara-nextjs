"use client";

import { isArray, last } from "lodash-es";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type KVStore = {
  items: Record<string, any>;
  set(key: string, value: any): void;
  setWithFn(key: string, fn: (value: any) => any): void;
  get<T = any>(key: string): T | undefined;
  remove(key: string | string[]): void;
  setList(values: Array<[string, any]>): void;
  getList: (keys: string[]) => any[];
};

export enum KeyValueKeys {
  LoginAgain = "loginAgain",
  UserImageLastUpdateTime = "userImageLastUpdateTime",
  WorkspaceImageLastUpdateTime = "workspaceImageLastUpdateTime",
  TransferProgress = "transferProgress",
  OpError = "opError",
  appMenuOpen = "appMenuOpen",
}

export class KeyValueDynamicKeys {
  static getWorkspaceImageLastUpdateTime = (workspaceId: string) =>
    `${KeyValueKeys.WorkspaceImageLastUpdateTime}_${workspaceId}`;
  static getTransferProgress = (identifier: string) =>
    `${KeyValueKeys.TransferProgress}_${identifier}`;
  static getTransferProgressIdentifier = (key: string) =>
    last(key.split(`${KeyValueKeys.TransferProgress}_`));
  static getOpError = (identifier: string) =>
    `${KeyValueKeys.OpError}_${identifier}`;
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
      setWithFn(key, fn) {
        set((store) => {
          store.items[key] = fn(store.items[key]);
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
