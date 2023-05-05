import { fileValidationParts } from "@/lib/validation/file";
import { GetServerSideProps } from "next";

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
  return name
    .replace(new RegExp(fileValidationParts.notNameRegex, "g"), " ")
    .replace(/[\s\-]+/g, "-")
    .toLowerCase();
}
