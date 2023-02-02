import { isBoolean } from "lodash";

export const appComponentConstants = {
  messageDuration: 7, // secs
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
