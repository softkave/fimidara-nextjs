import React from "react";
import FormMessage from "./FormMessage";

export interface IFormErrorProps {
  className?: string;
  style?: React.CSSProperties;
  error?: React.ComponentProps<typeof FormMessage>["message"];
  visible?: boolean;
}

const FormError: React.FC<IFormErrorProps> = (props) => {
  const { className, style, error, visible, children } = props;

  return (
    <FormMessage
      visible={visible}
      type="error"
      message={error}
      className={className}
      style={style}
    >
      {children}
    </FormMessage>
  );
};

export default FormError;
