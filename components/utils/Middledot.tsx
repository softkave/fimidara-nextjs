import { Typography } from "antd";
import { TextProps } from "antd/es/typography/Text";

const Middledot: React.FC<Pick<TextProps, "type">> = (props) => {
  const { type } = props;
  return (
    <Typography.Text
      type={type}
      style={{
        fontSize: "24px",
        display: "flex",
        height: "24px",
        alignItems: "center",
      }}
    >
      &#xB7;
    </Typography.Text>
  );
};

export default Middledot;
