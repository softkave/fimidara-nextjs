import { css } from "@emotion/css";
import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import AestheticDot from "./AestheticDot";
import AestheticText from "./AestheticText";

interface IFeature {
  focusText: string;
  restTitle: string;
}

const features: IFeature[] = [
  {
    focusText: "Configurable",
    restTitle: "file storage backend",
  },
  {
    focusText: "Implement",
    restTitle:
      "simple and complex access controls using agent tokens and permission groups",
  },
  {
    focusText: "Build",
    restTitle:
      "clients that securely access files without going through your servers",
  },
  {
    focusText: "Rich",
    restTitle: "UI and APIs",
  },
];

const classes = {
  title: css({
    // textDecoration: "underline",
  }),
};

export default function Features() {
  return (
    <div className="space-y-4">
      <Title level={4}>Features</Title>
      <Row gutter={[16, 64]}>
        {features.map((feature, i) => (
          <Col key={i} sm={24} lg={12}>
            <div className="space-y-2">
              <div className="space-x-2">
                <AestheticDot />
                <AestheticText
                  className={classes.title}
                  focusText={feature.focusText}
                >
                  {feature.restTitle}
                </AestheticText>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
