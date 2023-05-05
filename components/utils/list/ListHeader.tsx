import { Typography } from "antd";
import { isString } from "lodash";
import React from "react";

export interface IListHeaderProps {
  style?: React.CSSProperties;
  className?: string;
  label?: React.ReactNode;
  buttons?: React.ReactNode;
}

const ListHeader: React.FC<IListHeaderProps> = (props) => {
  const { buttons, className, label, style } = props;

  if (!label && !buttons) return null;

  return (
    <div className={className} style={style}>
      <div>
        {isString(label) ? (
          <Typography.Title level={5}>{label}</Typography.Title>
        ) : (
          label
        )}
      </div>
      {buttons && <div>{buttons}</div>}
    </div>
  );
};

export default React.memo(ListHeader);
