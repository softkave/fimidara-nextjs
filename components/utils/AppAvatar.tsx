import { systemConstants } from "@/lib/definitions/system";
import { useRequest } from "ahooks";
import assert from "assert";
import { getFimidaraReadFileURL } from "fimidara";
import { first } from "lodash-es";
import { getPublicFimidaraEndpointsUsingUserToken } from "../../lib/api/fimidaraEndpoints";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.tsx";

export interface IAppAvatarProps {
  alt: string;
  filepath?: string;
  fallback?: React.ReactNode;
}

export default function AppAvatar(props: IAppAvatarProps) {
  const { filepath, alt, fallback } = props;

  const getPresignedPath = async () => {
    if (!filepath) return undefined;

    const endpoints = getPublicFimidaraEndpointsUsingUserToken();
    const getResult = await endpoints.presignedPaths.getPresignedPaths({
      files: [{ filepath }],
    });

    if (getResult.paths.length) {
      const p = first(getResult.paths);
      assert(p);
      return p.path;
    }

    const issueResult = await endpoints.presignedPaths.issuePresignedPath({
      filepath,
    });
    return issueResult.path;
  };

  const pathHook = useRequest(getPresignedPath);
  const src = pathHook.data
    ? getFimidaraReadFileURL({
        serverURL: systemConstants.serverAddr,
        filepath: "/" + pathHook.data,
        // width: appDimensions.avatar.width,
        // height: appDimensions.avatar.height,
      })
    : undefined;

  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      {fallback && <AvatarFallback>{fallback}</AvatarFallback>}
    </Avatar>
  );
}
