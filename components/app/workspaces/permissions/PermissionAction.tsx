import { css } from "@emotion/css";
import { Checkbox, Space, Switch, Typography } from "antd";
import { PermissionItemAppliesTo, WorkspaceAppResourceType } from "fimidara";
import React from "react";
import {
  PermissionMapItemInfo,
  PermissionMapItemInfoAppliesToPermitted,
} from "./types";
import {
  isPermissionMapItemInfoAppliesToPermitted,
  isPermissionMapItemInfoPermitted,
} from "./utils";

export interface PermissionActionProps {
  permitted?: PermissionMapItemInfo;
  disabled?: boolean;
  label: string;
  targetType?: WorkspaceAppResourceType;
  parentTargetType?: WorkspaceAppResourceType;
  onChange: (permitted: PermissionMapItemInfo) => void;
}

const classes = {
  labelRoot: css({ display: "flex" }),
  label: css({ flex: 1 }),
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
  const { permitted, label, targetType, parentTargetType, disabled, onChange } =
    props;

  let appliesToNode: React.ReactNode = null;
  const onChangeAppliesToPermitted = (
    checked: boolean,
    appliesTo: PermissionItemAppliesTo
  ) => {
    if (!isPermissionMapItemInfoAppliesToPermitted(permitted)) return;

    const updated: PermissionMapItemInfoAppliesToPermitted = {
      ...permitted,
      [appliesTo]: { ...permitted[appliesTo], permitted: checked },
    };
    onChange(updated);
  };

  if (targetType === "folder" && parentTargetType === "folder") {
    const texts = typeToAppliesToTexts[targetType] ?? defaultAppliesToTexts;

    if (isPermissionMapItemInfoAppliesToPermitted(permitted)) {
      console.log({ permitted });
      appliesToNode = (
        <Space direction="vertical">
          <Checkbox
            checked={permitted.self?.permitted}
            disabled={disabled}
            onChange={(evt) => {
              onChangeAppliesToPermitted(evt.target.checked, "self");
            }}
          >
            {texts.self}
          </Checkbox>
          <Checkbox
            checked={permitted.selfAndChildren?.permitted}
            disabled={disabled}
            onChange={(evt) => {
              onChangeAppliesToPermitted(evt.target.checked, "selfAndChildren");
            }}
          >
            {texts.selfAndChildren}
          </Checkbox>
          <Checkbox
            checked={permitted.children?.permitted}
            disabled={disabled}
            onChange={(evt) => {
              onChangeAppliesToPermitted(evt.target.checked, "children");
            }}
          >
            {texts.children}
          </Checkbox>
        </Space>
      );
    }
  }

  let checked: boolean = false;

  if (isPermissionMapItemInfoPermitted(permitted)) {
    checked = permitted.permitted;
  } else {
    checked =
      permitted?.self?.permitted ||
      permitted?.selfAndChildren?.permitted ||
      permitted?.children?.permitted ||
      false;
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <div className={classes.labelRoot}>
        <Typography.Text className={classes.label}>{label}</Typography.Text>
        <Switch
          size="small"
          disabled={disabled}
          checked={checked}
          onChange={(checked) => {
            if (targetType === "folder") {
              if (checked) {
                onChange({
                  type: 2,
                  selfAndChildren: { type: 1, permitted: checked },
                });
              } else {
                onChange({
                  type: 2,
                  self: { type: 1, permitted: false },
                  selfAndChildren: { type: 1, permitted: false },
                  children: { type: 1, permitted: false },
                });
              }
            } else {
              onChange({ type: 1, permitted: checked });
            }
          }}
        />
      </div>
      {appliesToNode}
    </Space>
  );
};

export default PermissionAction;
