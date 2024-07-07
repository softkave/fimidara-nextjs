import { flattenErrorList, getErrorMessage } from "@/lib/utils/errors";
import { css } from "@emotion/css";
import { Typography } from "antd";
import {
  defaultTo,
  get,
  isBoolean,
  isFunction,
  isString,
  isUndefined,
} from "lodash-es";
import React from "react";
import { AnyObject } from "yup/lib/types";
import { ElementError } from "../types";
import FormField, { IFormFieldRenderFnProps } from "./FormField";
import FormItemInputText from "./FormItemInputText";
import FormItemInputTextArea from "./FormItemInputTextArea";
import { FormItemInputType, IFormBag, IFormItem } from "./types";

export interface IAppFormItemProps<T extends AnyObject = AnyObject> {
  item: IFormItem<T>;
  bag: IFormBag<T>;
}

const excludeButtonsFor: FormItemInputType[] = [];
const classes = {
  textCount: css({
    fontSize: "13px",
  }),
};

function AppFormItem<T extends AnyObject = AnyObject>(
  props: IAppFormItemProps<T>
) {
  const { item, bag } = props;
  const value = get(bag.values, item.name);
  const touched = get(bag.touched, item.name);
  const error = get(bag.errors, item.name) as ElementError | undefined;
  const saving = get(bag.savingState, item.name);
  const [valueSnapshot, setSnapshot] = React.useState<any>(() => value);
  const hidden = React.useMemo(() => {
    return isBoolean(item.hidden)
      ? item.hidden
      : isFunction(item.hidden)
      ? item.hidden(item, bag)
      : false;
  }, [item, bag]);

  const handleChange = (v: any) => {
    if (item.input?.transformToValue) {
      v = item.input.transformToValue(v);
    }
    bag.setFieldValue(item.name, v);
  };

  const getInputValue = (v: any) => {
    if (item.input?.transformFromValue) {
      return item.input.transformFromValue(v);
    }
    return v;
  };

  const renderInputFn = (p: IFormFieldRenderFnProps) => {
    if (item.render) return item.render(item, bag, p);
    let inputNode: React.ReactNode = null;
    if (item.input) {
      switch (item.input.type) {
        case FormItemInputType.Text:
          inputNode = (
            <FormItemInputText
              {...item.input}
              isEditing={p.isEditing}
              onChange={handleChange}
              setEditing={p.setEditing}
              value={getInputValue(value)}
              disabled={item.input.disabled || item.disabled}
            />
          );
          break;
        case FormItemInputType.TextArea:
          inputNode = (
            <FormItemInputTextArea
              {...item.input}
              isEditing={p.isEditing}
              onChange={handleChange}
              setEditing={p.setEditing}
              value={getInputValue(value)}
              disabled={item.input.disabled || item.disabled}
            />
          );
          break;
      }
    }

    return inputNode;
  };

  const onStartEditing = () => setSnapshot(value);
  const onCancel = () => bag.setFieldValue(item.name, valueSnapshot);
  const onSave = async () => {
    setSnapshot(value);
    if (item.save && value !== valueSnapshot) {
      try {
        bag.setFieldSaving(item.name, true);
        await item.save(item, bag);
        bag.setFieldSaving(item.name, false);
      } catch (e: any) {
        const fError = flattenErrorList(e);
        const itemError = get(fError, item.name) || fError.error;
        bag.setFieldSaving(
          item.name,
          getErrorMessage(itemError, "Error saving data")
        );
      }
    }
  };

  if (hidden) {
    return null;
  }

  let extraNode: React.ReactNode = null;
  if (item.input) {
    switch (item.input.type) {
      case FormItemInputType.Text:
      case FormItemInputType.TextArea:
        if (item.input.showCount && item.input.maxLength) {
          const currentLength = defaultTo(
            value as string | undefined,
            ""
          ).length;
          extraNode = (
            <Typography.Text type="secondary" className={classes.textCount}>
              {currentLength} of {item.input.maxLength} characters
            </Typography.Text>
          );
        }
        break;
    }
  }

  const excludeButtons = isUndefined(item.excludeButtons)
    ? item.input?.type && excludeButtonsFor.includes(item.input.type)
    : item.excludeButtons;
  return (
    <FormField
      onCancel={onCancel}
      saveError={isString(saving) ? saving : undefined}
      onSave={onSave}
      render={renderInputFn}
      defaultEditing={item.defaultEditing}
      disabled={item.disabled}
      error={touched ? error : undefined}
      excludeButtons={excludeButtons}
      extraNode={extraNode}
      formItemProps={item.formItemProps}
      isSaving={isBoolean(saving) ? saving : undefined}
      onStartEditing={onStartEditing}
    />
  );
}

export default React.memo(AppFormItem);
