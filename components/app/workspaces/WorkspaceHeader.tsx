import { LeftOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, Dropdown, Menu, Modal, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSWRConfig } from "swr";
import WorkspaceAPI from "../../../lib/api/endpoints/workspace";
import { checkEndpointResult } from "../../../lib/api/utils";
import { IWorkspace } from "../../../lib/definitions/workspace";
import {
  appWorkspacePaths,
  AppResourceType,
} from "../../../lib/definitions/system";
import { getUseWorkspaceHookKey } from "../../../lib/hooks/workspaces/useWorkspace";
import { MenuInfo } from "../../utils/types";
import WorkspaceAvatar from "./WorkspaceAvatar";
import { BsThreeDots } from "react-icons/bs";
import { appClasses } from "../../utils/theme";
import useGrantPermission from "../../hooks/useGrantPermission";
import { PermissionItemAppliesTo } from "../../../lib/definitions/permissionItem";

export interface IWorkspaceHeaderProps {
  workspace: IWorkspace;
}

export enum MenuKeys {
  DeleteWorkspace = "delete-workspace",
  GrantPermission = "grant-permission",
}

const classes = {
  root: css({
    display: "flex",
    padding: "16px",
    width: "100%",
  }),
  name: css({
    flex: 1,
    margin: "0 16px",
  }),
};

const WorkspaceHeader: React.FC<IWorkspaceHeaderProps> = (props) => {
  const { workspace } = props;
  const router = useRouter();
  const { cache } = useSWRConfig();
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId: workspace.resourceId,
    itemResourceType: AppResourceType.Workspace,
    permissionOwnerId: workspace.resourceId,
    permissionOwnerType: AppResourceType.Workspace,
    itemResourceId: workspace.resourceId,
    appliesTo: PermissionItemAppliesTo.Owner,
  });

  const onGoBack = React.useCallback(() => {
    router.push(appWorkspacePaths.workspaces);
  }, [router]);

  const deleteWorkspace = React.useCallback(async () => {
    const result = await WorkspaceAPI.deleteWorkspace({
      workspaceId: workspace.resourceId,
    });

    checkEndpointResult(result);
    router.push(appWorkspacePaths.workspaces);

    // TODO: delete all cache keys
    cache.delete(getUseWorkspaceHookKey(workspace.resourceId));
  }, [workspace, router, cache]);

  const deleteWorkspaceHelper = useRequest(deleteWorkspace, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
      if (info.key === MenuKeys.DeleteWorkspace) {
        Modal.confirm({
          title: "Are you sure you want to delete this workspace?",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { danger: true },
          onOk: async () => {
            await deleteWorkspaceHelper.runAsync();
          },
          onCancel() {
            // do nothing
          },
        });
      } else if (info.key === MenuKeys.GrantPermission) {
        toggleVisibility();
      }
    },
    [toggleVisibility, deleteWorkspaceHelper]
  );

  const editWorkspacePath = appWorkspacePaths.editWorkspaceForm(
    workspace.resourceId
  );
  return (
    <div className={classes.root}>
      {grantPermissionFormNode}
      <Button icon={<LeftOutlined />} onClick={onGoBack} />
      <Space className={classes.name}>
        <WorkspaceAvatar
          workspaceId={workspace.resourceId}
          alt={`${workspace.name} avatar`}
        />
        <Typography.Title ellipsis level={5} style={{ margin: 0 }}>
          {workspace.name}
        </Typography.Title>
      </Space>
      <Dropdown
        disabled={deleteWorkspaceHelper.loading}
        trigger={["click"]}
        overlay={
          <Menu onClick={onSelectMenuItem} style={{ minWidth: "150px" }}>
            <Menu.Item key={editWorkspacePath}>
              <Link href={editWorkspacePath}>Edit</Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Permission
            </Menu.Item>
            <Menu.Divider key={"divider-02"} />
            <Menu.Item key={MenuKeys.DeleteWorkspace}>Delete</Menu.Item>
          </Menu>
        }
      >
        <Button
          className={appClasses.iconBtn}
          // type="text"
          icon={<BsThreeDots />}
        ></Button>
      </Dropdown>
    </div>
  );
};

export default WorkspaceHeader;
