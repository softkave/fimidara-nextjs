import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import SummedUsageRecordListContainer from "@/components/app/workspaces/usageRecords/SummedUsageRecordListContainer";
import { getWorkspaceServerSideProps } from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

export interface IWorkspaceUsageRecordsPageProps {
  workspaceId: string;
}

const WorkspaceUsageRecordsPage: React.FC<IWorkspaceUsageRecordsPageProps> = (
  props
) => {
  const { workspaceId } = props;
  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => (
        <SummedUsageRecordListContainer workspace={workspace} />
      )}
    />
  );
};

export default withPageAuthRequiredHOC(WorkspaceUsageRecordsPage);
export const getServerSideProps = getWorkspaceServerSideProps;
