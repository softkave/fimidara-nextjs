import { PlusOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Row, Col, Typography, Button } from "antd";
import Link from "next/link";
import React from "react";
import { appClasses } from "./theme";

export interface IListHeaderProps {
  title: string;
  formLinkPath: string;
}

const classes = {
  sideLinks: css({
    display: "flex",
    justifyContent: "flex-end",
  }),
};

const ListHeader: React.FC<IListHeaderProps> = (props) => {
  const { title, formLinkPath } = props;
  return (
    <Row className={appClasses.main}>
      <Col span={18}>
        <Typography.Title level={5}>{title}</Typography.Title>
      </Col>
      <Col span={6} className={classes.sideLinks}>
        <Link href={formLinkPath}>
          <Button icon={<PlusOutlined />} />
        </Link>
      </Col>
    </Row>
  );
};

export default ListHeader;
