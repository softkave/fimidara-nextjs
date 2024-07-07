import { compact, isArray } from "lodash-es";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type ResourceListStore<T> = {
  items: Record<string, T>;
  set(key: string, value: T): void;
  setList(values: Array<[string, T]>): void;
  get: (key: string) => T | undefined;
  getList: (keys: string[]) => T[];
  remove: (key: string | string[]) => void;
  clear(): void;
};

export function makeResourceListStore<T extends object>(storeName: string) {
  return create<
    ResourceListStore<T>,
    [["zustand/immer", {}], ["zustand/devtools", {}]]
  >(
    immer(
      devtools(
        (set, get) => ({
          items: {},
          get(key) {
            return get().items[key] as T | undefined;
          },
          getList(keys) {
            const store = get();
            return compact(keys.map((key) => store.items[key]));
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
              values.forEach(
                ([key, value]) => (store.items[key] = value as any)
              );
            });
          },
          clear() {
            set((store) => {
              store.items = {};
            });
          },
        }),
        { name: storeName }
      )
    )
  );
}

export type ResourceZustandStore<T extends object> = ReturnType<
  typeof makeResourceListStore<T>
>;
