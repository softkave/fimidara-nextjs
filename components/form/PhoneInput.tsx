import React from "react";
import intlTelInput from "intl-tel-input";
import { css } from "@emotion/css";

// TODO: cache this file when we implement service-workers
import "intl-tel-input/build/js/utils";
import { messages } from "../../lib/messages/messages";

export interface IPhoneInputProps {
  disabled?: boolean;
  value?: string;
  onChange: (val: string) => void;
  onError: (msg: string) => void;
}

const inputClassName = css({
  border: "1px solid #d9d9d9",
  padding: "4px 11px",
  width: "100%",
  borderRadius: "4px",
});

const PhoneInput: React.FC<IPhoneInputProps> = (props) => {
  const { value, disabled, onChange, onError } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);
  let [plugin, setPlugin] = React.useState<any>();

  React.useEffect(() => {
    if (inputRef.current && !plugin) {
      const options: intlTelInput.Options = {};
      const iti = intlTelInput(inputRef.current, options);
      setPlugin(iti);

      return;
    }
  }, [plugin]);

  React.useEffect(() => {
    return () => {
      if (plugin) {
        plugin.destroy();
      }
    };
  }, [plugin]);

  // TODO: add message to let users know what to do if their country is not represented
  // same for CountryInput

  return (
    <input
      ref={inputRef}
      type="tel"
      className={inputClassName}
      value={value}
      disabled={disabled}
      onBlur={() => {
        if (inputRef.current && inputRef.current.value.trim()) {
          if (plugin.isValidNumber()) {
            onChange(plugin.getNumber());
          } else {
            onError(messages.enterValidPhoneNum);
          }
        }
      }}
    />
  );
};

export default PhoneInput;
