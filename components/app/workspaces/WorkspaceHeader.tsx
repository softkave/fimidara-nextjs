import { appWorkspacePaths } from "@/lib/definitions/system";
import { IWorkspace } from "@/lib/definitions/workspace";
import { useWorkspaceDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { LeftOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Dropdown, MenuProps, Modal, Space, Typography, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useGrantPermission from "../../hooks/useGrantPermission";
import IconButton from "../../utils/buttons/IconButton";
import { errorMessageNotificatition } from "../../utils/errorHandling";
import { appClasses } from "../../utils/theme";
import { MenuInfo } from "../../utils/types";
import WorkspaceAvatar from "./WorkspaceAvatar";

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
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId: workspace.resourceId,
    targetType: "workspace",
    containerId: workspace.resourceId,
    containerType: "workspace",
    targetId: workspace.resourceId,
    appliesTo: "self",
  });

  const onGoBack = React.useCallback(() => {
    router.push(appWorkspacePaths.workspaces);
  }, [router]);

  const deleteHook = useWorkspaceDeleteMutationHook({
    onSuccess(data, params) {
      message.success("Workspace scheduled for deletion.");
      router.push(appWorkspacePaths.workspaces);
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error deleting workspace.");
    },
  });

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
            await deleteHook.runAsync({
              body: { workspaceId: workspace.resourceId },
            });
          },
          onCancel() {
            // do nothing
          },
        });
      } else if (info.key === MenuKeys.GrantPermission) {
        toggleVisibility();
      }
    },
    [toggleVisibility, deleteHook]
  );

  const editWorkspacePath = appWorkspacePaths.updateWorkspaceForm(
    workspace.resourceId
  );
  const items: MenuProps["items"] = [
    {
      key: editWorkspacePath,
      label: <Link href={editWorkspacePath}>Update Workspace</Link>,
    },
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
    {
      key: MenuKeys.DeleteWorkspace,
      label: "Delete Workspace",
    },
  ];

  return (
    <div className={classes.root}>
      {grantPermissionFormNode}
      <IconButton icon={<LeftOutlined />} onClick={onGoBack} />
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
        disabled={deleteHook.loading}
        trigger={["click"]}
        menu={{
          items,
          style: { minWidth: "150px" },
          onClick: onSelectMenuItem,
        }}
      >
        <IconButton className={appClasses.iconBtn} icon={<BsThreeDots />} />
      </Dropdown>
    </div>
  );
};

export default WorkspaceHeader;
