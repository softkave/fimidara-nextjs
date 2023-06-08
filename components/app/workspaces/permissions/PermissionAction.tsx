import { css } from "@emotion/css";
import { Switch, Typography } from "antd";
import React from "react";
import { PermissionMapItemInfo } from "./types";

export interface PermissionActionProps {
  permitted?: PermissionMapItemInfo;
  disabled?: boolean;
  label: string;
  onChange: (permitted: PermissionMapItemInfo) => void;
}

const classes = {
  labelRoot: css({ display: "flex" }),
  label: css({ flex: 1 }),
};

const PermissionAction: React.FC<PermissionActionProps> = (props) => {
  const { permitted, label, disabled, onChange } = props;

  const checked = permitted?.permitted;
  return (
    <div className={classes.labelRoot}>
      <Typography.Text className={classes.label}>{label}</Typography.Text>
      <Switch
        size="small"
        disabled={disabled}
        checked={checked}
        onChange={(checked) => {
          onChange({ permitted: checked });
        }}
      />
    </div>
  );
};

export default PermissionAction;
