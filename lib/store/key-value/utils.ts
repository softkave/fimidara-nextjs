import { KeyValueKeys } from "./types";

export class KeyValueDynamicKeys {
  static getOrgImageLastUpdateTime = (orgId: string) =>
    `${KeyValueKeys.OrgImageLastUpdateTime}_${orgId}`;
}
