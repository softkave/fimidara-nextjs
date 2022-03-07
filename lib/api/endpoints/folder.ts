import { IFile } from "../../definitions/file";
import {
  IFolder,
  INewFolderInput,
  IUpdateFolderInput,
} from "../../definitions/folder";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/folders";

export interface IAddFolderEndpointParams {
  organizationId?: string;
  folder: INewFolderInput;
}

export type IAddFolderEndpointResult = GetEndpointResult<{
  Folder: IFolder;
}>;

async function addFolder(props: IAddFolderEndpointParams) {
  return invokeEndpointWithAuth<IAddFolderEndpointResult>({
    path: `${baseURL}/addFolder`,
    data: props,
  });
}

export interface IDeleteFolderEndpointParams {
  organizationId?: string;
  path: string;
}

async function deleteFolder(props: IDeleteFolderEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${baseURL}/deleteFolder`,
    data: props,
  });
}

export interface IGetFolderEndpointParams {
  organizationId?: string;
  path: string;
}

export type IGetFolderEndpointResult = GetEndpointResult<{
  Folders: IFolder[];
}>;

async function getFolder(props: IGetFolderEndpointParams) {
  return await invokeEndpointWithAuth<IGetFolderEndpointResult>({
    path: `${baseURL}/getFolder`,
    data: props,
  });
}

export interface IListFolderContentEndpointParams {
  organizationId?: string;
  path: string;
}

export type IListFolderContentEndpointResult = GetEndpointResult<{
  folders: IFolder[];
  files: IFile[];
}>;

async function listFolderContent(props: IListFolderContentEndpointParams) {
  return await invokeEndpointWithAuth<IListFolderContentEndpointResult>({
    path: `${baseURL}/listFolderContent`,
    data: props,
  });
}

export interface IUpdateFolderEndpointParams {
  organizationId?: string;
  path: string;
  folder: IUpdateFolderInput;
}

export type IUpdateFolderEndpointResult = GetEndpointResult<{
  Folder: IFolder;
}>;

async function updateFolder(props: IUpdateFolderEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateFolderEndpointResult>({
    path: `${baseURL}/updateFolder`,
    data: props,
  });
}

export default class FolderAPI {
  public static addFolder = addFolder;
  public static listFolderContent = listFolderContent;
  public static getFolder = getFolder;
  public static deleteFolder = deleteFolder;
  public static updateFolder = updateFolder;
}
