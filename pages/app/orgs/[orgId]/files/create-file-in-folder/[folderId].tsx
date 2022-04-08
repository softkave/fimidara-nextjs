import { GetServerSideProps } from "next";
import React from "react";
import { SWRConfiguration } from "swr";
import FileForm from "../../../../../../components/app/orgs/files/FileForm";
import FolderContainer from "../../../../../../components/app/orgs/files/FolderContainer";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import {
  folderConstants,
  IFolder,
} from "../../../../../../lib/definitions/folder";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type ICreateFileInFolderParentFormPageProps = {
  orgId: string;
  folderId: string;
};

const swrConfig: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const CreateFileInFolderParentFormPage: React.FC<
  ICreateFileInFolderParentFormPageProps
> = (props) => {
  const { orgId, folderId } = props;
  const renderForm = React.useCallback((folder: IFolder) => {
    return (
      <FileForm
        orgId={orgId}
        folderId={folderId}
        folderpath={folder.namePath.join(folderConstants.nameSeparator)}
        key="file-form"
      />
    );
  }, []);

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FolderContainer
        folderId={folderId}
        orgId={orgId}
        render={renderForm}
        fetchConfig={swrConfig}
      />
    </Organization>
  );
};

export default withPageAuthRequired(CreateFileInFolderParentFormPage, {
  swrConfig,
});

export const getServerSideProps: GetServerSideProps<
  ICreateFileInFolderParentFormPageProps,
  ICreateFileInFolderParentFormPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      folderId: context.params!.folderId,
    },
  };
};
