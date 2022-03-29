import { AppResourceType } from "./system";

export interface IResourceBase {
  resourceId: string;
}

export interface IResourceWithName extends IResourceBase {
  name: string;
}

export interface IResource<T extends IResourceBase = IResourceBase> {
  resourceId: string;
  resourceType: AppResourceType;
  resource: T;
}

export interface IGetResourceInputItem {
  resourceId: string;
  resourceType: AppResourceType;
}
