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
  static setKey = setKeyValue;
  static setValues = setValues;
  static deleteKey = deleteKeyValue;
}
