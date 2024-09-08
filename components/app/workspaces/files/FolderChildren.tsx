import { useFileForm } from "@/components/hooks/useFileForm.tsx";
import { useFolderForm } from "@/components/hooks/useFolderForm.tsx";
import PageContent02 from "@/components/utils/page/PageContent02.tsx";
import PaginatedContent from "@/components/utils/page/PaginatedContent.tsx";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import {
  useWorkspaceFilesFetchHook,
  useWorkspaceFoldersFetchHook,
} from "@/lib/hooks/fetchHooks.ts";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils.tsx";
import usePagination from "@/lib/hooks/usePagination.ts";
import { fimidaraAddRootnameToPath, Folder } from "fimidara";
import { ReactNode } from "react";
import AppFileList from "./AppFileList.tsx";
import FileListContainerHeader from "./FileListContainerHeader";
import FolderList from "./FolderList.tsx";
import FolderParentLink from "./FolderParentLink";

export interface FolderChildrenProps extends StyleableComponentProps {
  folder?: Folder;
  workspaceId: string;
  workspaceRootname: string;
}

const useFolders = (workspaceRootname: string, folder?: Folder) => {
  const pagination = usePagination();
  const { fetchState } = useWorkspaceFoldersFetchHook({
    page: pagination.page,
    pageSize: pagination?.pageSize,
    folderId: folder?.resourceId,
    folderpath: folder
      ? fimidaraAddRootnameToPath(folder.namepath, workspaceRootname).join("/")
      : workspaceRootname,
  });

  return { pagination, ...useFetchPaginatedResourceListFetchState(fetchState) };
};

const useFiles = (workspaceRootname: string, folder?: Folder) => {
  const pagination = usePagination();
  const filesHook = useWorkspaceFilesFetchHook({
    page: pagination.page,
    pageSize: pagination?.pageSize,
    folderId: folder?.resourceId,
    folderpath: folder
      ? fimidaraAddRootnameToPath(folder.namepath, workspaceRootname).join("/")
      : workspaceRootname,
  });

  return {
    pagination,
    ...useFetchPaginatedResourceListFetchState(filesHook.fetchState),
  };
};

function FolderChildren(props: FolderChildrenProps) {
  const { folder, workspaceRootname, workspaceId, style, className } = props;

  const fileFormHook = useFileForm({ workspaceId, workspaceRootname });
  const folderFormHook = useFolderForm({ workspaceId, workspaceRootname });

  const foldersHook = useFolders(workspaceRootname, folder);
  const filesHook = useFiles(workspaceRootname, folder);
  const isInitialLoad = !foldersHook.isDataFetched && !filesHook.isDataFetched;
  const hasContent =
    foldersHook.resourceList.length || filesHook.resourceList.length;

  let foldersNode: ReactNode = null;
  let filesNode: ReactNode = null;

  const renderFolders = () => (
    <PaginatedContent
      content={
        <PageContent02
          error={foldersHook.error}
          isLoading={foldersHook.isLoading}
          isDataFetched={foldersHook.isDataFetched}
          data={foldersHook.resourceList}
          defaultErrorMessage="Error fetching folders"
          defaultLoadingMessage="Loading folders..."
          render={(data) => (
            <FolderList folders={data} workspaceRootname={workspaceRootname} />
          )}
        />
      }
      pagination={{ ...foldersHook.pagination, count: foldersHook.count }}
    />
  );

  const renderFiles = () => (
    <PaginatedContent
      content={
        <PageContent02
          error={filesHook.error}
          isLoading={filesHook.isLoading}
          isDataFetched={filesHook.isDataFetched}
          data={filesHook.resourceList}
          defaultErrorMessage="Error fetching files"
          defaultLoadingMessage="Loading files..."
          render={(data) => (
            <AppFileList files={data} workspaceRootname={workspaceRootname} />
          )}
        />
      }
      pagination={{ ...filesHook.pagination, count: filesHook.count }}
    />
  );

  if (isInitialLoad) {
    foldersNode = renderFolders();
  } else if (hasContent) {
    if (foldersHook.resourceList.length) {
      foldersNode = renderFolders();
    }

    if (filesHook.resourceList.length) {
      filesNode = renderFiles();
    }
  } else {
    foldersNode = renderFolders();
    filesNode = renderFiles();
  }

  return (
    <div style={style} className={className}>
      <FileListContainerHeader
        workspaceId={workspaceId}
        folder={folder}
        workspaceRootname={workspaceRootname}
        className="mb-4"
        onBeginCreateFile={() => fileFormHook.setFormOpen(true)}
        onBeginCreateFolder={() => folderFormHook.setFormOpen(true)}
      />
      <div className="space-y-8">
        <FolderParentLink workspaceId={workspaceId} folder={folder}>
          <span style={{ fontSize: "24px" }}>..</span>
        </FolderParentLink>
        {foldersNode}
        {filesNode}
      </div>
      {fileFormHook.node}
      {folderFormHook.node}
    </div>
  );
}

export default FolderChildren;
