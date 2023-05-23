import InlineError from "@/components/utils/page/InlineError";
import InlineLoading from "@/components/utils/page/InlineLoading";
import PagePagination from "@/components/utils/page/PagePagination";
import { appClasses } from "@/components/utils/theme";
import { IPermissionGroupInput } from "@/lib/definitions/permissionGroups";
import usePagination from "@/lib/hooks/usePagination";
import useWorkspacePermissionGroupList from "@/lib/hooks/workspaces/useWorkspacePermissionGroupList";
import { indexArray } from "@/lib/utils/indexArray";
import { DeleteOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Divider, List, Select, Space, Typography } from "antd";
import React from "react";

export interface ISelectPermissionGroupInputProps {
  disabled?: boolean;
  workspaceId: string;
  value: IPermissionGroupInput[];
  onChange: (value: IPermissionGroupInput[]) => void;
}

function reorderItems(items: IPermissionGroupInput[]) {
  return items.map((item, index) => ({ ...item, order: index }));
}

const SelectPermissionGroupInput: React.FC<ISelectPermissionGroupInputProps> = (
  props
) => {
  const { workspaceId, value, disabled, onChange } = props;
  const pagination = usePagination();
  const { data, error, isLoading, count, mutate } =
    useWorkspacePermissionGroupList({
      workspaceId,
      page: pagination.page,
      pageSize: pagination.pageSize,
    });

  const onDeleteItem = React.useCallback(
    (id: string) => {
      const newValue = value.filter((item) => item.permissionGroupId !== id);
      onChange(reorderItems(newValue));
    },
    [value, onChange]
  );

  const onMove = React.useCallback(
    (id: string, side: "up" | "down") => {
      const index = value.findIndex((item) => item.permissionGroupId === id);
      if (index === -1) {
        return;
      }

      const newIndex = side === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= value.length) {
        return;
      }

      const newValue = [...value];
      const item = newValue[index];
      newValue[index] = newValue[newIndex];
      newValue[newIndex] = item;
      onChange(reorderItems(newValue));
    },
    [value, onChange]
  );

  const onAddItem = React.useCallback(
    (id: string) => {
      const newValue = [
        ...value,
        { permissionGroupId: id, order: value.length },
      ];
      onChange(reorderItems(newValue));
    },
    [value, onChange]
  );

  const permissionGroupsMap = React.useMemo(
    () => indexArray(data?.permissionGroups, { path: "resourceId" }),
    [data]
  );

  const assignedPermissionGroups = React.useMemo(() => {
    return value
      .filter((item) => !!permissionGroupsMap[item.permissionGroupId])
      .sort((a, b) => a.order - b.order);
  }, [value, permissionGroupsMap]);

  if (isLoading || !data) {
    return <InlineLoading message="Loading permission groups..." />;
  } else if (error) {
    return (
      <InlineError
        message={error?.message || "Error fetching permission groups."}
        reload={() => mutate(undefined, true)}
      />
    );
  }

  const assignedPermissionGroupsNode = assignedPermissionGroups.length > 0 && (
    <List
      itemLayout="horizontal"
      dataSource={assignedPermissionGroups}
      renderItem={(item, index) => {
        const permissionGroup = permissionGroupsMap[item.permissionGroupId];
        return (
          <List.Item
            key={item.permissionGroupId}
            actions={[
              <Button
                key="up"
                className={appClasses.iconBtn}
                icon={<UpOutlined />}
                onClick={() => onMove(item.permissionGroupId, "up")}
                disabled={index === 0}
              />,
              <Button
                key={"down"}
                className={appClasses.iconBtn}
                icon={<DownOutlined />}
                onClick={() => onMove(item.permissionGroupId, "down")}
                disabled={index === assignedPermissionGroups.length - 1}
              />,
              <Button
                key="delete"
                className={appClasses.iconBtn}
                icon={<DeleteOutlined />}
                onClick={() => onDeleteItem(item.permissionGroupId)}
              />,
            ]}
          >
            <List.Item.Meta
              title={permissionGroup.name}
              description={permissionGroup.description}
            />
          </List.Item>
        );
      }}
    />
  );

  const selectNode = (
    <Select
      showSearch
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Select permission group..."
      maxTagCount="responsive"
      disabled={disabled}
      optionLabelProp="label"
      value={value.map((item) => item.permissionGroupId) as any}
      onSelect={onAddItem}
      optionFilterProp="label"
      filterOption={(input, option) => {
        const label = option?.label as string;
        return label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
      filterSort={(optionA, optionB) => {
        const label01 = optionA?.label as string;
        const label02 = optionB?.label as string;
        return label01.toLowerCase().localeCompare(label02.toLowerCase());
      }}
      dropdownRender={(menu) => (
        <React.Fragment>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          {count ? (
            <PagePagination count={count.count} {...pagination} />
          ) : null}
        </React.Fragment>
      )}
    >
      {data.permissionGroups.map((item) => (
        <Select.Option
          key={item.resourceId}
          label={item.name}
          value={item.resourceId}
        >
          <Space direction="vertical">
            <Typography.Text>{item.name}</Typography.Text>
            <Typography.Text type="secondary">
              {item.description}
            </Typography.Text>
          </Space>
        </Select.Option>
      ))}
    </Select>
  );

  return (
    <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
      {assignedPermissionGroupsNode}
      {selectNode}
    </Space>
  );
};

export default SelectPermissionGroupInput;
