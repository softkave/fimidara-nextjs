import { css } from "@emotion/css";
import { Button, Empty, Typography } from "antd";
import React from "react";

export interface IPageNothingFoundActions {
  text: string;
  onClick: React.MouseEventHandler;
}

export interface IPageNothingFoundProps {
  message?: React.ReactNode;
  messageText?: string;
  actions?: Array<IPageNothingFoundActions | React.ReactNode>;
}

const DEFAULT_MESSAGE_TEXT = "Nothing Found!";
const classes = {
  root: css({
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  }),
};

const isPageAction = (
  action: Required<IPageNothingFoundProps>["actions"][0]
): action is IPageNothingFoundActions => {
  return !!(action as IPageNothingFoundActions)?.text;
};

export const PageNothingFoundActions: React.FC<{
  actions: IPageNothingFoundProps["actions"];
}> = (props) => {
  const { actions } = props;
  return (
    <div>
      {actions?.map((action, i) => {
        if (isPageAction(action)) {
          return (
            <Button key={i} onClick={action.onClick}>
              {action.text}
            </Button>
          );
        } else {
          return action;
        }
      })}
    </div>
  );
};

const PageNothingFound: React.FC<IPageNothingFoundProps> = (props) => {
  const { message, messageText, actions } = props;
  return (
    <div className={classes.root}>
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
