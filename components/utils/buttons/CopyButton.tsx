import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export interface ICopyButtonProps {
  text: string | (() => string);
  disabled?: boolean;
}

export function CopyButton(props: ICopyButtonProps) {
  const { text, disabled } = props;
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 5000);
    }
  }, [isCopied]);

  const handleClick = useCallback(() => {
    if (typeof text === "function") {
      navigator.clipboard.writeText(text());
    } else {
      navigator.clipboard.writeText(text);
    }
  }, [text]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      disabled={disabled}
    >
      {isCopied ? (
        <CheckIcon className="w-4 h-4 text-green-500" />
      ) : (
        <CopyIcon className="w-4 h-4" />
      )}
    </Button>
  );
}
