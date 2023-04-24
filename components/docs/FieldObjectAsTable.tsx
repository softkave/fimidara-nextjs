import { Table, TableColumnType, Typography } from "antd";
import { forEach, map } from "lodash";
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
    return <code>string</code>;
  } else if (isFieldNumber(data)) {
    return <code>number</code>;
  } else if (isFieldBoolean(data)) {
    return <code>boolean</code>;
  } else if (isFieldNull(data)) {
    return <code>null</code>;
  } else if (isFieldUndefined(data)) {
    return <code>undefined</code>;
  } else if (isFieldDate(data)) {
    return <code>number</code>;
  } else if (isFieldArray(data)) {
    if (!data.type) return "";
    const containedTypeNode = renderFieldType(data.type);
    return (
      <span>
        <code>array</code> of {containedTypeNode}
      </span>
    );
  } else if (isFieldObject(data)) {
    return (
      <a href={`#{data.name}`}>
        <code>{data.name}</code>
      </a>
    );
  } else if (isFieldOrCombination(data)) {
    if (!data.types) return "";
    const nodes: React.ReactNode[] = [];

    forEach(data.types, (type) => {
      const node = renderFieldType(type);
      if (nodes.length) nodes.push(" or ", node);
      else nodes.push(node);
    });

    return nodes;
  } else if (isFieldBinary(data)) {
    return <code>binary</code>;
  }

  return <code>unknown</code>;
}

const columns: TableColumnType<FieldObjectTableColumns>[] = [
  {
    title: "Field",
    dataIndex: "field",
    key: "field",
    width: "150px",
    render: (value) => <code>{value}</code>,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (value: any, data) => {
      return renderFieldType(data.fieldbase);
    },
    width: "150px",
  },
  {
    title: "Required",
    dataIndex: "required",
    key: "required",
    render: (required, data) => {
      return required ? "Yes" : "No";
    },
    width: "80px",
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
        field: key,
        fieldbase: fieldbase.data,
        required: fieldbase.required,
        description: fieldbase.data.description,
      };
    }
  );

  return (
    <div>
      <Typography.Title id={nextObject.name} level={5} type="secondary">
        {nextObject.name}
      </Typography.Title>
      <Table
        bordered
        key={nextObject.name}
        columns={columns}
        dataSource={rows}
        size="small"
        pagination={false}
      />
    </div>
  );
}
