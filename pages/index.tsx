import { htmlCharacterCodes } from "@/components/utils/utils";
import AestheticNum from "@/components/web/AestheticNum";
import AestheticText from "@/components/web/AestheticText";
import { css } from "@emotion/css";
import { Space, Typography } from "antd";
import type { NextPage } from "next";
import Docs from "../components/web/Docs";
import Features from "../components/web/Features";

const classes = {
  intro: css({
    marginTop: "128px",
  }),
  introParagraph: css({
    marginTop: "32px",
  }),
  underline: css({
    textDecoration: "underline",
  }),
};

const Home: NextPage = () => {
  return (
    <Space direction="vertical" size={128} style={{ width: "100%" }}>
      <div className={classes.intro}>
        <Typography.Title level={1}>fimidara</Typography.Title>
        <Typography.Paragraph className={classes.introParagraph}>
          A fast file service backend with really fine-grained access control.
          <br />
          With <Typography.Text strong>fimidara</Typography.Text>,{" "}
          <AestheticNum>1</AestheticNum>
          <AestheticText className={classes.underline} focusText="you can">
            store your files using the UI or our API
          </AestheticText>
          , <AestheticNum>2</AestheticNum>
          <AestheticText className={classes.underline} focusText="implement">
            simple and complex access controls
          </AestheticText>
          , that <AestheticNum>3</AestheticNum>
          <AestheticText className={classes.underline} focusText="enable you">
            to completely bypass your servers when requesting and working with
            files on the client
          </AestheticText>
          , <AestheticNum>4</AestheticNum>
          <AestheticText className={classes.underline} focusText="freeing">
            your servers to focus on business needs
          </AestheticText>
          .
        </Typography.Paragraph>
      </div>
      <Features />
      <Docs />
      <Typography.Paragraph>
        &copy; {htmlCharacterCodes.doubleDash} Softkave{" "}
        {htmlCharacterCodes.doubleDash} {new Date().getFullYear()}
      </Typography.Paragraph>
    </Space>
  );
};

export default Home;
