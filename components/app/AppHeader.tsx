import { css, cx } from "@emotion/css";
import { useRouter } from "next/router";
import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { appWorkspacePaths } from "../../lib/definitions/system";
import { RESOURCE_TYPE_SHORT_NAMES } from "../../lib/utils/resource";
import IconButton from "../utils/buttons/IconButton";
import AppUserHeader from "./AppUserHeader";
import AppWorkspaceHeader from "./AppWorkspaceHeader";
import UserMenu from "./UserMenu";

export interface IAppHeaderProps {
  className?: string;
  style?: React.CSSProperties;
}

const classes = {
  root: css({
    display: "flex",
    padding: "0px 16px",
    borderBottom: "2px solid #f0f0f0",
    alignItems: "center",
  }),
  sideLinks: css({
    display: "flex",
    marginLeft: "16px",
    justifyContent: "flex-end",
  }),
  headers: css({
    flex: 1,
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap",
  }),
  back: css({
    paddingRight: "16px",
    marginRight: "16px",
    borderRight: "2px solid #f0f0f0",
  }),
};

export default function AppHeader(props: IAppHeaderProps) {
  const { className, style } = props;
  const router = useRouter();
  const workspaceId = getWorkspaceId(router.asPath);

  return (
    <div className={cx(classes.root, className)} style={style}>
      {workspaceId && (
        <div className={classes.back}>
          <IconButton
            icon={<FiArrowLeft />}
            onClick={() => {
              router.push(appWorkspacePaths.workspaces);
            }}
          />
        </div>
      )}
      <div className={classes.headers}>
        {workspaceId ? (
          <AppWorkspaceHeader workspaceId={workspaceId} />
        ) : (
          <AppUserHeader />
        )}
      </div>
      <div className={classes.sideLinks}>
        <UserMenu />
      </div>
    </div>
  );
}

function getWorkspaceId(path: string) {
  const [empty01, p01, workspaceId] = path.split("/");
  const isWorkspace = workspaceId?.includes(
    RESOURCE_TYPE_SHORT_NAMES["workspace"]
  );
  if (isWorkspace) return workspaceId;
}
