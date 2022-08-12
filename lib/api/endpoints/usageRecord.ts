import {
  IUsageRecord,
  UsageRecordCategory,
  UsageRecordFulfillmentStatus,
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
  workspaceId: string;
  categories?: UsageRecordCategory[];
  fromDate?: string;
  toDate?: string;
  fulfillmentStatus?: UsageRecordFulfillmentStatus;
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
  public static getUsageCosts = getUsageCosts;
  public static getWorkspaceSummedUsage = getWorkspaceSummedUsage;
}

export class UsageRecordURLs {
  public static getUsageCosts = getUsageCostsPath;
  public static getWorkspaceSummedUsage = getWorkspaceSummedUsagePath;
}
