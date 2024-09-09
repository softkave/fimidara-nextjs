import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { cn } from "@/components/utils.ts";
import { QuestionCircleOutlined } from "@ant-design/icons";
import React from "react";
import { PermissionMapItemInfo } from "./types";

export interface PermissionActionInfo extends PermissionMapItemInfo {
  disabled?: boolean;
  disabledReason?: React.ReactNode;
}

export interface PermissionActionProps {
  permitted: PermissionActionInfo;
  disabled?: boolean;
  label: string;
  onChange: (permitted: PermissionMapItemInfo) => void;
  info?: React.ReactNode;
}

const PermissionAction: React.FC<PermissionActionProps> = (props) => {
  const { permitted, label, disabled, info, onChange } = props;

  return (
    <Label>
      <div className="flex justify-center space-x-2">
        <div
          className={cn(
            "flex items-center flex-1",
            permitted.disabled ? "text-secondary" : undefined
          )}
        >
          <span className="line-clamp-1">{label}</span>
        </div>
        <div className="space-x-2 flex">
          {(permitted.disabledReason || info) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <QuestionCircleOutlined />
                </TooltipTrigger>
                <TooltipContent>
                  {permitted.disabledReason || info}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Switch
            disabled={permitted.disabled || disabled}
            checked={permitted.access}
            onCheckedChange={(value) => {
              onChange({ ...permitted, access: value });
            }}
          />
        </div>
      </div>
    </Label>
  );
};

export default PermissionAction;
