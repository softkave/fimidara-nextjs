import { Button, Dropdown, List, Menu, message, Modal } from "antd";
import React from "react";
import { appClasses } from "../../../utils/theme";
import { useRequest } from "ahooks";
import { SelectInfo } from "../../../utils/types";
import { BsThreeDots } from "react-icons/bs";
import { IAssignedPresetPermissionsGroup } from "../../../../lib/definitions/presets";
import useOrgPermissionGroupList from "../../../../lib/hooks/orgs/useOrgPermissionGroupList";
import { css, cx } from "@emotion/css";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import { indexArray } from "../../../../lib/utilities/indexArray";
import { getFormError } from "../../../form/formUtils";
import { processEndpointError } from "../../../../lib/api/utils";

export interface IAssignedPresetListProps {
  orgId: string;
  presets: IAssignedPresetPermissionsGroup[];
  onRemoveItem: (id: string) => Promise<void>;
}

enum MenuKeys {
  DeleteItem = "delete-item",
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

// TODO: add bulk remove, and add bulk actions to other lists

const AssignedPresetList: React.FC<IAssignedPresetListProps> = (props) => {
  const { orgId, presets, onRemoveItem } = props;
  const { isLoading, error, data } = useOrgPermissionGroupList(orgId);
  const internalOnRemoveItem = React.useCallback(
    async (presetId: string) => {
      try {
        onRemoveItem(presetId);
        message.success("Permission group removed");
      } catch (error: any) {
        message.error(
          getFormError(processEndpointError(error)) ||
            "Error removing permission group"
        );
      }
    },
    [onRemoveItem]
  );

  const deleteItemHelper = useRequest(internalOnRemoveItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: SelectInfo, itemId: string) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to remove this permission group?",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { danger: true },
          onOk: async () => {
            await deleteItemHelper.runAsync(itemId);
          },
          onCancel() {
            // do nothing
          },
        });
      }
    },
    [deleteItemHelper]
  );

  const presetsMap = React.useMemo(() => {
    return indexArray(data?.presets, { path: "resourceId" });
  }, [data?.presets]);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading permission groups..." />;
  } else if (error) {
    return (
      <PageError
        messageText={error?.message || "Error fetching permission groups"}
      />
    );
  }

  const renderMenu = (item: IAssignedPresetPermissionsGroup) => (
    <Dropdown
      disabled={deleteItemHelper.loading}
      trigger={["click"]}
      overlay={
        <Menu
          onSelect={(info) => onSelectMenuItem(info, item.presetId)}
          style={{ minWidth: "150px" }}
        >
          <Menu.Item key={MenuKeys.DeleteItem}>
            Remove Permission Group
          </Menu.Item>
        </Menu>
      }
    >
      <Button
        type="text"
        className={appClasses.iconBtn}
        icon={<BsThreeDots />}
      ></Button>
    </Dropdown>
  );

  return (
    <List
      className={cx(appClasses.main, classes.list)}
      itemLayout="horizontal"
      dataSource={presets}
      renderItem={(item) => {
        const preset = presetsMap[item.presetId];

        if (preset) {
          return (
            <List.Item key={item.presetId} actions={[renderMenu(item)]}>
              <List.Item.Meta title={preset.name} />
            </List.Item>
          );
        }

        return null;
      }}
    />
  );
};

export default AssignedPresetList;
