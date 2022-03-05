import { createAction } from "@reduxjs/toolkit";
import { IKeyValueState, KeyValueKeys } from "./types";

const setKeyValue = createAction<{
  key: KeyValueKeys | string;
  value: any;
}>("keyValue/set");

const setValues = createAction<IKeyValueState>("keyValue/setValues");
const deleteKeyValue = createAction<KeyValueKeys | string>(
  "keyValue/deleteKey"
);

export default class KeyValueActions {
  public static setKey = setKeyValue;
  public static setValues = setValues;
  public static deleteKey = deleteKeyValue;
}
