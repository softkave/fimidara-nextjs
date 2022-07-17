import { GetServerSideProps } from "next";
import { fileValidationParts } from "../../../lib/validation/file";

export type IWorkspaceComponentProps = {
  workspaceId: string;
};

export const getWorkspaceServerSideProps: GetServerSideProps<
  IWorkspaceComponentProps,
  { workspaceId: string }
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
    },
  };
};

export function getRootnameFromName(name: string): string {
  return name.replace(fileValidationParts.notNameRegex, "").replace(/\s/g, "-");
}
