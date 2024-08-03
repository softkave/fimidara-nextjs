import { fileValidationParts } from "@/lib/validation/file";

export type IWorkspaceComponentProps = {
  params: { workspaceId: string };
};

const withinNameSymbolsRegex = /[']/;
export function getRootnameFromName(name: string): string {
  return name
    .replace(new RegExp(withinNameSymbolsRegex, "g"), "")
    .replace(new RegExp(fileValidationParts.notNameRegex, "g"), " ")
    .replace(/[\s\-]+/g, "-")
    .toLowerCase();
}
