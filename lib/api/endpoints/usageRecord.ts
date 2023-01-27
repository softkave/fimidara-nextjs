import {
  IUsageRecord,
  IWorkspaceSummedUsageQuery,
  UsageRecordCategory,
} from "../../definitions/usageRecord";
import { IEndpointResultBase } from "../types";
import { invokeEndpoint, invokeEndpointWithAuth } from "../utils";

const basePath = "/usageRecords";
const getUsageCostsPath = `${basePath}/getUsageCosts`;
const getWorkspaceSummedUsagePath = `${basePath}/getWorkspaceSummedUsage`;

export interface IGetUsageCostsEndpointResult extends IEndpointResultBase {
  costs: Record<UsageRecordCategory, number>;
}

export interface IGetWorkspaceSummedUsageEndpointParams {
  workspaceId?: string;
  query?: IWorkspaceSummedUsageQuery;
}

export interface IGetWorkspaceSummedUsageEndpointResult
  extends IEndpointResultBase {
  records: IUsageRecord[];
}

async function getUsageCosts() {
  return await invokeEndpoint<IGetUsageCostsEndpointResult>({
    path: getUsageCostsPath,
  });
}

async function getWorkspaceSummedUsage(
  props: IGetWorkspaceSummedUsageEndpointParams
) {
  return await invokeEndpointWithAuth<IGetWorkspaceSummedUsageEndpointResult>({
    path: getWorkspaceSummedUsagePath,
    data: props,
  });
}

export default class UsageRecordAPI {
  static getUsageCosts = getUsageCosts;
  static getWorkspaceSummedUsage = getWorkspaceSummedUsage;
}

export class UsageRecordURLs {
  static getUsageCosts = getUsageCostsPath;
  static getWorkspaceSummedUsage = getWorkspaceSummedUsagePath;
}
