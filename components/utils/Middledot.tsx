import { ITextProps, Text } from "./text.tsx";

const Middledot: React.FC<Pick<ITextProps, "type">> = (props) => {
  const { type } = props;
  return (
    <Text
      type={type}
      style={{
        fontSize: "24px",
        display: "flex",
        height: "24px",
        alignItems: "center",
      }}
    >
      &#xB7;
    </Text>
  );
};

export default Middledot;
