"use client";

import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import SummedUsageRecordListContainer from "@/components/app/workspaces/usageRecords/SummedUsageRecordListContainer";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import React from "react";

export interface IWorkspaceUsageRecordsPageProps
  extends IWorkspaceComponentProps {}

const WorkspaceUsageRecordsPage: React.FC<IWorkspaceUsageRecordsPageProps> = (
  props
) => {
  const { workspaceId } = props.params;
  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => (
        <SummedUsageRecordListContainer workspace={workspace} />
      )}
    />
  );
};

export default WorkspaceUsageRecordsPage;
