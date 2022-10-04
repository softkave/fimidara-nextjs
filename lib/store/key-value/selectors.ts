import { IAppState } from "../types";
import { KeyValueKeys } from "./types";

function getKeyValue<T = any>(state: IAppState, key: KeyValueKeys | string): T {
  return state.keyValue[key];
}

function getAll(state: IAppState) {
  return state.keyValue;
}

export default class KeyValueSelectors {
  static getKey = getKeyValue;
  static getAll = getAll;
}
