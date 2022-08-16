import {Readable} from 'form-data';
import {IAgent, IPublicAccessOp} from './system';
import {IEndpointParamsBase, IEndpointResultBase} from './types';

/** @category File */
export interface IFile {
  resourceId: string;
  workspaceId: string;

  /** Immediate parent folder ID if present. */
  folderId?: string;

  /**
   * Sorted list of parent folder IDs. 2nd ot the last item is the immediate
   * parent folder if present, and the last will be the file's own ID. */
  idPath: string[];

  /**
   * Sorted list of parent folder names. 2nd ot the last item is the immediate
   * parent folder if present, and the last will be the file's own name.
   * */
  namePath: string[];
  mimetype?: string;
  encoding?: string;
  size: number;
  createdBy: IAgent;
  createdAt: Date | string;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: Date | string;

  /** File name without the extension. File names are case sensitive, meaning
   * 'MyFileName' will **not** match 'myfilename'. */
  name: string;

  /** File extension. Empty string if file was uploaded without one. */
  extension: string;
  description?: string;

  /** A list of public actions that can be performed on the file, i.e, this list
   * contains the list of actions an unauthorized or unauthenticated agent can
   * perform on the file. This is useful for public files like profile pictures,
   * css, html, and js files, etc. */
  publicAccessOps: IPublicAccessOp[];
}

/** @category File */
export interface IImageTransformationParams {
  width?: number;
  height?: number;
}

/** @category File */
export interface IUpdateFileDetailsInput {
  description?: string;
  mimetype?: string;
}

/** @category File */
export enum UploadFilePublicAccessActions {
  /** No public action allowed. */
  None = 'none',

  /** Public action allowed: download. */
  Read = 'read',

  /** Public action allowed: read and download. */
  ReadAndUpdate = 'read-update',

  /** Public action allowed: read, download and delete. */
  ReadUpdateAndDelete = 'read-update-delete',
}

/** @category File */
export interface IFileMatcher {
  /**
   * File path including the file extension if present. `fileId` is optional if
   * `filepath` is provided. Example, `/workspace-rootname/path/to/file.txt`.
   * When used to upload a file, the parent folders will also be created if they
   * do not exist, for example, in the file path `/path/to/file.txt`, if `/path`
   * and `/to` do not exist, they will be created. The filepath should include
   * the workspace rootname, for example:
   * `/workspace-rootname/folderpath/filepath`.
   *
   * File and folder names are case sensitive, meaning 'MyFileName' will **not**
   * match 'myfilename'.
   *
   * Valid characters are: /[A-Za-z0-9\/._-]/
   */
  filepath?: string;

  /** File ID. `filepath` is optional if `fileId` is provided. */
  fileId?: string;
}

/** @category File */
export interface IGetFileDetailsEndpointParams
  extends IFileMatcher,
    IEndpointParamsBase {}

/** @category File */
export interface IGetFileDetailsEndpointResult extends IEndpointResultBase {
  file: IFile;
}

/** @category File */
export interface IDeleteFileEndpointParams
  extends IFileMatcher,
    IEndpointParamsBase {}

/** @category File */
export interface IGetFileEndpointParams
  extends Required<Pick<IFileMatcher, 'filepath'>>,
    IEndpointParamsBase {
  /** Optional image transformation options. Will be applied if the file is an
   * image. */
  imageTranformation?: IImageTransformationParams;
}

/** @category File */
export interface IGetFileEndpointResult {
  /**
   * [Readable](https://nodejs.org/api/stream.html#class-streamreadable) for
   * Node.js,
   * [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
   * in the browser
   */
  body: NodeJS.ReadableStream | ReadableStream | null;
}

/** @category File */
export interface IUpdateFileDetailsEndpointParams
  extends IFileMatcher,
    IEndpointParamsBase {
  file: IUpdateFileDetailsInput;
}

/** @category File */
export interface IUpdateFileDetailsEndpointResult extends IEndpointResultBase {
  file: IFile;
}

/** @category File */
export interface IUploadFileEndpointParams
  extends Required<Pick<IFileMatcher, 'filepath'>>,
    IEndpointParamsBase {
  description?: string;
  encoding?: string;

  /** File extension. Can be passed separately or included in the filepath, for
   * example, `/path/to/file.txt`. */
  extension?: string;
  mimetype?: string;

  /**
   * [Readable](https://nodejs.org/api/stream.html#class-streamreadable) for
   * Node.js,
   * [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
   * in the browser
   */
  data: Readable | ReadableStream;

  /**
   * Determines the public actions that will be allowed on this file if the
   * operation succeeds.
   */
  publicAccessActions?: UploadFilePublicAccessActions;
}

/** @category File */
export interface IUploadFileEndpointResult extends IEndpointResultBase {
  file: IFile;
}

/** @category File */
export interface IFileEndpoints {
  deleteFile(props: IDeleteFileEndpointParams): Promise<IEndpointResultBase>;

  /** Returns file details without the binary. Call `getFile` to retrieve the
   * file binary. */
  getFileDetails(
    props: IGetFileDetailsEndpointParams
  ): Promise<IGetFileDetailsEndpointResult>;

  /** Updates file details not the binary. Call `uploadFile` on an existing file
   * to update the file binary. */
  updateFileDetails(
    props: IUpdateFileDetailsEndpointParams
  ): Promise<IUpdateFileDetailsEndpointResult>;

  /** Returns the file binary, not the file details. */
  getFile(props: IGetFileEndpointParams): Promise<IGetFileEndpointResult>;

  /** Uploads a new file if the file does not exist, and replaces an existing
   * file if the file does. To update the file details, call
   * `updateFileDetails`. */
  uploadFile(
    props: IUploadFileEndpointParams
  ): Promise<IUploadFileEndpointResult>;
}
