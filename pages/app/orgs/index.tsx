import { PlusOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Col, List, Row, Space, Typography } from "antd";
import type { NextPage } from "next";
import Link from "next/link";
import AppHeader from "../../../components/app/AppHeader";
import OrgAvatar from "../../../components/app/orgs/OrgAvatar";
import withPageAuthRequired from "../../../components/hoc/withPageAuthRequired";
import PageError from "../../../components/utils/PageError";
import PageLoading from "../../../components/utils/PageLoading";
import PageNothingFound from "../../../components/utils/PageNothingFound";
import { appClasses } from "../../../components/utils/theme";
import { IUserLoginResult } from "../../../lib/api/endpoints/user";
import { appOrgPaths } from "../../../lib/definitions/system";
import useUserOrgs from "../../../lib/hooks/orgs/useUserOrgs";
import { getBaseError } from "../../../lib/utilities/errors";

const classes = {
  sideLinks: css({
    display: "flex",
    justifyContent: "flex-end",
  }),
};

export interface IOrgsPageProps extends IUserLoginResult {}

const Orgs: NextPage<IOrgsPageProps> = () => {
  const { isLoading, error, data } = useUserOrgs();
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching organizations"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading organizations..." />;
  } else if (data.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.main}
        messageText="Create an organization to get started"
      />
    );
  } else {
    content = (
      <List
        className={appClasses.main}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Link href={appOrgPaths.fileList(item.resourceId)}>
                  {item.name}
                </Link>
              }
              description={item.description}
              avatar={
                <OrgAvatar
                  orgId={item.resourceId}
                  alt={`${item.name} avatar`}
                />
              }
            />
          </List.Item>
        )}
      />
    );
  }

  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <AppHeader />
      <Row className={appClasses.main}>
        <Col span={18}>
          <Typography.Title level={5}>Organizations</Typography.Title>
        </Col>
        <Col span={6} className={classes.sideLinks}>
          <Link href={appOrgPaths.createOrgForm}>
            <Button icon={<PlusOutlined />} />
          </Link>
        </Col>
      </Row>
      {content}
    </Space>
  );
};

export default withPageAuthRequired(Orgs);
