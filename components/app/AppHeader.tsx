import { css, cx } from "@emotion/css";
import { useRouter } from "next/router";
import { appWorkspacePaths } from "../../lib/definitions/system";
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
    padding: "16px",
    borderBottom: "1px solid rgba(0, 0, 0)",
  }),
  sideLinks: css({
    display: "flex",
    flex: 1,
    marginLeft: "16px",
    justifyContent: "flex-end",
  }),
  headers: css({
    flex: 1,
  }),
};

export default function AppHeader(props: IAppHeaderProps) {
  const { className, style } = props;
  const router = useRouter();
  const workspaceId = getWorkspaceId(router.pathname);

  return (
    <div className={cx(classes.root, className)} style={style}>
      {workspaceId ? (
        <AppWorkspaceHeader
          workspaceId={workspaceId}
          className={classes.headers}
        />
      ) : (
        <AppUserHeader className={classes.headers} />
      )}
      <div className={classes.sideLinks}>
        <UserMenu />
      </div>
    </div>
  );
}

function getWorkspaceId(path: string) {
  const paths = path.split("/");
  return paths[1] === appWorkspacePaths.workspaces ? paths[3] : undefined;
}
