import { Divider, Space, Typography } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { first } from "lodash-es";
import Link from "next/link";
import React from "react";
import { IRawNavItem } from "../utils/page/side-nav/types.ts";
import JsSdkFunction from "./JsSdkFunction";
import {
  fimidaraJsSdkNavItems,
  getNavItemPath,
  restApiRawNavItems,
} from "./navItems";
import { FieldObject, FieldString } from "./types";

const { Text } = Typography;

export interface JsSdkIndexProps {}

const JsSdkIndex: React.FC<JsSdkIndexProps> = (props) => {
  const fimidaraJsDescriptionNode = (
    <Space direction="vertical" size={"middle"}>
      <Text>
        Run{" "}
        <Text code copyable>
          npm i fimidara
        </Text>
        &nbsp;&nbsp;&nbsp;or&nbsp;&nbsp;&nbsp;
        <Text code copyable>
          yarn add fimidara
        </Text>{" "}
        to install.
      </Text>
      <div>
        <Paragraph>
          <b>fimidara</b> exports 3 main utilities listed below. fimidara also
          exports param and result types for the endpoints listed below, and
          other utility code like <Text code>FimidaraEndpointError</Text>.
        </Paragraph>
        <Text code>
          import {"{"}FimidaraEndpoints, getFimidaraReadFileURL,
          getUploadFileURL{"}"} from {'"'}fimidara{'"'}
        </Text>
      </div>
      <div>
        <Paragraph>
          You can setup <Text code>FimidaraEndpoints</Text> like so.
        </Paragraph>
        <Text code>
          const fimidaraEndpoints = new FimidaraEndpoints({"{"}authToken:
          {'"'}agent token JWT token{'"'}
          {"}"});
        </Text>
      </div>
    </Space>
  );
  const endpointsNode = renderNavItemList(
    restApiRawNavItems,
    first(fimidaraJsSdkNavItems)!,
    "FimidaraEndpoints",
    /** descriptionNode */ undefined,
    "endpoints"
  );
  const othersNode = (
    <div>
      <Title level={5}>Others</Title>
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
          functionName="getFimidaraUploadFileURL"
          params={[{ name: "props", type: getFimidaraUploadFileURLParams() }]}
          result={getFimidaraReadFileURLResult()}
        />
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <Title level={5} style={{ margin: "0px 0px 24px 0px" }}>
        Fimidara JS SDK
      </Title>
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
  descriptionNode: React.ReactNode | undefined,
  key: string | number
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
      return renderNavItemList(
        item.children,
        rootItem,
        item.label,
        /** descriptionNode */ undefined,
        item.key
      );
    }
  });

  return (
    <div key={key}>
      <Title level={5}>{label}</Title>
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
          description:
            "Filepath including workspace rootname OR file presigned path",
        },
      },
      width: {
        required: true,
        data: {
          __id: "FieldNumber",
          description:
            "Image resize width if file is a image and you want it resized",
          integer: true,
        },
      },
      height: {
        required: true,
        data: {
          __id: "FieldNumber",
          description:
            "Image resize height if file is a image and you want it resized",
          integer: true,
        },
      },
    },
  };
}

function getFimidaraReadFileURLResult(): FieldString {
  return {
    __id: "FieldString",
    description: "File path",
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
          description:
            "Filepath including workspace rootname OR file presigned path",
        },
      },
    },
  };
}
