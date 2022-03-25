import { GetServerSideProps } from "next";
import React from "react";
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

const UpdateFileFormPage: React.FC<IUpdateFileFormPageProps> = (props) => {
  const { orgId, fileId } = props;
  const renderForm = React.useCallback(
    (file: IFile) => {
      return <FileForm orgId={orgId} file={file} />;
    },
    [orgId]
  );

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FileContainer fileId={fileId} orgId={orgId} render={renderForm} />;
    </Organization>
  );
};

export default withPageAuthRequired(UpdateFileFormPage);

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
