import { css } from "@emotion/css";
import { Radio, Space, Switch, Typography } from "antd";
import React from "react";

export interface IGrantPermissionActionChange {
  isForPermissionContainerOnly?: boolean;
}

export interface IGrantPermissionActionProps {
  permitted?: boolean;
  isForContainer?: boolean;
  hasChildren?: boolean;
  disabled?: boolean;
  label: string;
  onChange: (permitted: boolean, change?: IGrantPermissionActionChange) => void;
}

enum RadioKeys {
  ForResourceOnly,
  ForResourceAndChildren,
}

const classes = {
  labelRoot: css({ display: "flex" }),
  label: css({ flex: 1, textTransform: "capitalize" }),
};

const GrantPermissionAction: React.FC<IGrantPermissionActionProps> = (
  props
) => {
  const { permitted, isForContainer, label, hasChildren, disabled, onChange } =
    props;

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <div className={classes.labelRoot}>
        <Typography.Text className={classes.label}>{label}</Typography.Text>
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
                isForPermissionContainerOnly:
                  evt.target.value === RadioKeys.ForResourceOnly ? true : false,
              })
            }
            disabled={disabled || !permitted}
            value={
              isForContainer
                ? RadioKeys.ForResourceOnly
                : RadioKeys.ForResourceAndChildren
            }
          >
            <Radio value={RadioKeys.ForResourceOnly}>For folder only</Radio>
            <Radio value={RadioKeys.ForResourceAndChildren}>
              For folder and children folders
            </Radio>
          </Radio.Group>
        </Space>
      )}
    </Space>
  );
};

export default GrantPermissionAction;
