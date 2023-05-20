import { css } from "@emotion/css";
import { Checkbox, Space, Switch, Typography } from "antd";
import { PermissionItemAppliesTo, WorkspaceAppResourceType } from "fimidara";
import { isBoolean, isObject } from "lodash";
import React from "react";
import { PermissionMapItemInfoPermitted } from "./types";

export interface PermissionActionProps {
  permitted?: PermissionMapItemInfoPermitted;
  disabled?: boolean;
  label: string;
  targetType?: WorkspaceAppResourceType;
  appliesTo?: PermissionItemAppliesTo;
  onChange: (permitted: PermissionMapItemInfoPermitted) => void;
}

const classes = {
  labelRoot: css({ display: "flex" }),
  label: css({ flex: 1, textTransform: "capitalize" }),
};

type PermissionItemAppliesToTexts = Record<PermissionItemAppliesTo, string>;
type ResourceTypeToAppliesToTexts = Record<
  WorkspaceAppResourceType,
  PermissionItemAppliesToTexts
>;

const typeToAppliesToTexts: Partial<ResourceTypeToAppliesToTexts> = {
  folder: {
    self: "Applies to this folder only",
    selfAndChildren: "Applies to this folder, and children folders",
    children: "Applies to children folders only",
  },
};
const defaultAppliesToTexts: PermissionItemAppliesToTexts = {
  self: "Applies to resource only",
  selfAndChildren: "Applies to resource and children resource of same type",
  children: "Applies to children resource only",
};

const PermissionAction: React.FC<PermissionActionProps> = (props) => {
  const { permitted, label, appliesTo, targetType, disabled, onChange } = props;

  let appliesToNode: React.ReactNode = null;

  if (targetType === "folder") {
    const texts = typeToAppliesToTexts[targetType] ?? defaultAppliesToTexts;
    const checkedAppliesTo = isObject(permitted) ? permitted : {};
    appliesToNode = (
      <Space direction="vertical">
        <Checkbox
          checked={checkedAppliesTo.self}
          disabled={disabled}
          onChange={(evt) => {
            onChange({ ...checkedAppliesTo, self: evt.target.checked });
          }}
        >
          {texts.self}
        </Checkbox>
        <Checkbox
          checked={checkedAppliesTo.selfAndChildren}
          disabled={disabled}
          onChange={(evt) => {
            onChange({
              ...checkedAppliesTo,
              selfAndChildren: evt.target.checked,
            });
          }}
        >
          {texts.selfAndChildren}
        </Checkbox>
        <Checkbox
          checked={checkedAppliesTo.children}
          disabled={disabled}
          onChange={(evt) => {
            onChange({ ...checkedAppliesTo, children: evt.target.checked });
          }}
        >
          {texts.children}
        </Checkbox>
      </Space>
    );
  }

  const checked = isBoolean(permitted)
    ? permitted
    : permitted?.self || permitted?.selfAndChildren || permitted?.children;
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <div className={classes.labelRoot}>
        <Typography.Text className={classes.label}>{label}</Typography.Text>
        <Switch
          disabled={disabled}
          checked={checked}
          onChange={(checked) => {
            if (targetType === "folder") {
              if (checked) {
                onChange({ selfAndChildren: true });
              } else {
                onChange({
                  self: false,
                  selfAndChildren: false,
                  children: false,
                });
              }
            } else {
              onChange(checked);
            }
          }}
        />
      </div>
      {appliesToNode}
    </Space>
  );
};

export default PermissionAction;
