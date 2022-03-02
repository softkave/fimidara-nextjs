import {
  IFile,
  INewFileInput,
  IUpdateFileDetailsInput,
} from "../../definitions/file";
import { systemConstants } from "../../definitions/system";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { invokeEndpointWithAuth } from "../utils";

const baseURL = "files";
const deleteFileURL = `${baseURL}/deleteFile`;
const getFileDetailsURL = `${baseURL}/getFileDetails`;
const updateFileDetailsURL = `${baseURL}/updateFileDetails`;
const uploadFileURL = `${baseURL}/uploadFile`;
const getFileURL = `${baseURL}/getFile`;

export function getUserImagePath(
  userId: string,
  width: number,
  height: number
) {
  const p = systemConstants.userImagesFolder + "/" + userId;
  return (
    getFileURL +
    `?orgId=${systemConstants.organizationId}&p=${p}&w=${width}&h=${height}`
  );
}

export interface IGetFileDetailsEndpointParams {
  path: string;
  organizationId?: string;
}

export type IGetFileDetailsEndpointResult = GetEndpointResult<{
  file: IFile;
}>;

async function getFileDetails(props: IGetFileDetailsEndpointParams) {
  return invokeEndpointWithAuth<IGetFileDetailsEndpointResult>({
    path: getFileDetailsURL,
    data: props,
  });
}

export interface IDeleteFileEndpointParams {
  path: string;
  organizationId?: string;
}

async function deleteFile(props: IDeleteFileEndpointParams) {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deleteFileURL,
    data: props,
  });
}

// export interface IGetFileEndpointParams {
//   path: string;
//   organizationId?: string;
//   imageTranformation?: IImageTransformationParams;
// }

// export type IGetFileEndpointResult = GetEndpointResult<{
//   buffer: Buffer;
//   file: IFile;
// }>;

// async function getFile(props: IGetFileEndpointParams) {
//   return await invokeEndpointWithAuth<IGetFileEndpointResult>({
//     path: `${baseURL}/getFile`,
//     data: props,
//   });
// }

export interface IUpdateFileDetailsEndpointParams {
  organizationId?: string;
  path: string;
  file: IUpdateFileDetailsInput;
}

export type IUpdateFileDetailsEndpointResult = GetEndpointResult<{
  file: IFile;
}>;

async function updateFileDetails(props: IUpdateFileDetailsEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateFileDetailsEndpointResult>({
    path: updateFileDetailsURL,
    data: props,
  });
}

export interface IUploadFileEndpointParams {
  organizationId?: string;
  file: INewFileInput;
}

export type IUploadFileEndpointResult = GetEndpointResult<{
  file: IFile;
}>;

async function uploadFile(props: IUploadFileEndpointParams) {
  return await invokeEndpointWithAuth<IUploadFileEndpointResult>({
    path: uploadFileURL,
    data: props,
  });
}

export default class FileAPI {
  public static deleteFile = deleteFile;
  public static getFileDetails = getFileDetails;
  public static updateFileDetails = updateFileDetails;
  public static uploadFile = uploadFile;
}

export class FileURLs {
  public static deleteFile = deleteFileURL;
  public static getFileDetails = getFileDetailsURL;
  public static updateFileDetails = updateFileDetailsURL;
  public static uploadFile = uploadFileURL;
}
