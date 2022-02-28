import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import { IMergeDataMeta } from "../utilities/utils";
import { IKeyValueState } from "./key-value/types";
import { ISessionState } from "./session/types";

export interface IAppState {
  session: ISessionState;
  keyValue: IKeyValueState;
}

export interface IAppAsyncThunkConfig {
  state: IAppState;
  dispatch: Dispatch;
  extra?: unknown;
  rejectValue?: unknown;
}

export type AppDispatch = ThunkDispatch<IAppState, void, AnyAction>;

export interface IResourcePayload {
  customId: string;
}

export interface IUpdateResourcePayload<R> {
  id: string;
  data: Partial<R>;
  meta?: IMergeDataMeta;
}

export interface IStoreLikeObject {
  getState: () => IAppState;
  dispatch: (action: any) => void;
}
