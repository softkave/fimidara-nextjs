import { Typography } from "antd";
import { StyleableComponentProps } from "../utils/styling/types";

export interface AestheticTextProps extends StyleableComponentProps {
  focusText: string;
  children: React.ReactNode;
}

export default function AestheticText(props: AestheticTextProps) {
  const { focusText, children, style, className } = props;
  return (
    <Typography.Text className={className} style={style}>
      <Typography.Text strong>{focusText}</Typography.Text> {children}
    </Typography.Text>
  );
}
