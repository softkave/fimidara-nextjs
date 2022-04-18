import { PlusOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Col, List, Row, Space, Typography } from "antd";
import type { NextPage } from "next";
import Link from "next/link";
import AppHeader from "../../../components/app/AppHeader";
import WorkspaceAvatar from "../../../components/app/workspaces/WorkspaceAvatar";
import withPageAuthRequired from "../../../components/hoc/withPageAuthRequired";
import PageError from "../../../components/utils/PageError";
import PageLoading from "../../../components/utils/PageLoading";
import PageNothingFound from "../../../components/utils/PageNothingFound";
import { appClasses } from "../../../components/utils/theme";
import { IUserLoginResult } from "../../../lib/api/endpoints/user";
import { appWorkspacePaths } from "../../../lib/definitions/system";
import useUserWorkspaces from "../../../lib/hooks/workspaces/useUserWorkspaces";
import { getBaseError } from "../../../lib/utilities/errors";

const classes = {
  sideLinks: css({
    display: "flex",
    justifyContent: "flex-end",
  }),
};

export interface IWorkspacesPageProps extends IUserLoginResult {}

const Workspaces: NextPage<IWorkspacesPageProps> = () => {
  const { isLoading, error, data } = useUserWorkspaces();
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching workspaces"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading workspaces..." />;
  } else if (data.workspaces.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.main}
        messageText="Create an workspace to get started"
      />
    );
  } else {
    content = (
      <List
        className={appClasses.main}
        itemLayout="horizontal"
        dataSource={data.workspaces}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Link href={appWorkspacePaths.rootFolderList(item.resourceId)}>
                  {item.name}
                </Link>
              }
              description={item.description}
              avatar={
                <WorkspaceAvatar
                  workspaceId={item.resourceId}
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
          <Typography.Title level={5}>Workspaces</Typography.Title>
        </Col>
        <Col span={6} className={classes.sideLinks}>
          <Link href={appWorkspacePaths.createWorkspaceForm} passHref={false}>
            <Button icon={<PlusOutlined />} />
          </Link>
        </Col>
      </Row>
      {content}
    </Space>
  );
};

export default withPageAuthRequired(Workspaces);
