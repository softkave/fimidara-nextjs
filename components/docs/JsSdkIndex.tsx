import { Divider, Space, Typography } from "antd";
import { first } from "lodash";
import Link from "next/link";
import React from "react";
import JsSdkFunction from "./JsSdkFunction";
import {
  fimidaraJsSdkNavItems,
  getNavItemPath,
  restApiRawNavItems,
} from "./navItems";
import { FieldObject, FieldString, IRawNavItem } from "./types";

export interface JsSdkIndexProps {}

const JsSdkIndex: React.FC<JsSdkIndexProps> = (props) => {
  const fimidaraJsDescriptionNode = (
    <Space direction="vertical" size={"large"}>
      <Typography.Text>
        Run <code>npm i fimidara</code>&nbsp;&nbsp;&nbsp;or&nbsp;&nbsp;&nbsp;
        <code>yarn add fimidara</code> to install.
      </Typography.Text>
      <div>
        <Typography.Paragraph>
          fimidara exports 3 main utilities listed below. fimidara also exports
          param and result types for the endpoints listed below, and other
          utility code like <code>FimidaraEndpointError</code>.
        </Typography.Paragraph>
        <code>
          import {"{"}FimidaraEndpoints, getReadFileURL, getUploadFileURL{"}"}{" "}
          from "fimidara"
        </code>
      </div>
      <div>
        <Typography.Paragraph>
          You can setup <code>FimidaraEndpoints</code> like so.
        </Typography.Paragraph>
        <code>
          const fimidaraEndpoints = new FimidaraEndpoints({"{"}authToken: "agent
          token JWT auth token"{"}"});
        </code>
      </div>
    </Space>
  );
  const endpointsNode = renderNavItemList(
    restApiRawNavItems,
    /** parent path */ "",
    "FimidaraEndpoints"
  );
  const othersNode = (
    <div>
      <Typography.Title level={5}>Others</Typography.Title>
      <div>
        <JsSdkFunction
          functionName="getReadFileURL"
          params={[{ name: "props", type: getReadFileURLParams() }]}
          result={getReadFileURLResult()}
        />
      </div>
      <Divider />
      <div>
        <JsSdkFunction
          functionName="getUploadFileURL"
          params={[{ name: "props", type: getUploadFileURLParams() }]}
          result={getReadFileURLResult()}
        />
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {fimidaraJsDescriptionNode}
      <Divider />
      {endpointsNode}
      <Divider />
      {othersNode}
    </React.Fragment>
  );
};

export default JsSdkIndex;

function renderNavItemList(
  items: IRawNavItem[],
  parentPath: string,
  parentLabel: React.ReactNode,
  descriptionNode?: React.ReactNode
) {
  const nodes = items.map((item) => {
    const itemPath = getNavItemPath(item, first(fimidaraJsSdkNavItems)!);
    if (item.withLink) {
      return (
        <li key={item.key}>
          <Link href={itemPath}>{item.label}</Link>
        </li>
      );
    } else if (item.children) {
      return renderNavItemList(item.children, itemPath, item.label);
    }
  });

  return (
    <div>
      <Typography.Title level={5}>{parentLabel}</Typography.Title>
      {descriptionNode}
      <ul key={parentPath}>{nodes}</ul>
    </div>
  );
}

function getReadFileURLParams(): FieldObject {
  return {
    __id: "FieldObject",
    required: true,
    name: "GetReadFileURLParams",
    fields: {
      filepath: {
        required: true,
        data: {
          __id: "FieldString",
          description: "File path.",
        },
      },
      width: {
        required: true,
        data: {
          __id: "FieldNumber",
          description:
            "Image resize width if file is a image and you want it resized.",
          integer: true,
        },
      },
      height: {
        required: true,
        data: {
          __id: "FieldNumber",
          description:
            "Image resize height if file is a image and you want it resized.",
          integer: true,
        },
      },
    },
  };
}

function getReadFileURLResult(): FieldString {
  return {
    __id: "FieldString",
    description: "File path.",
    required: true,
  };
}

function getUploadFileURLParams(): FieldObject {
  return {
    __id: "FieldObject",
    required: true,
    name: "GetUploadFileURLParams",
    fields: {
      filepath: {
        required: true,
        data: {
          __id: "FieldString",
          description: "File path.",
        },
      },
    },
  };
}
