import { IGetResourceInputItem, IResource } from "../../definitions/resource";
import { GetEndpointResult } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/v1/resources";
const getResourcesURL = `${baseURL}/getResources`;

export interface IGetResourcesEndpointParams {
  workspaceId: string;
  resources: Array<IGetResourceInputItem>;
}

export type IGetResourcesEndpointResult = GetEndpointResult<{
  resources: IResource[];
}>;

async function getResources(props: IGetResourcesEndpointParams) {
  return await invokeEndpointWithAuth<IGetResourcesEndpointResult>({
    path: getResourcesURL,
    data: props,
  });
}

export default class ResourceAPI {
  static getResources = getResources;
}

export class ResourceURLs {
  static getResources = getResourcesURL;
}
