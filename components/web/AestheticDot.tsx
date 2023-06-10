import { css } from "@emotion/css";

const classes = {
  dot: css({
    borderLeft: "8px solid rgba(38, 38, 38, 0.45)",
    borderRight: "8px solid rgba(38, 38, 38, 0.45)",
  }),
};

export default function AestheticDot() {
  return <span className={classes.dot}></span>;
}
