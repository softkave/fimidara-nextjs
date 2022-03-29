import { Menu } from "antd";

export type SelectInfo = Parameters<
  Required<React.ComponentProps<typeof Menu>>["onSelect"]
>[0];

export type MenuInfo = Parameters<
  Required<React.ComponentProps<typeof Menu>>["onClick"]
>[0];
