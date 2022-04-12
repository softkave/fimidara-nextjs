import { List, Space, Typography } from "antd";
import React from "react";
import { IAssignedPresetPermissionsGroup } from "../../../../lib/definitions/presets";
import useWorkspacePermissionGroupList from "../../../../lib/hooks/workspaces/useWorkspacePermissionGroupList";
import { css, cx } from "@emotion/css";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import { indexArray } from "../../../../lib/utilities/indexArray";
import PageNothingFound from "../../../utils/PageNothingFound";
import { getBaseError } from "../../../../lib/utilities/errors";

export interface IAssignedPresetListProps {
  workspaceId: string;
  presets: IAssignedPresetPermissionsGroup[];
  className?: string;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },

    // "& .ant-list-item": {
    //   padding: "0px !important",
    // },
  }),
  noPresets: css({
    margin: "64px auto !important",
  }),
};

// TODO: add bulk remove, and add bulk actions to other lists

const AssignedPresetList: React.FC<IAssignedPresetListProps> = (props) => {
  const { workspaceId, presets, className } = props;
  const { isLoading, error, data } =
    useWorkspacePermissionGroupList(workspaceId);
  let content: React.ReactNode = null;
  const presetsMap = React.useMemo(() => {
    return indexArray(data?.presets, { path: "resourceId" });
  }, [data?.presets]);

  if (error) {
    content = (
      <PageError
        messageText={getBaseError(error) || "Error fetching permission groups"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading permission groups..." />;
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
              <List.Item key={item.presetId}>
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
    <Space
      direction="vertical"
      size={"small"}
      style={{ width: "100%" }}
      className={className}
    >
      <Typography.Title level={5} style={{ margin: 0 }}>
        Assigned Permission Groups
      </Typography.Title>
      {content}
    </Space>
  );
};

export default AssignedPresetList;
