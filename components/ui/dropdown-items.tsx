import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu.tsx";

export interface IDropdownItem {
  key: string;
  label?: React.ReactNode;
  type?: "divider";
  disabled?: boolean;
}

export interface IDropdownItemsProps {
  items: Array<IDropdownItem>;
  onSelect?: (key: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  asChild?: boolean;
}

export function DropdownItems(props: IDropdownItemsProps) {
  const { items, disabled, onSelect, children, asChild } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} asChild={asChild}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) =>
          item.type === "divider" ? (
            <DropdownMenuSeparator key={item.key} />
          ) : (
            <DropdownMenuItem
              key={item.key}
              disabled={item.disabled}
              onSelect={() => onSelect?.(item.key)}
            >
              {item.label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
