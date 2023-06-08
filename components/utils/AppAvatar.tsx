import { systemConstants } from "@/lib/definitions/system";
import { useRequest } from "ahooks";
import { Avatar, AvatarProps } from "antd";
import assert from "assert";
import { getReadFileURL } from "fimidara";
import { first } from "lodash";
import { getPublicFimidaraEndpointsUsingUserToken } from "../../lib/api/fimidaraEndpoints";
import { Omit1 } from "../../lib/utils/types";
import { appDimensions } from "./theme";

export interface IAppAvatarProps extends Omit1<AvatarProps, "src" | "srcSet"> {
  filepath?: string;
}

export default function AppAvatar(props: IAppAvatarProps) {
  const { filepath, ...restProps } = props;

  const getPresignedPath = async () => {
    if (!filepath) return undefined;

    const endpoints = getPublicFimidaraEndpointsUsingUserToken();
    const getResult = await endpoints.files.getFilePresignedPaths({
      body: { files: [{ filepath }] },
    });

    if (getResult.body.paths.length) {
      const p = first(getResult.body.paths);
      assert(p);
      return p.path;
    }

    const issueResult = await endpoints.files.issueFilePresignedPath({
      body: { filepath },
    });
    return issueResult.body.path;
  };

  const pathHook = useRequest(getPresignedPath);

  return (
    <Avatar
      size="default"
      shape="circle"
      {...restProps}
      src={
        pathHook.data
          ? getReadFileURL({
              serverURL: systemConstants.serverAddr,
              filepath: "/" + pathHook.data,
              width: appDimensions.avatar.width,
              height: appDimensions.avatar.height,
            })
          : undefined
      }
    />
  );
}
