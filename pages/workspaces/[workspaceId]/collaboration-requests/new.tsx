import RequestForm from "@/components/app/workspaces/requests/RequestForm";
import {
  IWorkspaceComponentProps,
  getWorkspaceServerSideProps,
} from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

const WorkspaceCreateRequestFormPage: React.FC<IWorkspaceComponentProps> = (
  props
) => {
  const { workspaceId } = props;

  return <RequestForm workspaceId={workspaceId} />;
};

export default withPageAuthRequiredHOC(WorkspaceCreateRequestFormPage);
export const getServerSideProps = getWorkspaceServerSideProps;
