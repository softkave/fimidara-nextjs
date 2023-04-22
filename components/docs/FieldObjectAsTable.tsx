import Table, { ColumnsType } from "antd/es/table";
import { map } from "lodash";
import React from "react";
import FieldDescription from "./FieldDescription";
import { useContainedFieldObjects } from "./hooks";
import { FieldObject } from "./types";
import {
  isFieldArray,
  isFieldBinary,
  isFieldBoolean,
  isFieldDate,
  isFieldNull,
  isFieldNumber,
  isFieldObject,
  isFieldOrCombination,
  isFieldString,
  isFieldUndefined,
} from "./utils";

export interface FieldObjectAsTableProps {
  fieldObject: FieldObject;
}

const FieldObjectAsTable: React.FC<FieldObjectAsTableProps> = (props) => {
  const { fieldObject } = props;
  const objectsToProcess = useContainedFieldObjects({ fieldObject });
  const nodes = React.useMemo(() => {
    const nodes: React.ReactNode[] = [];
    objectsToProcess.forEach((nextObject) => {
      nodes.push(renderFieldObjectAsTable(nextObject));
    });

    return nodes;
  }, [objectsToProcess]);

  return <React.Fragment>{nodes}</React.Fragment>;
};

export default FieldObjectAsTable;

type FieldObjectTableColumns = {
  field: string;
  fieldbase: any;
  required?: boolean;
  description?: React.ReactNode;
};

export function renderFieldType(data: any): React.ReactNode {
  if (isFieldString(data)) {
    return "string";
  } else if (isFieldNumber(data)) {
    return "number";
  } else if (isFieldBoolean(data)) {
    return "boolean";
  } else if (isFieldNull(data)) {
    return "null";
  } else if (isFieldUndefined(data)) {
    return "undefined";
  } else if (isFieldDate(data)) {
    return "number";
  } else if (isFieldArray(data)) {
    if (!data.type) return "";
    const containedTypeNode = renderFieldType(data.type);
    return <span>array of ${containedTypeNode}</span>;
  } else if (isFieldObject(data)) {
    return <a href={`#${data.name}`}>{data.name}</a>;
  } else if (isFieldOrCombination(data)) {
    if (!data.types) return "";
    return data.types.map(renderFieldType).join(", or ");
  } else if (isFieldBinary(data)) {
    return "binary";
  }

  return "unknown";
}

const columns: ColumnsType<FieldObjectTableColumns> = [
  {
    title: "Field",
    dataIndex: "field",
    key: "field",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (value: any) => {
      return renderFieldType(value);
    },
  },
  {
    title: "Required",
    dataIndex: "required",
    key: "required",
  },
  {
    title: "Description",
    key: "description",
    dataIndex: "description",
    render: (value: any, data) => {
      return <FieldDescription fieldbase={data.fieldbase} />;
    },
  },
];

function renderFieldObjectAsTable(nextObject: FieldObject) {
  const rows = map(
    nextObject.fields,
    (fieldbase, key): FieldObjectTableColumns => {
      return {
        fieldbase,
        field: key,
        required: fieldbase.required,
        description: fieldbase.description,
      };
    }
  );

  return (
    <div>
      <h5 id={nextObject.name}>{nextObject.name}</h5>
      <Table
        bordered
        key={nextObject.name}
        columns={columns}
        dataSource={rows}
        size="small"
      />
    </div>
  );
}
