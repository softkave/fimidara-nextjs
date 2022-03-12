import { CloseCircleFilled, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, List, Select, Space, Typography } from "antd";
import React from "react";
import { IPresetInput } from "../../../../lib/definitions/presets";
import useOrgPermissionGroupList from "../../../../lib/hooks/orgs/useOrgPermissionGroupList";
import { indexArray } from "../../../../lib/utilities/indexArray";
import InlineError from "../../../utils/InlineError";
import InlineLoading from "../../../utils/InlineLoading";
import { appClasses } from "../../../utils/theme";

export interface ISelectPresetInputProps {
  disabled?: boolean;
  orgId: string;
  value: IPresetInput[];
  onChange: (value: IPresetInput[]) => void;
}

function reorderItems(items: IPresetInput[]) {
  return items.map((item, index) => ({ ...item, order: index }));
}

const SelectPresetInput: React.FC<ISelectPresetInputProps> = (props) => {
  const { orgId, value, disabled, onChange } = props;
  const { isLoading, error, data, mutate } = useOrgPermissionGroupList(orgId);
  const onDeleteItem = React.useCallback(
    (id: string) => {
      const newValue = value.filter((item) => item.presetId !== id);
      onChange(reorderItems(newValue));
    },
    [value, onChange]
  );

  const onMove = React.useCallback(
    (id: string, side: "up" | "down") => {
      const index = value.findIndex((item) => item.presetId === id);

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
      const newValue = [...value, { presetId: id, order: value.length }];
      onChange(reorderItems(newValue));
    },
    [value, onChange]
  );

  if (isLoading || !data) {
    return <InlineLoading messageText="Loading permission groups..." />;
  } else if (error) {
    return (
      <InlineError
        messageText={error?.message || "Error fetching permission groups"}
        reload={() => mutate(undefined, true)}
      />
    );
  }

  const presetsMap = React.useMemo(
    () => indexArray(data.presets, { path: "resourceId" }),
    [data]
  );

  const assignedPresets = value.filter((item) => !!presetsMap[item.presetId]);
  const valueNode = (
    <List
      itemLayout="horizontal"
      dataSource={assignedPresets}
      renderItem={(item) => {
        const preset = presetsMap[item.presetId];
        return (
          <List.Item
            key={item.presetId}
            actions={[
              <Button
                type="text"
                className={appClasses.iconBtn}
                icon={<UpOutlined />}
                onClick={() => onMove(item.presetId, "up")}
              />,
              <Button
                type="text"
                className={appClasses.iconBtn}
                icon={<DownOutlined />}
                onClick={() => onMove(item.presetId, "down")}
              />,
              <Button
                type="text"
                className={appClasses.iconBtn}
                icon={<CloseCircleFilled />}
                onClick={() => onDeleteItem(item.presetId)}
              />,
            ]}
          >
            <List.Item.Meta
              title={preset.name}
              description={preset.description}
            />
          </List.Item>
        );
      }}
    />
  );

  return (
    <Select
      showSearch
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Select preset..."
      maxTagCount="responsive"
      disabled={disabled}
      optionLabelProp="label"
      value={value.map((item) => item.presetId) as any}
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
    >
      {data.presets.map((item) => (
        <Select.Option
          key={item.resourceId}
          label={item.name}
          value={item.resourceId}
        >
          <Space direction="vertical">
            <Typography.Text>{item.name}</Typography.Text>
            <Typography.Text>{item.description}</Typography.Text>
          </Space>
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectPresetInput;
