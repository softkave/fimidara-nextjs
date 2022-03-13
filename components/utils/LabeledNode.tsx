import { cx } from "@emotion/css";
import { Col, Row, Space, Tooltip, Typography } from "antd";
import React from "react";

export interface ILabeledNodeProps {
  label?: string;
  node: React.ReactNode;
  direction?: React.ComponentProps<typeof Space>["direction"];
  nodeIsText?: boolean;
  labelFontSize?: number;
  contentFontSize?: number;
  spaceSize?: number;
  className?: string;
  style?: React.CSSProperties;
  labelSpan?: number;
  nodeSpan?: number;
  colon?: boolean;
  textAlign?: "left" | "center" | "right";
}

const LabeledNode: React.FC<ILabeledNodeProps> = (props) => {
  const {
    label,
    node,
    direction,
    nodeIsText,
    labelFontSize,
    contentFontSize,
    spaceSize,
    className,
    style,
    labelSpan,
    nodeSpan,
    colon,
    textAlign,
  } = props;
  let internalNodeContent = null;

  if (node) {
    internalNodeContent = nodeIsText ? (
      <Tooltip title={node}>
        <Typography.Text style={{ fontSize: contentFontSize }}>
          {node}
        </Typography.Text>
      </Tooltip>
    ) : (
      node
    );
  }

  const internalLabel = label && colon ? `${label}: ` : label;
  const labelNode = label && (
    <Typography.Text
      strong
      ellipsis
      style={{ fontSize: labelFontSize }}
      type="secondary"
    >
      {internalLabel}
    </Typography.Text>
  );

  if (direction === "horizontal") {
    return (
      <Row gutter={16} style={style} className={cx(className)}>
        {label && <Col span={labelSpan || 12}>{labelNode}</Col>}
        <Col span={nodeSpan || 12} style={{ textAlign }}>
          {internalNodeContent}
        </Col>
      </Row>
    );
  } else {
    return (
      <Row
        wrap
        gutter={[0, spaceSize || (labelFontSize ? labelFontSize / 2 : 8)]}
        style={style}
        className={cx(className)}
      >
        {label && <Col span={24}>{labelNode}</Col>}
        <Col span={24}>{internalNodeContent}</Col>
      </Row>
    );
  }
};

LabeledNode.defaultProps = {
  labelFontSize: 14,
  contentFontSize: 14,
  direction: "horizontal",
};

export default LabeledNode;
