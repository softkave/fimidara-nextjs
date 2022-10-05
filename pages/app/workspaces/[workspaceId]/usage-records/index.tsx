import React from "react";
import SummedUsageRecordListContainer from "../../../../../components/app/workspaces/usageRecords/SummedUsageRecordListContainer";
import { getWorkspaceServerSideProps } from "../../../../../components/app/workspaces/utils";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

export interface IWorkspaceUsageRecordsPageProps {
  workspaceId: string;
}

const WorkspaceUsageRecordsPage: React.FC<IWorkspaceUsageRecordsPageProps> = (
  props
) => {
  const { workspaceId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.usageRecordList(workspaceId)}
      render={(workspace) => (
        <SummedUsageRecordListContainer workspace={workspace} />
      )}
    />
  );
};

export default withPageAuthRequiredHOC(WorkspaceUsageRecordsPage);
export const getServerSideProps = getWorkspaceServerSideProps;
