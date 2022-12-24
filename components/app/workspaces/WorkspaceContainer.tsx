import { Space } from "antd";
import React from "react";
import { SWRConfiguration } from "swr";
import { IWorkspace } from "../../../lib/definitions/workspace";
import useWorkspace from "../../../lib/hooks/workspaces/useWorkspace";
import { getBaseError } from "../../../lib/utils/errors";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import { appClasses } from "../../utils/theme";
import LoggedInHeader from "../LoggedInHeader";

export interface IWorkspaceContainerProps {
  workspaceId: string;
  swrConfig?: SWRConfiguration;
  render?: (workspace: IWorkspace) => React.ReactElement;
}

const WorkspaceContainer: React.FC<IWorkspaceContainerProps> = (props) => {
  const { workspaceId, swrConfig, render, children } = props;
  const { data, error, isLoading } = useWorkspace(workspaceId, swrConfig);
  if (error) {
    return (
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <LoggedInHeader />
        <PageError
          className={appClasses.main}
          messageText={getBaseError(error) || "Error fetching workspace"}
        />
      </Space>
    );
  }

  if (isLoading || !data) {
    return (
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <LoggedInHeader />
        <PageLoading messageText="Loading workspace..." />
      </Space>
    );
  }

  const workspace = data?.workspace!;
  const contentNode = render ? render(workspace) : children;
  return <React.Fragment>{contentNode}</React.Fragment>;
};

export default WorkspaceContainer;
