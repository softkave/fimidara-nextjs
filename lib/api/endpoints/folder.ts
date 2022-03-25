import { IFile } from "../../definitions/file";
import {
  IFolder,
  INewFolderInput,
  IUpdateFolderInput,
} from "../../definitions/folder";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "/folders";
const addFolderURL = `${baseURL}/addFolder`;
const listFolderContentURL = `${baseURL}/listFolderContent`;
const getFolderURL = `${baseURL}/getFolder`;
const deleteFolderURL = `${baseURL}/deleteFolder`;
const updateFolderURL = `${baseURL}/updateFolder`;

export interface IAddFolderEndpointParams {
  organizationId?: string;
  parentFolderId?: string;
  parentFolderPath?: string;
  folder: INewFolderInput;
}

export type IAddFolderEndpointResult = GetEndpointResult<{
  folder: IFolder;
}>;

async function addFolder(props: IAddFolderEndpointParams) {
  return invokeEndpointWithAuth<IAddFolderEndpointResult>({
    path: addFolderURL,
    data: props,
  });
}

export interface IDeleteFolderEndpointParams {
  organizationId?: string;
  folderPath?: string;
  folderId?: string;
}

async function deleteFolder(props: IDeleteFolderEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deleteFolderURL,
    data: props,
  });
}

export interface IGetFolderEndpointParams {
  organizationId?: string;
  folderPath?: string;
  folderId?: string;
}

export type IGetFolderEndpointResult = GetEndpointResult<{
  folder: IFolder;
}>;

async function getFolder(props: IGetFolderEndpointParams) {
  return await invokeEndpointWithAuth<IGetFolderEndpointResult>({
    path: getFolderURL,
    data: props,
  });
}

export interface IListFolderContentEndpointParams {
  organizationId?: string;
  folderPath?: string;
  folderId?: string;
}

export type IListFolderContentEndpointResult = GetEndpointResult<{
  folders: IFolder[];
  files: IFile[];
}>;

async function listFolderContent(props: IListFolderContentEndpointParams) {
  return await invokeEndpointWithAuth<IListFolderContentEndpointResult>({
    path: listFolderContentURL,
    data: props,
  });
}

export interface IUpdateFolderEndpointParams {
  organizationId?: string;
  folderPath?: string;
  folderId?: string;
  folder: IUpdateFolderInput;
}

export type IUpdateFolderEndpointResult = GetEndpointResult<{
  Folder: IFolder;
}>;

async function updateFolder(props: IUpdateFolderEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateFolderEndpointResult>({
    path: updateFolderURL,
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

export class FolderURLs {
  public static addFolder = addFolderURL;
  public static listFolderContent = listFolderContentURL;
  public static getFolder = getFolderURL;
  public static deleteFolder = deleteFolderURL;
  public static updateFolder = updateFolderURL;
}
