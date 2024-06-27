import { debounce } from "lodash";
import { SingleFileFormValue } from "./types";

export function getNewFileLocalId() {
  return Math.random().toString();
}

export function getFirstFoldername(files: Pick<SingleFileFormValue, "name">[]) {
  for (const file of files) {
    const foldername = file.name
      .split("/")
      .find((name) => !!name && name !== "." && name !== "..");

    if (foldername) {
      return foldername;
    }
  }

  return undefined;
}

export const replaceBaseFoldername = <
  T extends Pick<SingleFileFormValue, "name">
>(
  files: T[],
  foldername: string
) => {
  return files.map((file) => {
    let names = file.name.split("/");
    const baseFoldernameIndex = names.findIndex(
      (name) => !!name && name !== "." && name !== ".."
    );

    if (baseFoldernameIndex === -1) {
      //  do nothing
    } else if (baseFoldernameIndex === names.length - 1) {
      names = names
        .slice(0, Math.max(0, baseFoldernameIndex))
        .concat(foldername, names.slice(baseFoldernameIndex));
    } else {
      names[baseFoldernameIndex] = foldername;
    }

    return { ...file, name: names.join("/") };
  });
};

export const debouncedReplaceBaseFolderName = debounce(
  replaceBaseFoldername,
  500
);
