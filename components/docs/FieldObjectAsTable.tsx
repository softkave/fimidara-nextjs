import { css } from "@emotion/css";
import { Table, TableColumnType } from "antd";
import { forEach, map } from "lodash-es";
import React from "react";
import { htmlCharacterCodes } from "../utils/utils";
import FieldDescription from "./FieldDescription";
import { useContainedFieldObjects } from "./hooks";
import { FieldObject } from "./types";
import {
  getTypeNameID,
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

const classes = {
  description: css({
    "& .ant-typography": {
      margin: 0,
    },
  }),
};

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
  }, [objectsToProcess, fieldObject, isForJsSdk, propName]);

  return <div className="space-y-8">{nodes}</div>;
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
    return data.name ? (
      <a href={`#${getTypeNameID(data.name)}`}>
        <code className="line-clamp-1">{data.name}</code>
      </a>
    ) : null;
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
          <code className="line-clamp-1">Node.js Readable</code>
        </a>{" "}
        |<br />
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream">
          <code className="line-clamp-1">Browser ReadableStream</code>
        </a>{" "}
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
      return <code className="line-clamp-1">{data.name}</code>;
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
        return (
          <FieldDescription
            fieldbase={data.fieldbase}
            className={classes.description}
          />
        );
      },
    },
  ];

  return (
    <div>
      <div className="space-x-2 flex mb-4">
        {propName && <code>{propName}</code>}
        {nextObject.name && (
          <h5 id={getTypeNameID(nextObject.name)} className="text-secondary">
            {nextObject.name}
          </h5>
        )}
        {nextObject.required ? (
          <>
            <span>{htmlCharacterCodes.doubleDash}</span>
            <code>Required</code>
          </>
        ) : (
          <>
            <span>{htmlCharacterCodes.doubleDash}</span>
            <code>Optional</code>
          </>
        )}
      </div>
      <FieldDescription fieldbase={nextObject} style={{ margin: 0 }} />
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
