import { Tabs, TabsProps } from "antd";
import { first } from "lodash";
import React from "react";
import FieldObjectAsJson from "./FieldObjectAsJson";
import FieldObjectAsTable from "./FieldObjectAsTable";
import { FieldObject } from "./types";

const kTableMode = "table" as const;
const kJsonMode = "json" as const;

export interface FieldObjectRenderProps {
  fieldObject: FieldObject;
  modes?: Array<typeof kJsonMode | typeof kTableMode>;
  propName?: string;
  isForJsSdk?: boolean;
}

const FieldObjectRender: React.FC<FieldObjectRenderProps> = (props) => {
  const { fieldObject, modes, propName, isForJsSdk } = props;
  const items: TabsProps["items"] = [];

  if (modes?.includes(kJsonMode))
    items.push({
      key: kJsonMode,
      label: `JSON`,
      children: (
        <FieldObjectAsJson
          fieldObject={fieldObject}
          propName={propName}
          isForJsSdk={isForJsSdk}
        />
      ),
    });
  if (modes?.includes(kTableMode))
    items.push({
      key: kTableMode,
      label: `Table`,
      children: (
        <FieldObjectAsTable
          fieldObject={fieldObject}
          propName={propName}
          isForJsSdk={isForJsSdk}
        />
      ),
    });

  return <Tabs defaultActiveKey={first(modes)} items={items} />;
};

FieldObjectRender.defaultProps = {
  modes: [kJsonMode, kTableMode],
};

export default FieldObjectRender;
