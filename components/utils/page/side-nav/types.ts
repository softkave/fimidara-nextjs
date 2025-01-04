export interface IRawNavItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: IRawNavItem[];
  href?: string;
  isDivider?: boolean;
}

export interface ISomeNavItem {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  href?: string;
  key: string;
  children?: Array<ISomeNavItem>;
  isDivider?: boolean;
}
