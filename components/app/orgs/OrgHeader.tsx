import { LeftOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, Dropdown, Menu, Modal, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSWRConfig } from "swr";
import OrganizationAPI from "../../../lib/api/endpoints/organization";
import { checkEndpointResult } from "../../../lib/api/utils";
import { IOrganization } from "../../../lib/definitions/organization";
import { appOrgPaths, AppResourceType } from "../../../lib/definitions/system";
import { getUseOrgHookKey } from "../../../lib/hooks/orgs/useOrg";
import { MenuInfo } from "../../utils/types";
import OrgAvatar from "./OrgAvatar";
import { BsThreeDots } from "react-icons/bs";
import { appClasses } from "../../utils/theme";
import useGrantPermission from "../../hooks/useGrantPermission";

export interface IOrgHeaderProps {
  org: IOrganization;
}

export enum MenuKeys {
  DeleteOrg = "delete-org",
  GrantPermission = "grant-permission",
}

const classes = {
  root: css({
    display: "flex",
    padding: "16px",
    width: "100%",
  }),
  name: css({
    flex: 1,
    margin: "0 16px",
  }),
};

const OrgHeader: React.FC<IOrgHeaderProps> = (props) => {
  const { org } = props;
  const router = useRouter();
  const { cache } = useSWRConfig();
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    orgId: org.resourceId,
    itemResourceType: AppResourceType.Organization,
    permissionOwnerId: org.resourceId,
    permissionOwnerType: AppResourceType.Organization,
    itemResourceId: org.resourceId,
  });

  const onGoBack = React.useCallback(() => {
    router.push(appOrgPaths.orgs);
  }, []);

  const deleteOrg = React.useCallback(async () => {
    const result = await OrganizationAPI.deleteOrganization({
      organizationId: org.resourceId,
    });

    checkEndpointResult(result);
    router.push(appOrgPaths.orgs);

    // TODO: delete all cache keys
    cache.delete(getUseOrgHookKey(org.resourceId));
  }, [org, router, cache]);

  const deleteOrgHelper = useRequest(deleteOrg, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
      if (info.key === MenuKeys.DeleteOrg) {
        Modal.confirm({
          title: "Are you sure you want to delete this organization?",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { danger: true },
          onOk: async () => {
            await deleteOrgHelper.runAsync();
          },
          onCancel() {
            // do nothing
          },
        });
      } else if (info.key === MenuKeys.GrantPermission) {
        toggleVisibility();
      }
    },
    [toggleVisibility]
  );

  const editOrgPath = appOrgPaths.editOrgForm(org.resourceId);
  return (
    <div className={classes.root}>
      {grantPermissionFormNode}
      <Button icon={<LeftOutlined />} onClick={onGoBack} />
      <Space className={classes.name}>
        <OrgAvatar orgId={org.resourceId} alt={`${org.name} avatar`} />
        <Typography.Title ellipsis level={5} style={{ margin: 0 }}>
          {org.name}
        </Typography.Title>
      </Space>
      <Dropdown
        disabled={deleteOrgHelper.loading}
        trigger={["click"]}
        overlay={
          <Menu onClick={onSelectMenuItem} style={{ minWidth: "150px" }}>
            <Menu.Item key={editOrgPath}>
              <Link href={editOrgPath}>Edit</Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Permission
            </Menu.Item>
            <Menu.Divider key={"divider-02"} />
            <Menu.Item key={MenuKeys.DeleteOrg}>Delete</Menu.Item>
          </Menu>
        }
      >
        <Button
          className={appClasses.iconBtn}
          // type="text"
          icon={<BsThreeDots />}
        ></Button>
      </Dropdown>
    </div>
  );
};

export default OrgHeader;
