import { IGetResourceInputItem, IResource } from "../../definitions/resource";
import { GetEndpointResult } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/resources";
const getResourcesURL = `${baseURL}/getResources`;

export interface IGetResourcesEndpointParams {
  organizationId: string;
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
  public static getResources = getResources;
}

export class ResourceURLs {
  public static getResources = getResourcesURL;
}
