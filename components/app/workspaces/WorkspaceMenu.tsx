import IconButton from "@/components/utils/buttons/IconButton";
import { appClasses } from "@/components/utils/theme";
import { MenuInfo } from "@/components/utils/types";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { Dropdown, MenuProps, Modal } from "antd";
import { Workspace } from "fimidara";
import { compact } from "lodash";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useTargetGrantPermissionModal from "../../hooks/useTargetGrantPermissionModal";

export interface WorkspaceMenuProps {
  workspace: Workspace;
  includeDeleteMenuOption?: boolean;
  onCompleteDelete: () => any;
}

enum MenuKeys {
  UpdateWorkspace = "update",
  DeleteWorkspace = "delete",
  GrantPermission = "grant-permission",
}

const WorkspaceMenu: React.FC<WorkspaceMenuProps> = (props) => {
  const { workspace, includeDeleteMenuOption, onCompleteDelete } = props;
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId: workspace.workspaceId,
    targetId: workspace.resourceId,
    targetType: "workspace",
  });
  // const deleteHook = useWorkspaceDeleteMutationHook({
  //   onSuccess(data, params) {
  //     message.success("Workspace scheduled for deletion");
  //     onCompleteDelete();
  //   },
  //   onError(e, params) {
  //     errorMessageNotificatition(e, "Error deleting workspace");
  //   },
  // });

  const onSelectMenuItem = (info: MenuInfo) => {
    if (info.key === MenuKeys.DeleteWorkspace) {
      Modal.confirm({
        title: "Are you sure you want to delete this workspace?",
        okText: "Yes",
        cancelText: "No",
        okType: "primary",
        okButtonProps: { danger: true },
        onOk: async () => {
          // not implemented yet
        },
        onCancel() {
          // do nothing
        },
      });
    } else if (info.key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    }
  };

  const items: MenuProps["items"] = insertAntdMenuDivider(
    compact([
      {
        // TODO: only show if user has permission
        key: MenuKeys.UpdateWorkspace,
        label: (
          <Link
            href={appWorkspacePaths.updateWorkspaceForm(workspace.workspaceId)}
          >
            Update Workspace
          </Link>
        ),
      },
      {
        key: MenuKeys.GrantPermission,
        label: "Permissions",
      },
    ])
  );

  return (
    <React.Fragment>
      <Dropdown
        trigger={["click"]}
        menu={{
          items,
          style: { minWidth: "150px" },
          onClick: onSelectMenuItem,
        }}
        placement="bottomRight"
      >
        <IconButton className={appClasses.iconBtn} icon={<BsThreeDots />} />
      </Dropdown>{" "}
      {permissionsHook.node}
    </React.Fragment>
  );
};

export default WorkspaceMenu;
