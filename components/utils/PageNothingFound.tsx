import { css, cx } from "@emotion/css";
import { Button, ButtonProps, Empty, Space, Typography } from "antd";
import React from "react";

export type IPageNothingFoundAction = ButtonProps;

export interface IPageNothingFoundProps {
  message?: React.ReactNode;
  messageText?: string;
  actions?: Array<IPageNothingFoundAction | React.ReactElement>;
  className?: string;
  withoutMargin?: boolean;
}

export type IPageNothingFoundPassedDownProps = Pick<
  IPageNothingFoundProps,
  "withoutMargin"
>;

const DEFAULT_MESSAGE_TEXT = "Nothing Found!";
const classes = {
  root: css({
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  }),
  withMargin: css({ margin: "128px 0px" }),
};

const isPageAction = (
  action: Required<IPageNothingFoundProps>["actions"][0]
): action is IPageNothingFoundAction => {
  return !React.isValidElement(action);
};

export const PageNothingFoundActions: React.FC<{
  actions: IPageNothingFoundProps["actions"];
}> = (props) => {
  const { actions } = props;
  return (
    <Space>
      {actions?.map((action, i) => {
        if (isPageAction(action)) {
          return <Button key={i} {...action} />;
        } else {
          return action;
        }
      })}
    </Space>
  );
};

const PageNothingFound: React.FC<IPageNothingFoundProps> = (props) => {
  const { message, messageText, actions, className, withoutMargin } = props;
  return (
    <div
      className={cx(
        classes.root,
        !withoutMargin && classes.withMargin,
        className
      )}
    >
      <Empty
        description={
          message || (
            <Typography.Text type="secondary">
              {messageText || DEFAULT_MESSAGE_TEXT}
            </Typography.Text>
          )
        }
      >
        <PageNothingFoundActions actions={actions} />
      </Empty>
    </div>
  );
};

export default PageNothingFound;
