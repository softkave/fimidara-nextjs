import { compact } from "lodash";

export type GridTemplateLayout = Array<[boolean, string]>;

export const GridPortions = {
  Auto: "auto",
  Fr: (count = 1) => `${count}fr`,
} as const;

export const GridHelpers = {
  includePortion: (item: any) => !!item,
  toStringGridTemplate: (bb: GridTemplateLayout) =>
    compact(bb.map(([include, portion]) => (include ? portion : null))).join(
      " "
    ),
};
