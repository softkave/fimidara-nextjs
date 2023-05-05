import UploadWorkspaceAvatar from "@/components/app/workspaces/UploadWorkspaceAvatar";
import WorkspaceForm from "@/components/app/workspaces/WorkspaceForm";
import { getWorkspaceServerSideProps } from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { Divider, Space } from "antd";
import { NextPage } from "next";
import WorkspaceContainer from "../../../components/app/workspaces/WorkspaceContainer";

interface IEditWorkspacePageProps {
  workspaceId: string;
}

const EditWorkspacePage: NextPage<IEditWorkspacePageProps> = (props) => {
  const { workspaceId } = props;

  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => (
        <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
          <UploadWorkspaceAvatar workspaceId={workspace.resourceId} />
          <Divider orientation="left">Workspace Details</Divider>
          <WorkspaceForm workspace={workspace} />
        </Space>
      )}
    />
  );
};

export default withPageAuthRequiredHOC(EditWorkspacePage);
export const getServerSideProps = getWorkspaceServerSideProps;
