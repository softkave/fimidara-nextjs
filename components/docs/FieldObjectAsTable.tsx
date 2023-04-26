import { Space, Table, TableColumnType, Typography } from "antd";
import { forEach, map } from "lodash";
import React from "react";
import { htmlCharacterCodes } from "../utils/utils";
import FieldDescription from "./FieldDescription";
import { useContainedFieldObjects } from "./hooks";
import { FieldObject } from "./types";
import {
  isFieldArray,
  isFieldBinary,
  isFieldBoolean,
  isFieldCustomType,
  isFieldDate,
  isFieldNull,
  isFieldNumber,
  isFieldObject,
  isFieldOrCombination,
  isFieldString,
  isFieldUndefined,
} from "./utils";

export interface FieldObjectAsTableProps {
  propName?: string;
  isForJsSdk?: boolean;
  fieldObject: FieldObject;
}

const FieldObjectAsTable: React.FC<FieldObjectAsTableProps> = (props) => {
  const { propName, fieldObject, isForJsSdk } = props;
  const objectsToProcess = useContainedFieldObjects({ fieldObject });
  const nodes = React.useMemo(() => {
    const nodes: React.ReactNode[] = [];
    objectsToProcess.forEach((nextObject) => {
      nodes.push(
        renderFieldObjectAsTable(
          nextObject,
          isForJsSdk ?? false,
          nextObject === fieldObject ? propName : undefined
        )
      );
    });

    return nodes;
  }, [objectsToProcess, fieldObject, isForJsSdk]);

  return <React.Fragment>{nodes}</React.Fragment>;
};

export default FieldObjectAsTable;

type FieldObjectTableColumns = {
  field: string;
  fieldbase: any;
  required?: boolean;
  description?: React.ReactNode;
};

export function renderTableFieldType(
  data: any,
  isForJsSdk: boolean
): React.ReactNode {
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
    const containedTypeNode = renderTableFieldType(data.type, isForJsSdk);
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
      const node = renderTableFieldType(type, isForJsSdk);
      if (nodes.length) nodes.push(" or ", node);
      else nodes.push(node);
    });

    return nodes;
  } else if (isFieldBinary(data)) {
    return (
      <span>
        <code>string</code> |<br />
        <a href="https://nodejs.org/api/stream.html#class-streamreadable">
          <code>Readable</code>
        </a>{" "}
        in Node.js |<br />
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream">
          <code>ReadableStream</code>
        </a>{" "}
        in Browser
      </span>
    );
  } else if (isFieldCustomType(data)) {
    if (data.descriptionLink) {
      return (
        <a href={data.descriptionLink}>
          <code>{data.name}</code>
        </a>
      );
    } else {
      return <code>{data.name}</code>;
    }
  }

  return <code>unknown</code>;
}

function renderFieldObjectAsTable(
  nextObject: FieldObject,
  isForJsSdk: boolean,
  propName?: string
) {
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
        return renderTableFieldType(data.fieldbase, isForJsSdk);
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

  return (
    <div>
      <Space split={htmlCharacterCodes.doubleDash}>
        {propName && <code>{propName}</code>}
        {nextObject.name && (
          <Typography.Title id={nextObject.name} level={5} type="secondary">
            {nextObject.name}
          </Typography.Title>
        )}
        {nextObject.required ? <code>Required</code> : <code>Optional</code>}
      </Space>
      <FieldDescription fieldbase={nextObject} />
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
