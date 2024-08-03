export interface IRawNavItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  withLink?: boolean;
  children?: IRawNavItem[];
  href?: string;
}
