import { getErrorMessage } from "@/lib/utils/errors";
import { css, cx } from "@emotion/css";
import { Alert, Button, Form } from "antd";
import React from "react";
import { AnyObject } from "yup/lib/types";
import AppFormItem from "./AppFormItem";
import { IFormBag, IFormItem } from "./types";

export interface IAppFormProps<T extends AnyObject> {
  items: Array<IFormItem<T>>;
  bag: IFormBag<T>;
  style?: React.CSSProperties;
  className?: string;
  title?: React.ReactNode;
  includeSaveBtn?: boolean;
  isSubmitting?: boolean;
  saveText?: string;
  getItemId?: (item: IFormItem<T>) => string | number;
}

const classes = {
  root: css({
    padding: "16px",
  }),
};

function AppForm<T extends AnyObject>(props: IAppFormProps<T>) {
  const {
    items,
    bag,
    style,
    className,
    title,
    includeSaveBtn,
    isSubmitting,
    saveText,
    getItemId,
  } = props;
  const itemsNode = items.map((item, i) => (
    <AppFormItem
      key={getItemId ? getItemId(item) : i}
      item={item as IFormItem<any>}
      bag={bag as IFormBag<any>}
    />
  ));

  let controlsNode: React.ReactNode = null;
  if (includeSaveBtn) {
    controlsNode = (
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          {saveText || "Save"}
        </Button>
      </Form.Item>
    );
  }

  return (
    <form
      className={cx(className, classes.root)}
      style={style}
      onSubmit={bag.handleSubmit}
    >
      {title}
      {bag.errors.error && (
        <Form.Item>
          <Alert type="error" message={getErrorMessage(bag.errors.error)} />
        </Form.Item>
      )}
      {itemsNode}
      {controlsNode}
    </form>
  );
}

export default React.memo(AppForm);
