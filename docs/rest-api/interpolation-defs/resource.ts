import {AppResourceType} from './system';
import {IEndpointParamsBase, IEndpointResultBase} from './types';

/** @category Resource */
export interface IResourceBase {
  resourceId: string;
}

/** @category Resource */
export interface IResource<T extends IResourceBase = IResourceBase> {
  resourceId: string;
  resourceType: AppResourceType;
  resource: T;
}

/** @category Resource */
export interface IGetResourceInputItem {
  resourceId: string;
  resourceType: AppResourceType;
}

/** @category Resource */
export interface IGetResourcesEndpointParams extends IEndpointParamsBase {
  workspaceId: string;
  resources: Array<IGetResourceInputItem>;
}

/** @category Resource */
export type IGetResourcesEndpointResult = IEndpointResultBase & {
  resources: IResource[];
};
