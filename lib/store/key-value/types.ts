export enum KeyValueKeys {
  LoginAgain = "LoginAgain",
  UserImageLastUpdateTime = "UserImageLastUpdateTime",
  WorkspaceImageLastUpdateTime = "WorkspaceImageLastUpdateTime",
}

export type IKeyValueState = Partial<Record<KeyValueKeys | string, any>>;
