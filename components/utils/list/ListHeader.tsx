import { css, cx } from "@emotion/css";
import { Typography } from "antd";
import { isString } from "lodash";
import React from "react";

export interface IListHeaderProps {
  style?: React.CSSProperties;
  className?: string;
  label?: React.ReactNode;
  buttons?: React.ReactNode;
}

const classes = {
  root: css({ display: "flex", alignItems: "center" }),
  label: css({ flex: 1 }),
  title: css({ margin: "0px !important" }),
};

const ListHeader: React.FC<IListHeaderProps> = (props) => {
  const { buttons, className, label, style } = props;

  if (!label && !buttons) return null;

  return (
    <div className={cx(classes.root, className)} style={style}>
      <div className={classes.label}>
        {isString(label) ? (
          <Typography.Title level={5} className={classes.title}>
            {label}
          </Typography.Title>
        ) : (
          label
        )}
      </div>
      {buttons && <div>{buttons}</div>}
    </div>
  );
};

export default React.memo(ListHeader);
