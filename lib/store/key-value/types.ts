export enum KeyValueKeys {
  LoginAgain = "LoginAgain",
  UserImageLastUpdateTime = "UserImageLastUpdateTime",
  OrgImageLastUpdateTime = "OrgImageLastUpdateTime",
}

export type IKeyValueState = Partial<Record<KeyValueKeys | string, any>>;
