import { css } from "@emotion/css";
import Link from "next/link";
import React from "react";
import { Separator } from "../ui/separator.tsx";
import { cn } from "../utils.ts";
import { IRawNavItem } from "../utils/page/side-nav/types.ts";
import JsSdkFunction from "./JsSdkFunction";
import { jsSdkRawNavItems } from "./navItems.tsx";
import { FieldObject, FieldString } from "./types";

export interface JsSdkIndexProps {}

const classes = {
  root: css({
    "& table": {
      fontFamily: `var(--font-default), -apple-system, BlinkMacSystemFont,
        "Work Sans", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
        sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
        "Noto Color Emoji" !important`,
    },
  }),
};

const JsSdkIndex: React.FC<JsSdkIndexProps> = (props) => {
  const fimidaraJsDescriptionNode = (
    <div className="space-y-4">
      <span>
        Run <code>npm i fimidara</code>
        &nbsp;&nbsp;&nbsp;or&nbsp;&nbsp;&nbsp;
        <code>yarn add fimidara</code> to install.
      </span>
      <div className="space-y-4">
        <p>
          <b>fimidara</b> exports 3 main utilities listed below. fimidara also
          exports param and result types for the endpoints listed below, and
          other utility code like <code>FimidaraEndpointError</code>.
        </p>
        <code className="w-full inline-block">
          import {"{"}
          <br />
          &nbsp;&nbsp; FimidaraEndpoints, <br />
          &nbsp;&nbsp; getFimidaraReadFileURL, <br />
          &nbsp;&nbsp; getUploadFileURL
          <br />
          {"}"} from {'"'}fimidara{'"'}
        </code>
      </div>
      <div className="space-y-4">
        <p>
          You can setup <code>FimidaraEndpoints</code> like so.
        </p>
        <code>
          const fimidaraEndpoints = new FimidaraEndpoints({"{"}
          <br />
          &nbsp;&nbsp;authToken: &nbsp;{'"'}agent token JWT token{'"'}
          <br />
          {"}"});
        </code>
      </div>
    </div>
  );
  const endpointsNode = renderNavItemList(
    jsSdkRawNavItems,
    "FimidaraEndpoints",
    /** descriptionNode */ undefined,
    "endpoints"
  );
  const othersNode = (
    <div className="space-y-4">
      <h5>Others</h5>
      <div>
        <JsSdkFunction
          functionName="getFimidaraReadFileURL"
          params={[{ name: "props", type: getFimidaraReadFileURLParams() }]}
          result={getFimidaraReadFileURLResult()}
        />
      </div>
      <Separator />
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
    <div className={cn("space-y-6", classes.root)}>
      <h5 style={{ margin: "0px 0px 24px 0px" }}>fimidara JS SDK</h5>
      {fimidaraJsDescriptionNode}
      <Separator />
      {endpointsNode}
      <Separator />
      {othersNode}
    </div>
  );
};

export default JsSdkIndex;

function renderNavItemList(
  items: IRawNavItem[],
  label: React.ReactNode,
  descriptionNode: React.ReactNode | undefined,
  key: string | number
) {
  const nodes = items.map((item) => {
    return (
      <li key={item.key}>
        {item.href && !item.children && (
          <Link href={item.href} className="underline">
            {item.label}
          </Link>
        )}
        {item.children &&
          renderNavItemList(
            item.children,
            item.label,
            /** descriptionNode */ undefined,
            item.key
          )}
      </li>
    );
  });

  return (
    <div key={key}>
      <h5>{label}</h5>
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
