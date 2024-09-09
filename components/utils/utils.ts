import { isBoolean } from "lodash-es";
import { IDropdownItem } from "../ui/dropdown-items.tsx";

export const appComponentConstants = {
  messageDuration: 12_000, // secs
};

export function includeFirstNode<T1>(
  nodes: Array<
    [
      boolean | (() => [boolean, T1]),
      (renderArg: T1 | undefined) => React.ReactNode
    ]
  >
) {
  for (const node of nodes) {
    const [decideRender, renderNode] = node;
    const [showNode, renderNodeArgs] = isBoolean(decideRender)
      ? [decideRender, undefined]
      : decideRender();
    if (showNode) return renderNode(renderNodeArgs);
  }
  return null;
}

export function insertAntdMenuDivider(items: Array<IDropdownItem>) {
  const newItems: Array<IDropdownItem> = [];
  items?.forEach((item, i) => {
    newItems.push(item);
    if (i < items.length - 1)
      newItems.push({ type: "divider", key: `divider-${i}` });
  });
  return newItems;
}

export const htmlCharacterCodes = {
  doubleDash: "—",
  middleDot: "·",
};
