import { Divider, Space } from "antd";
import { NextPage } from "next";
import WorkspaceForm from "../../../../components/app/workspaces/WorkspaceForm";
import WorkspaceHeader from "../../../../components/app/workspaces/WorkspaceHeader";
import UploadWorkspaceAvatar from "../../../../components/app/workspaces/UploadWorkspaceAvatar";
import { getWorkspaceServerSideProps } from "../../../../components/app/workspaces/utils";
import withPageAuthRequired from "../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../components/utils/PageError";
import PageLoading from "../../../../components/utils/PageLoading";
import { appClasses } from "../../../../components/utils/theme";
import useWorkspace from "../../../../lib/hooks/workspaces/useWorkspace";
import { getBaseError } from "../../../../lib/utilities/errors";

interface IEditWorkspacePageProps {
  workspaceId: string;
}

const EditWorkspacePage: NextPage<IEditWorkspacePageProps> = (props) => {
  const { workspaceId } = props;
  const { isLoading, error, data } = useWorkspace(workspaceId);

  if (error) {
    return (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching workspace"}
      />
    );
  } else if (isLoading || !data) {
    return <PageLoading messageText="Loading workspace..." />;
  }

  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <WorkspaceHeader workspace={data.workspace} />
      <UploadWorkspaceAvatar workspaceId={data.workspace.resourceId} />
      <Divider orientation="left">Workspace Details</Divider>
      <WorkspaceForm workspace={data.workspace} />
    </Space>
  );
};

export default withPageAuthRequired(EditWorkspacePage);
export const getServerSideProps = getWorkspaceServerSideProps;