import { GetServerSideProps } from "next";
import React from "react";
import FileComponent from "../../../../../../components/app/orgs/files/FileComponent";
import FileContainer from "../../../../../../components/app/orgs/files/FileContainer";
import Organization from "../../../../../../components/app/orgs/Organization";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import { IFile } from "../../../../../../lib/definitions/file";
import { appOrgPaths } from "../../../../../../lib/definitions/system";

export type IFilePageProps = {
  orgId: string;
  fileId: string;
};

const FilePage: React.FC<IFilePageProps> = (props) => {
  const { orgId, fileId } = props;
  const renderFile = React.useCallback(
    (file: IFile) => {
      return <FileComponent file={file} />;
    },
    [orgId]
  );

  return (
    <Organization orgId={orgId} activeKey={appOrgPaths.rootFolderList(orgId)}>
      <FileContainer fileId={fileId} orgId={orgId} render={renderFile} />
    </Organization>
  );
};

export default withPageAuthRequired(FilePage);

export const getServerSideProps: GetServerSideProps<
  IFilePageProps,
  IFilePageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      fileId: context.params!.fileId,
    },
  };
};
