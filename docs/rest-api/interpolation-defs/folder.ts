import {IFile} from './file';
import {
  AppResourceType,
  BasicCRUDActions,
  IAgent,
  IPublicAccessOp,
  IPublicAccessOpInput,
} from './system';
import {IEndpointParamsBase, IEndpointResultBase} from './types';

/** @category Folder */
export interface IFolder {
  resourceId: string;
  workspaceId: string;
  /** Immediate parent folder ID if present. */
  parentId?: string;

  /**
   * Sorted list of parent folder IDs. 2nd ot the last item is the immediate
   * parent folder if present, and the last will be the folder's own ID.
   * */
  idPath: string[];

  /**
   * Sorted list of parent folder names. 2nd ot the last item is the immediate
   * parent folder if present, and the last will be the folder's own name.
   * */
  namePath: string[];
  createdBy: IAgent;
  createdAt: Date | string;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: Date | string;

  /** Folder name. Folder names are case sensitive, meaning 'MyFolderName' will
   * **not** match 'myfoldername'. */
  name: string;
  description?: string;

  /** A list of public actions that can be performed on the folder, i.e, this
   * list contains the list of actions an unauthorized or unauthenticated agent
   * can perform on the folder. This is useful when you want a folder crawable
   * or it's content accessible by the general internet. */
  publicAccessOps: IPublicAccessOp[];
}

/** @category Folder */
export interface IFolderMatcher {
  /**
   * Folder path. Optional if `folderId` is set. Folder names are case
   * sensitive, meaning 'MyFolderName' will **not** match 'myfoldername'. The
   * folderpath should include the workspace rootname, for example:
   * `/workspace-rootname/folderpath`.
   *
   * Valid characters are: /[A-Za-z0-9\/._-]/
   */
  folderpath?: string;

  /** Folder ID. Optional if `folderpath` is set. */
  folderId?: string;
}

/** @category Folder */
export interface INewFolderInput {
  /**
   * Folder path. Example, `/workspace-rootname/path/to/files`. The parent
   * folders will be created if they do not exist, for example, in the path
   * `/path/to/files`, if the folders `/path`, `/to`, and `/files` do not exist,
   * they will be created. The folderpath should include the workspace
   * rootname, for example: `/workspace-rootname/folderpath`. Folder names are
   * case sensitive, meaning 'MyFolderName' will **not** match 'myfoldername'.
   */
  folderpath: string;
  description?: string;

  /**
   * List of public access actions allowed on this folder and it's children
   * files.
   */
  publicAccessOps?: IPublicAccessOpInput[];
}

/** @category Folder */
export interface IUpdateFolderInput {
  description?: string;

  /**
   * List of public access actions allowed on this folder and it's children
   * files. Will replace existing list of public access actions. Meaning if you
   * want to add a new public access action, you need to pass it with the
   * existing list, and if you want to remove an existing public access action,
   * you need to pass the existing list without the action.
   */
  publicAccessOps?: IPublicAccessOpInput[];
}

/** @category Folder */
export interface IAddFolderEndpointParams extends IEndpointParamsBase {
  folder: INewFolderInput;
}

/** @category Folder */
export interface IAddFolderEndpointResult extends IEndpointResultBase {
  folder: IFolder;
}

/** @category Folder */
export interface IDeleteFolderEndpointParams
  extends IFolderMatcher,
    IEndpointParamsBase {}

/** @category Folder */
export interface IGetFolderEndpointParams
  extends IFolderMatcher,
    IEndpointParamsBase {}

/** @category Folder */
export interface IGetFolderEndpointResult extends IEndpointResultBase {
  folder: IFolder;
}

/** @category Folder */
export interface IListFolderContentEndpointParams
  extends IFolderMatcher,
    IEndpointParamsBase {}

/** @category Folder */
export interface IListFolderContentEndpointResult extends IEndpointResultBase {
  folders: IFolder[];
  files: IFile[];
}

/** @category Folder */
export interface IUpdateFolderEndpointParams
  extends IFolderMatcher,
    IEndpointParamsBase {
  folder: IUpdateFolderInput;
}

/** @category Folder */
export interface IUpdateFolderEndpointResult extends IEndpointResultBase {
  Folder: IFolder;
}

/** @category Folder */
export interface IFolderEndpoints {
  addFolder(props: IAddFolderEndpointParams): Promise<IAddFolderEndpointResult>;
  listFolderContent(
    props: IListFolderContentEndpointParams
  ): Promise<IListFolderContentEndpointResult>;
  getFolder(props: IGetFolderEndpointParams): Promise<IGetFolderEndpointResult>;
  deleteFolder(
    props: IDeleteFolderEndpointParams
  ): Promise<IEndpointResultBase>;
  updateFolder(
    props: IUpdateFolderEndpointParams
  ): Promise<IUpdateFolderEndpointResult>;
}

/**
 * @category File
 * @description
 * Utility functions for making public access op inputs from a list of actions
 **/
export function makePublicAccessOpInputs(
  type: AppResourceType.File | AppResourceType.Folder,
  actions: BasicCRUDActions[] = [
    BasicCRUDActions.Create,
    BasicCRUDActions.Read,
    BasicCRUDActions.Update,
    BasicCRUDActions.Delete,
  ]
): IPublicAccessOpInput[] {
  return actions.map(action => ({
    action,
    resourceType: type,
  }));
}
