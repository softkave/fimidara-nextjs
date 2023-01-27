import { RenderableTreeNode, Tag } from "@markdoc/markdoc";

export type TOCSection = Tag["attributes"] & { title: RenderableTreeNode };
