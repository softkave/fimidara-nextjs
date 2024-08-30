import { css } from "@emotion/css";
import { Table, TableColumnType } from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { forEach, map } from "lodash-es";
import React from "react";
import { appClasses } from "../utils/theme";
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
  hideTitle?: boolean;
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
  const { propName, fieldObject, isForJsSdk, hideTitle } = props;
  const objectsToProcess = useContainedFieldObjects({ fieldObject });
  const nodes = React.useMemo(() => {
    const nodes: React.ReactNode[] = [];
    objectsToProcess.forEach((nextObject) => {
      nodes.push(
        renderFieldObjectAsTable(
          nextObject,
          isForJsSdk ?? false,
          nextObject === fieldObject ? propName : undefined,
          hideTitle
        )
      );
    });

    return nodes;
  }, [objectsToProcess, fieldObject, isForJsSdk, hideTitle, propName]);

  return <div className="space-y-8 ml-4">{nodes}</div>;
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
    return (
      <Text code ellipsis>
        string
      </Text>
    );
  } else if (isFieldNumber(data)) {
    return <Text code>number</Text>;
  } else if (isFieldBoolean(data)) {
    return <Text code>boolean</Text>;
  } else if (isFieldNull(data)) {
    return <Text code>null</Text>;
  } else if (isFieldUndefined(data)) {
    return <Text code>undefined</Text>;
  } else if (isFieldDate(data)) {
    return <Text code>number</Text>;
  } else if (isFieldArray(data)) {
    if (!data.type) return "";
    const containedTypeNode = renderTableFieldType(data.type, isForJsSdk);
    return (
      <span>
        <Text code>array</Text> of {containedTypeNode}
      </span>
    );
  } else if (isFieldObject(data)) {
    return data.name ? (
      <a href={`#${getTypeNameID(data.name)}`}>
        <Text code ellipsis style={{ color: "inherit" }}>
          {data.name}
        </Text>
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
        <Text code>string</Text> |<br />
        <a href="https://nodejs.org/api/stream.html#class-streamreadable">
          <Text code ellipsis style={{ color: "inherit" }}>
            Node.js Readable
          </Text>
        </a>{" "}
        |<br />
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream">
          <Text code ellipsis style={{ color: "inherit" }}>
            Browser ReadableStream
          </Text>
        </a>{" "}
      </span>
    );
  } else if (isFieldCustomType(data)) {
    if (data.descriptionLink) {
      return (
        <a href={data.descriptionLink}>
          <Text code style={{ color: "inherit" }}>
            {data.name}
          </Text>
        </a>
      );
    } else {
      return (
        <Text code ellipsis>
          {data.name}
        </Text>
      );
    }
  }

  return <Text code>unknown</Text>;
}

function renderFieldObjectAsTable(
  nextObject: FieldObject,
  isForJsSdk: boolean,
  propName?: string,
  hideTitle?: boolean
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
      render: (value) => (
        <Text code ellipsis>
          {value}
        </Text>
      ),
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
      <div className="space-x-2">
        {propName && <Text code>{propName}</Text>}
        {nextObject.name && !hideTitle && (
          <>
            <span>{htmlCharacterCodes.doubleDash}</span>
            <Title
              id={getTypeNameID(nextObject.name)}
              level={5}
              type="secondary"
              className={appClasses.muteMargin}
            >
              {nextObject.name}
            </Title>
          </>
        )}
        {nextObject.required ? (
          <>
            <span>{htmlCharacterCodes.doubleDash}</span>
            <Text code>Required</Text>
          </>
        ) : (
          <>
            <span>{htmlCharacterCodes.doubleDash}</span>
            <Text code>Optional</Text>
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
