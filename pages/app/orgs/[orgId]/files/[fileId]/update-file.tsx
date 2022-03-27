import { GetServerSideProps } from "next";
import React from "react";
import { SWRConfiguration } from "swr";
import FileContainer from "../../../../../../components/app/orgs/files/FileContainer";
import FileForm from "../../../../../../components/app/orgs/files/FileForm";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { IFile } from "../../../../../../lib/definitions/file";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type IUpdateFileFormPageProps = {
  orgId: string;
  fileId: string;
};

const swrConfig: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const UpdateFileFormPage: React.FC<IUpdateFileFormPageProps> = (props) => {
  const { orgId, fileId } = props;
  const renderForm = React.useCallback(
    (file: IFile) => {
      return <FileForm orgId={orgId} file={file} />;
    },
    [orgId]
  );

  return (
    <Organization
      orgId={orgId}
      activeKey={appOrgPaths.rootFolderList(orgId)}
      swrConfig={swrConfig}
    >
      <FileContainer
        fileId={fileId}
        orgId={orgId}
        render={renderForm}
        swrConfig={swrConfig}
      />
      ;
    </Organization>
  );
};

export default withPageAuthRequired(UpdateFileFormPage, { swrConfig });

export const getServerSideProps: GetServerSideProps<
  IUpdateFileFormPageProps,
  IUpdateFileFormPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      fileId: context.params!.fileId,
    },
  };
};
