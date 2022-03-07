import { IFile, IUpdateFileDetailsInput } from "../../definitions/file";
import { systemConstants } from "../../definitions/system";
import SessionSelectors from "../../store/session/selectors";
import store from "../../store/store";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import {
  HTTP_HEADER_CONTENT_TYPE as HTTP_HEADER_CONTENT_TYPE,
  CONTENT_TYPE_MULTIPART_FORMDATA,
  invokeEndpoint,
  invokeEndpointWithAuth,
  setEndpointFormData,
  HTTP_HEADER_AUTHORIZATION,
  setEndpointParam,
} from "../utils";

const URLSearchParams =
  require("core-js/features/url-search-params") as typeof globalThis["URLSearchParams"];

const baseURL = "/files";
const deleteFileURL = `${baseURL}/deleteFile`;
const getFileDetailsURL = `${baseURL}/getFileDetails`;
const updateFileDetailsURL = `${baseURL}/updateFileDetails`;
const uploadFileURL = `${baseURL}/uploadFile`;
const getFileURL = `${baseURL}/getFile`;

export const UPLOAD_FILE_BLOB_FORMDATA_KEY = "data";
export const PATH_QUERY_PARAMS_KEY = "p";
export const ORG_ID_QUERY_PARAMS_KEY = "orgId";
export const IMAGE_WIDTH_QUERY_PARAMS_KEY = "w";
export const IMAGE_HEIGHT_QUERY_PARAMS_KEY = "h";

export function getFetchImagePath(p: string, width: number, height: number) {
  // TODO: Setup Sentry to find issues like URLSearchParams
  // not polyfilled
  const params = new URLSearchParams();
  params.append(ORG_ID_QUERY_PARAMS_KEY, systemConstants.organizationId);
  params.append(PATH_QUERY_PARAMS_KEY, p);
  setEndpointParam(params, IMAGE_WIDTH_QUERY_PARAMS_KEY, width);
  setEndpointParam(params, IMAGE_HEIGHT_QUERY_PARAMS_KEY, height);
  return getFileURL + `?${params.toString()}`;
}

export function getUploadFilePath(p: string) {
  const params = new URLSearchParams();
  params.append(ORG_ID_QUERY_PARAMS_KEY, systemConstants.organizationId);
  params.append(PATH_QUERY_PARAMS_KEY, p);
  return uploadFileURL + `?${params.toString()}`;
}

export function getFetchUserImagePath(
  userId: string,
  width: number,
  height: number
) {
  const p = systemConstants.userImagesFolder + "/" + userId;
  return getFetchImagePath(p, width, height);
}

export function getFetchOrgImagePath(
  orgId: string,
  width: number,
  height: number
) {
  const p = systemConstants.orgImagesFolder + "/" + orgId;
  return getFetchImagePath(p, width, height);
}

export function getUploadUserImagePath(userId: string) {
  const p = systemConstants.userImagesFolder + "/" + userId;
  return getUploadFilePath(p);
}

export function getUploadOrgImagePath(orgId: string) {
  const p = systemConstants.orgImagesFolder + "/" + orgId;
  return getUploadFilePath(p);
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
  description?: string;
  encoding?: string;
  extension?: string;
  mimetype?: string;
  data: Blob;
  path: string;
}

export type IUploadFileEndpointResult = GetEndpointResult<{
  file: IFile;
}>;

async function uploadFile(props: IUploadFileEndpointParams) {
  const formData = new FormData();
  formData.append("organizationId", systemConstants.organizationId);
  formData.append(UPLOAD_FILE_BLOB_FORMDATA_KEY, props.data);
  formData.append("path", props.path);
  setEndpointFormData(formData, "description", props.description);
  setEndpointFormData(formData, "encoding", props.encoding);
  setEndpointFormData(formData, "extension", props.extension);
  setEndpointFormData(formData, "mimetype", props.mimetype);

  const clientAssignedToken = SessionSelectors.assertGetClientAssignedToken(
    store.getState()
  );

  return await invokeEndpoint<IUploadFileEndpointResult>({
    path: uploadFileURL,
    data: formData,
    headers: {
      [HTTP_HEADER_CONTENT_TYPE]: CONTENT_TYPE_MULTIPART_FORMDATA,
      [HTTP_HEADER_AUTHORIZATION]: `Bearer ${clientAssignedToken}`,
    },
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
