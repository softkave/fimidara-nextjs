import { PlusOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Col, List, Row, Space, Typography } from "antd";
import type { NextPage } from "next";
import Link from "next/link";
import { useSelector } from "react-redux";
import AppHeader from "../../../components/app/AppHeader";
import OrgAvatar from "../../../components/app/orgs/OrgAvatar";
import PageError from "../../../components/utils/PageError";
import PageLoading from "../../../components/utils/PageLoading";
import { appOrgPaths } from "../../../lib/definitions/system";
import useUserOrgs from "../../../lib/hooks/orgs/useUserOrgs";
import SessionSelectors from "../../../lib/store/session/selectors";

const classes = {
  sideLinks: css({
    display: "flex",
    alignItems: "flex-end",
  }),
};

const Orgs: NextPage = () => {
  const userId = useSelector(SessionSelectors.assertGetUserId);
  const { isLoading, error, data } = useUserOrgs(userId);
  let content: React.ReactNode = null;

  if (isLoading || !data) {
    content = <PageLoading messageText="Loading organizations..." />;
  } else if (error) {
    content = (
      <PageError
        messageText={error?.message || "Error fetching organization"}
      />
    );
  } else {
    content = (
      <List
        itemLayout="horizontal"
        dataSource={data?.organizations}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Link href={`${appOrgPaths.orgs}/${item.resourceId}`}>
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
    <Space direction="vertical" size={"large"}>
      <AppHeader />
      <Row>
        <Col span={18}>
          <Typography.Title>Organizations</Typography.Title>
        </Col>
        <Col span={6} className={classes.sideLinks}>
          <Link href={appOrgPaths.orgsForm}>
            <Button icon={<PlusOutlined />} />
          </Link>
        </Col>
      </Row>
      {content}
    </Space>
  );
};

export default Orgs;
