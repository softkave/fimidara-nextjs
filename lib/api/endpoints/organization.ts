import {
  INewOrganizationInput,
  IOrganization,
  IRequestOrganization,
  IUpdateOrganizationInput,
} from "../../definitions/organization";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/organizations";
const addOrganizationURL = `${baseURL}/addOrganization`;
const deleteOrganizationURL = `${baseURL}/deleteOrganization`;
const getOrganizationURL = `${baseURL}/getOrganization`;
const getRequestOrganizationURL = `${baseURL}/getRequestOrganization`;
const getUserOrganizationsURL = `${baseURL}/getUserOrganizations`;
const updateOrganizationURL = `${baseURL}/updateOrganization`;

export type IAddOrganizationEndpointParams = INewOrganizationInput;

export type IAddOrganizationEndpointResult = GetEndpointResult<{
  organization: IOrganization;
}>;

async function addOrganization(props: IAddOrganizationEndpointParams) {
  return invokeEndpointWithAuth<IAddOrganizationEndpointResult>({
    path: addOrganizationURL,
    data: props,
  });
}

export interface IDeleteOrganizationEndpointParams {
  organizationId: string;
}

async function deleteOrganization(props: IDeleteOrganizationEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deleteOrganizationURL,
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
    path: getOrganizationURL,
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
    path: getRequestOrganizationURL,
    data: props,
  });
}

export type IGetUserOrganizationsEndpointResult = GetEndpointResult<{
  organizations: IOrganization[];
}>;

async function getUserOrganizations() {
  return await invokeEndpointWithAuth<IGetUserOrganizationsEndpointResult>({
    path: getUserOrganizationsURL,
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
    path: updateOrganizationURL,
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

export class OrganizationURLs {
  public static addOrganization = addOrganizationURL;
  public static deleteOrganization = deleteOrganizationURL;
  public static getOrganization = getOrganizationURL;
  public static getRequestOrganization = getRequestOrganizationURL;
  public static getUserOrganizations = getUserOrganizationsURL;
  public static updateOrganization = updateOrganizationURL;
}
