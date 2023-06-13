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
    <Space direction="vertical" size={"middle"}>
      <Typography.Text>
        Run{" "}
        <Typography.Text code copyable>
          npm i fimidara
        </Typography.Text>
        &nbsp;&nbsp;&nbsp;or&nbsp;&nbsp;&nbsp;
        <Typography.Text code copyable>
          yarn add fimidara
        </Typography.Text>{" "}
        to install.
      </Typography.Text>
      <div>
        <Typography.Paragraph>
          <b>fimidara</b> exports 3 main utilities listed below. fimidara also
          exports param and result types for the endpoints listed below, and
          other utility code like{" "}
          <Typography.Text code>FimidaraEndpointError</Typography.Text>.
        </Typography.Paragraph>
        <Typography.Text code>
          import {"{"}FimidaraEndpoints, getFimidaraReadFileURL,
          getUploadFileURL{"}"} from &quotfimidara&quot
        </Typography.Text>
      </div>
      <div>
        <Typography.Paragraph>
          You can setup{" "}
          <Typography.Text code>FimidaraEndpoints</Typography.Text> like so.
        </Typography.Paragraph>
        <Typography.Text code>
          const fimidaraEndpoints = new FimidaraEndpoints({"{"}authToken:
          &quotagent token JWT token&quot{"}"});
        </Typography.Text>
      </div>
    </Space>
  );
  const endpointsNode = renderNavItemList(
    restApiRawNavItems,
    first(fimidaraJsSdkNavItems)!,
    "FimidaraEndpoints"
  );
  const othersNode = (
    <div>
      <Typography.Title level={5}>Others</Typography.Title>
      <div>
        <JsSdkFunction
          functionName="getFimidaraReadFileURL"
          params={[{ name: "props", type: getFimidaraReadFileURLParams() }]}
          result={getFimidaraReadFileURLResult()}
        />
      </div>
      <Divider />
      <div>
        <JsSdkFunction
          functionName="getUploadFileURL"
          params={[{ name: "props", type: getFimidaraUploadFileURLParams() }]}
          result={getFimidaraReadFileURLResult()}
        />
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <Typography.Title level={5} style={{ margin: "0px 0px 24px 0px" }}>
        Fimidara JS SDK
      </Typography.Title>
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
  rootItem: IRawNavItem,
  label: React.ReactNode,
  descriptionNode?: React.ReactNode
) {
  const nodes = items.map((item) => {
    const itemPath = getNavItemPath(item, [rootItem]);

    if (item.withLink) {
      return (
        <li key={item.key}>
          <Link href={itemPath}>{item.label}</Link>
        </li>
      );
    } else if (item.children) {
      return renderNavItemList(item.children, rootItem, item.label);
    }
  });

  return (
    <div>
      <Typography.Title level={5}>{label}</Typography.Title>
      {descriptionNode}
      <ul>{nodes}</ul>
    </div>
  );
}

function getFimidaraReadFileURLParams(): FieldObject {
  return {
    __id: "FieldObject",
    required: true,
    name: "GetFimidaraReadFileURLParams",
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

function getFimidaraReadFileURLResult(): FieldString {
  return {
    __id: "FieldString",
    description: "File path.",
    required: true,
  };
}

function getFimidaraUploadFileURLParams(): FieldObject {
  return {
    __id: "FieldObject",
    required: true,
    name: "GetFimidaraUploadFileURLParams",
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
