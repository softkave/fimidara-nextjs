import { css } from "@emotion/css";
import { Space, Table, TableColumnType, Typography } from "antd";
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

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", marginTop: "16px" }}
      size={"large"}
    >
      {nodes}
    </Space>
  );
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
      <Typography.Text code ellipsis>
        string
      </Typography.Text>
    );
  } else if (isFieldNumber(data)) {
    return <Typography.Text code>number</Typography.Text>;
  } else if (isFieldBoolean(data)) {
    return <Typography.Text code>boolean</Typography.Text>;
  } else if (isFieldNull(data)) {
    return <Typography.Text code>null</Typography.Text>;
  } else if (isFieldUndefined(data)) {
    return <Typography.Text code>undefined</Typography.Text>;
  } else if (isFieldDate(data)) {
    return <Typography.Text code>number</Typography.Text>;
  } else if (isFieldArray(data)) {
    if (!data.type) return "";
    const containedTypeNode = renderTableFieldType(data.type, isForJsSdk);
    return (
      <span>
        <Typography.Text code>array</Typography.Text> of {containedTypeNode}
      </span>
    );
  } else if (isFieldObject(data)) {
    return data.name ? (
      <a href={`#${getTypeNameID(data.name)}`}>
        <Typography.Text code ellipsis style={{ color: "inherit" }}>
          {data.name}
        </Typography.Text>
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
        <Typography.Text code>string</Typography.Text> |<br />
        <a href="https://nodejs.org/api/stream.html#class-streamreadable">
          <Typography.Text code ellipsis style={{ color: "inherit" }}>
            Node.js Readable
          </Typography.Text>
        </a>{" "}
        |<br />
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream">
          <Typography.Text code ellipsis style={{ color: "inherit" }}>
            Browser ReadableStream
          </Typography.Text>
        </a>{" "}
      </span>
    );
  } else if (isFieldCustomType(data)) {
    if (data.descriptionLink) {
      return (
        <a href={data.descriptionLink}>
          <Typography.Text code style={{ color: "inherit" }}>
            {data.name}
          </Typography.Text>
        </a>
      );
    } else {
      return (
        <Typography.Text code ellipsis>
          {data.name}
        </Typography.Text>
      );
    }
  }

  return <Typography.Text code>unknown</Typography.Text>;
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
        <Typography.Text code ellipsis>
          {value}
        </Typography.Text>
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
      <Space split={htmlCharacterCodes.doubleDash}>
        {propName && <Typography.Text code>{propName}</Typography.Text>}
        {nextObject.name && !hideTitle && (
          <Typography.Title
            id={getTypeNameID(nextObject.name)}
            level={5}
            type="secondary"
            className={appClasses.muteMargin}
          >
            {nextObject.name}
          </Typography.Title>
        )}
        {nextObject.required ? (
          <Typography.Text code>Required</Typography.Text>
        ) : (
          <Typography.Text code>Optional</Typography.Text>
        )}
      </Space>
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
