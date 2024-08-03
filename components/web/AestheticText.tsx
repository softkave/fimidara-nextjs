import Text from "antd/es/typography/Text";
import { StyleableComponentProps } from "../utils/styling/types";

export interface AestheticTextProps extends StyleableComponentProps {
  focusText: string;
  children: React.ReactNode;
}

export default function AestheticText(props: AestheticTextProps) {
  const { focusText, children, style, className } = props;
  return (
    <Text className={className} style={style}>
      <Text strong>{focusText}</Text> {children}
    </Text>
  );
}
