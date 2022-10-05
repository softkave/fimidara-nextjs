import { IFile } from "../../definitions/file";
import {
  IFolder,
  IFolderMatcher,
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

export interface IDeleteFolderEndpointParams extends IFolderMatcher {}

async function deleteFolder(props: IDeleteFolderEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deleteFolderURL,
    data: props,
    method: "DELETE",
  });
}

export interface IGetFolderEndpointParams extends IFolderMatcher {}
export type IGetFolderEndpointResult = GetEndpointResult<{
  folder: IFolder;
}>;

async function getFolder(props: IGetFolderEndpointParams) {
  return await invokeEndpointWithAuth<IGetFolderEndpointResult>({
    path: getFolderURL,
    data: props,
  });
}

export interface IListFolderContentEndpointParams extends IFolderMatcher {}
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

export interface IUpdateFolderEndpointParams extends IFolderMatcher {
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
  static addFolder = addFolder;
  static listFolderContent = listFolderContent;
  static getFolder = getFolder;
  static deleteFolder = deleteFolder;
  static updateFolder = updateFolder;
}

export class FolderURLs {
  static addFolder = addFolderURL;
  static listFolderContent = listFolderContentURL;
  static getFolder = getFolderURL;
  static deleteFolder = deleteFolderURL;
  static updateFolder = updateFolderURL;
}
