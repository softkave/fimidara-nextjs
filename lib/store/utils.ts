import { createAction, createReducer } from "@reduxjs/toolkit";
import isString from "lodash/isString";
import { IAppError } from "../utils/errors";
import { IMergeDataMeta, mergeData } from "../utils/utils";
import SessionActions from "./session/actions";
import { IAppState } from "./types";

export const errorToAppError = (err: Error | IAppError | string): IAppError => {
  const error = isString(err) ? new Error(err) : err;

  return {
    name: error.name,
    message: error.message,
    action: (error as any).action,
    field: (error as any).field,
  };
};

export const getAppErrorOrAppErrorList = (err: any) => {
  if (Array.isArray(err)) {
    return err.map((error) => errorToAppError(error));
  } else {
    return errorToAppError(err);
  }
};

interface IActionAdd<T> {
  id: string;
  data: T;
}

interface IActionUpdate<T> {
  id: string;
  data: Partial<T>;
  meta?: IMergeDataMeta;
}

export function getActions<T extends object>(name: string) {
  const add = createAction<IActionAdd<T>>(`${name}/add`);
  const update = createAction<IActionUpdate<T>>(`${name}/update`);
  const remove = createAction<string>(`${name}/remove`);
  const bulkAdd = createAction<IActionAdd<T>[]>(`${name}/bulkAdd`);
  const bulkUpdate = createAction<IActionUpdate<T>[]>(`${name}/bulkUpdate`);
  const bulkDelete = createAction<string[]>(`${name}/bulkDelete`);

  return class {
    static add = add;
    static update = update;
    static remove = remove;
    static bulkAdd = bulkAdd;
    static bulkUpdate = bulkUpdate;
    static bulkDelete = bulkDelete;
  };
}

// Copied from the type definitions of "@reduxjs/toolkit"
/**
 * An action with a string type and an associated payload. This is the
 * type of action returned by `createAction()` action creators.
 *
 * @template P The type of the action's payload.
 * @template T the type used for the action type.
 * @template M The type of the action's meta (optional)
 * @template E The type of the action's error (optional)
 *
 * @public
 */
type PayloadAction<
  P = void,
  T extends string = string,
  M = never,
  E = never
> = {
  payload: P;
  type: T;
} & ([M] extends [never]
  ? {}
  : {
      meta: M;
    }) &
  ([E] extends [never]
    ? {}
    : {
        error: E;
      });

interface Action<T = any> {
  type: T;
}

/**
 * Basic type for all action creators.
 *
 * @inheritdoc {redux#ActionCreator}
 */
interface BaseActionCreator<P, T extends string, M = never, E = never> {
  type: T;
  match(action: Action<unknown>): action is PayloadAction<P, T, M, E>;
}

/**
 * An action creator of type `T` that requires a payload of type P.
 *
 * @inheritdoc {redux#ActionCreator}
 *
 * @public
 */
interface ActionCreatorWithPayload<P, T extends string = string>
  extends BaseActionCreator<P, T> {
  /**
   * Calling this {@link redux#ActionCreator} with an argument will
   * return a {@link PayloadAction} of type `T` with a payload of `P`
   */
  (payload: P): PayloadAction<P, T>;
}
// End of copy

interface IActions<T> {
  add: ActionCreatorWithPayload<IActionAdd<T>, string>;
  update: ActionCreatorWithPayload<IActionUpdate<T>, string>;
  remove: ActionCreatorWithPayload<string, string>;
  bulkAdd: ActionCreatorWithPayload<IActionAdd<T>[], string>;
  bulkUpdate: ActionCreatorWithPayload<IActionUpdate<T>[], string>;
  bulkDelete: ActionCreatorWithPayload<string[], string>;
}

export function getReducer<T>(
  actions: IActions<T>,
  defaultState?: Record<string, T>
) {
  return createReducer<Record<string, T>>(defaultState || {}, (builder) => {
    builder.addCase(actions.add, (state, action) => {
      state[action.payload.id] = action.payload.data as any;
    });

    builder.addCase(actions.update, (state, action) => {
      state[action.payload.id] = mergeData(
        state[action.payload.id],
        action.payload.data as any,
        action.payload.meta
      );
    });

    builder.addCase(actions.remove, (state, action) => {
      delete state[action.payload];
    });

    builder.addCase(actions.bulkAdd, (state, action) => {
      action.payload.forEach((item) => (state[item.id] = item.data as any));
    });

    builder.addCase(actions.bulkUpdate, (state, action) => {
      action.payload.forEach((param) => {
        state[param.id] = mergeData(
          state[param.id],
          param.data as any,
          param.meta
        );
      });
    });

    builder.addCase(actions.bulkDelete, (state, action) => {
      action.payload.forEach((id) => delete state[id]);
    });

    builder.addCase(SessionActions.logoutUser, (state) => {
      return defaultState;
    });
  });
}

export function getSelectors<T>(key: keyof IAppState) {
  function getOne(state: IAppState, id: string) {
    const map = state[key] as Record<string, T>;
    return map[id];
  }

  function getMany(state: IAppState, ids: string[]) {
    const map = state[key] as Record<string, T>;

    return ids.reduce((items, id) => {
      if (map[id]) {
        items.push(map[id]);
      }

      return items;
    }, [] as T[]);
  }

  function filter(state: IAppState, fn: (item: T) => boolean) {
    const map = state[key] as Record<string, T>;
    return Object.values(map).filter((item) => fn(item));
  }

  function getMap(state: IAppState) {
    const map = state[key] as Record<string, T>;
    return map;
  }

  return class {
    static getOne = getOne;
    static getMany = getMany;
    static filter = filter;
    static getMap = getMap;
  };
}
