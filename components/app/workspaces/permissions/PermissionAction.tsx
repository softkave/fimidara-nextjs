import { QuestionCircleOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Space, Switch, Tooltip } from "antd";
import Text from "antd/es/typography/Text";
import React from "react";
import { PermissionMapItemInfo } from "./types";

export interface PermissionActionInfo extends PermissionMapItemInfo {
  disabled?: boolean;
  disabledReason?: React.ReactNode;
}

export interface PermissionActionProps {
  permitted: PermissionActionInfo;
  disabled?: boolean;
  label: string;
  onChange: (permitted: PermissionMapItemInfo) => void;
  info?: React.ReactNode;
}

const classes = {
  labelRoot: css({ display: "flex" }),
  label: css({ flex: 1 }),
};

const PermissionAction: React.FC<PermissionActionProps> = (props) => {
  const { permitted, label, disabled, info, onChange } = props;

  return (
    <div className={classes.labelRoot}>
      <Text
        ellipsis
        className={classes.label}
        type={permitted.disabled ? "secondary" : undefined}
      >
        {label}
      </Text>
      <Space>
        {(permitted.disabledReason || info) && (
          <Tooltip title={permitted.disabledReason || info}>
            <QuestionCircleOutlined />
          </Tooltip>
        )}
        <Switch
          size="small"
          disabled={permitted.disabled || disabled}
          checked={permitted.access}
          onChange={(checked) => {
            onChange({ ...permitted, access: checked });
          }}
        />
      </Space>
    </div>
  );
};

export default PermissionAction;
