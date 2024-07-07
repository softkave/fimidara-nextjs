import { css, cx } from "@emotion/css";
import { Typography } from "antd";
import { isString } from "lodash-es";
import React from "react";

export interface IListHeaderProps {
  style?: React.CSSProperties;
  className?: string;
  label?: React.ReactNode;
  buttons?: React.ReactNode;
  secondaryControls?: React.ReactNode;
}

const classes = {
  header: css({ display: "flex", alignItems: "center" }),
  label: css({ flex: 1 }),
  title: css({ margin: "0px !important" }),
  secondary: css({ marginTop: "12px" }),
};

const ListHeader: React.FC<IListHeaderProps> = (props) => {
  const { buttons, className, label, style, secondaryControls } = props;

  if (!label && !buttons) return null;

  return (
    <div>
      <div className={cx(classes.header, className)} style={style}>
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
      {secondaryControls && (
        <div className={classes.secondary}>{secondaryControls}</div>
      )}
    </div>
  );
};

export default React.memo(ListHeader);
