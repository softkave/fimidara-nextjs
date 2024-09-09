export interface IRawNavItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: IRawNavItem[];
  href?: string;
}

export interface ISomeNavItem {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  key: string;
  children?: Array<ISomeNavItem>;
}
