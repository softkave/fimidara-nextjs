import { Button, List, message, Modal, Space, Typography } from "antd";
import React from "react";
import { appClasses } from "../../../utils/theme";
import { useRequest } from "ahooks";
import { IAssignedPresetPermissionsGroup } from "../../../../lib/definitions/presets";
import useOrgPermissionGroupList from "../../../../lib/hooks/orgs/useOrgPermissionGroupList";
import { css, cx } from "@emotion/css";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import { indexArray } from "../../../../lib/utilities/indexArray";
import { getFormError } from "../../../form/formUtils";
import { processEndpointError } from "../../../../lib/api/utils";
import PageNothingFound from "../../../utils/PageNothingFound";
import { DeleteOutlined } from "@ant-design/icons";

export interface IAssignedPresetListProps {
  orgId: string;
  presets: IAssignedPresetPermissionsGroup[];
  onRemoveItem: (id: string) => Promise<void>;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },

    "& .ant-list-item": {
      padding: "0px !important",
    },
  }),
  noPresets: css({
    margin: "64px auto !important",
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
    (itemId: string) => {
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
    },
    [deleteItemHelper]
  );

  let content: React.ReactNode = null;
  const presetsMap = React.useMemo(() => {
    return indexArray(data?.presets, { path: "resourceId" });
  }, [data?.presets]);

  if (isLoading || !data) {
    content = <PageLoading messageText="Loading permission groups..." />;
  } else if (error) {
    content = (
      <PageError
        messageText={error?.message || "Error fetching permission groups"}
      />
    );
  } else if (presets.length === 0) {
    content = (
      <PageNothingFound
        messageText="No assigned presets yet"
        className={classes.noPresets}
      />
    );
  } else {
    content = (
      <List
        className={cx(classes.list)}
        itemLayout="horizontal"
        dataSource={presets}
        renderItem={(item) => {
          const preset = presetsMap[item.presetId];

          if (preset) {
            return (
              <List.Item
                key={item.presetId}
                actions={[
                  <Button
                    type="text"
                    className={appClasses.iconBtn}
                    icon={<DeleteOutlined />}
                    onClick={() => onSelectMenuItem(item.presetId)}
                  ></Button>,
                ]}
              >
                <List.Item.Meta title={preset.name} />
              </List.Item>
            );
          }

          return null;
        }}
      />
    );
  }

  return (
    <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
      <Typography.Title level={5} style={{ margin: 0 }}>
        Assigned Permission Groups
      </Typography.Title>
      {content}
    </Space>
  );
};

export default AssignedPresetList;
