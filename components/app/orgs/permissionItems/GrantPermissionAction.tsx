import { Radio, Space, Switch, Typography } from "antd";
import React from "react";

export interface IGrantPermissionActionChange {
  isForPermissionOwnerOnly?: boolean;
}

export interface IGrantPermissionActionProps {
  permitted?: boolean;
  isForOwner?: boolean;
  hasChildren?: boolean;
  disabled?: boolean;
  label: string;
  onChange: (permitted: boolean, change?: IGrantPermissionActionChange) => void;
}

enum RadioKeys {
  ForResourceOnly,
  ForResourceAndChildren,
}

const GrantPermissionAction: React.FC<IGrantPermissionActionProps> = (
  props
) => {
  const { permitted, isForOwner, label, hasChildren, disabled, onChange } =
    props;

  return (
    <Space direction="vertical">
      <div>
        <Typography.Text>{label}</Typography.Text>
        <Switch
          disabled={disabled}
          checked={permitted}
          onChange={(checked) => onChange(checked)}
        />
      </div>
      {hasChildren && (
        <Space>
          <Radio.Group
            onChange={(evt) =>
              onChange(true, {
                isForPermissionOwnerOnly:
                  evt.target.value === RadioKeys.ForResourceOnly ? true : false,
              })
            }
            disabled={disabled || !permitted}
            value={
              isForOwner
                ? RadioKeys.ForResourceOnly
                : RadioKeys.ForResourceAndChildren
            }
          >
            <Radio value={RadioKeys.ForResourceOnly}>For resource only</Radio>
            <Radio value={RadioKeys.ForResourceAndChildren}>
              For resource and children
            </Radio>
          </Radio.Group>
        </Space>
      )}
    </Space>
  );
};

export default GrantPermissionAction;
