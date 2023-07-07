import { MenuProps } from "antd";
import { isBoolean } from "lodash";

export const appComponentConstants = {
  messageDuration: 12, // secs
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

export function insertAntdMenuDivider(items: MenuProps["items"]) {
  const newItems: MenuProps["items"] = [];
  items?.forEach((item, i) => {
    newItems.push(item);
    if (i < items.length - 1) newItems.push({ type: "divider" });
  });
  return newItems;
}

export const htmlCharacterCodes = {
  doubleDash: "—",
  middleDot: "·",
};
