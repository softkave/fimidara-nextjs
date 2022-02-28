import {
  INewOrganizationInput,
  IOrganization,
  IRequestOrganization,
  IUpdateOrganizationInput,
} from "../../definitions/organization";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "organizations";

export type IAddOrganizationEndpointParams = INewOrganizationInput;

export type IAddOrganizationEndpointResult = GetEndpointResult<{
  organization: IOrganization;
}>;

async function addOrganization(props: IAddOrganizationEndpointParams) {
  return invokeEndpointWithAuth<IAddOrganizationEndpointResult>({
    path: `${baseURL}/addOrganization`,
    data: props,
  });
}

export interface IDeleteOrganizationEndpointParams {
  organizationId: string;
}

async function deleteOrganization(props: IDeleteOrganizationEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${baseURL}/deleteOrganization`,
    data: props,
  });
}

export interface IGetOrganizationEndpointParams {
  organizationId: string;
}

export type IGetOrganizationEndpointResult = GetEndpointResult<{
  organization: IOrganization;
}>;

async function getOrganization(props: IGetOrganizationEndpointParams) {
  return await invokeEndpointWithAuth<IGetOrganizationEndpointResult>({
    path: `${baseURL}/getOrganization`,
    data: props,
  });
}

export interface IGetRequestOrganizationEndpointParams {
  organizationId: string;
}

export type IGetRequestOrganizationEndpointResult = GetEndpointResult<{
  organization: IRequestOrganization;
}>;

async function getRequestOrganization(
  props: IGetRequestOrganizationEndpointParams
) {
  return await invokeEndpointWithAuth<IGetRequestOrganizationEndpointResult>({
    path: `${baseURL}/getRequestOrganization`,
    data: props,
  });
}

export type IGetUserOrganizationsEndpointResult = GetEndpointResult<{
  organizations: IOrganization[];
}>;

async function getUserOrganizations() {
  return await invokeEndpointWithAuth<IGetUserOrganizationsEndpointResult>({
    path: `${baseURL}/getUserOrganizations`,
  });
}

export interface IUpdateOrganizationEndpointParams {
  organizationId: string;
  organization: IUpdateOrganizationInput;
}

export type IUpdateOrganizationEndpointResult = GetEndpointResult<{
  organization: IOrganization;
}>;

async function updateOrganization(props: IUpdateOrganizationEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateOrganizationEndpointResult>({
    path: `${baseURL}/updateOrganization`,
    data: props,
  });
}

export default class OrganizationAPI {
  public static addOrganization = addOrganization;
  public static deleteOrganization = deleteOrganization;
  public static getOrganization = getOrganization;
  public static getRequestOrganization = getRequestOrganization;
  public static getUserOrganizations = getUserOrganizations;
  public static updateOrganization = updateOrganization;
}
