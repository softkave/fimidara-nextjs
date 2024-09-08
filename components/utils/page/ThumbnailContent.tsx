import { Checkbox } from "@/components/ui/checkbox.tsx";
import { IDropdownItem } from "@/components/ui/dropdown-items.tsx";
import { cn } from "@/components/utils.ts";
import { defaultTo } from "lodash-es";
import React from "react";
import { useHandledEventTraker } from "../../hooks/useHandledEventTraker";
import DropdownButton from "../buttons/DropdownButton";
import MenuButton from "../buttons/MenuButton";
import { GridHelpers, GridPortions, GridTemplateLayout } from "../styling/grid";

export interface IThumbnailContentProps {
  prefixNode?: React.ReactNode;
  suffixNode?: React.ReactNode;
  main: React.ReactNode;
  menu?:
    | { items: Array<IDropdownItem>; onSelect?: (key: string) => void }
    | React.ReactElement;
  selectable?: boolean;
  selected?: boolean;
  withCheckbox?: boolean;
  onSelect?: (state: boolean) => void;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const ThumbnailContent: React.FC<IThumbnailContentProps> = (props) => {
  const {
    prefixNode,
    suffixNode,
    main,
    menu,
    className,
    style,
    selectable,
    selected,
    withCheckbox,
    disabled,
    onSelect,
    onClick,
  } = props;

  let menuNode: React.ReactNode = null;
  if (menu) {
    menuNode = React.isValidElement(menu) ? (
      menu
    ) : (
      <DropdownButton
        items={(menu as Exclude<typeof menu, React.ReactElement>).items}
        onSelect={(menu as Exclude<typeof menu, React.ReactElement>).onSelect}
        triggerNode={<MenuButton />}
      />
    );
  }

  const columnsLayout: GridTemplateLayout = [
    [GridHelpers.includePortion(withCheckbox), GridPortions.Auto],
    [GridHelpers.includePortion(prefixNode), GridPortions.Auto],
    [GridHelpers.includePortion(main), GridPortions.Fr(1)],
    [GridHelpers.includePortion(menuNode), GridPortions.Auto],
    [GridHelpers.includePortion(suffixNode), GridPortions.Auto],
  ];
  const rootStyle: React.CSSProperties = {
    ...defaultTo(style, {}),
    gridTemplateColumns: GridHelpers.toStringGridTemplate(columnsLayout),
  };

  const { shouldHandleEvent, markExclusivelyHandled } = useHandledEventTraker();

  return (
    <div
      className={cn(
        "grid cursor-auto gap-x-4",
        {
          ["cursor-pointer hover:bg-sky-100"]: selectable && !disabled,
          // ["hover:bg-sky-100"]: !disabled,
          ["bg-sky-100"]: selectable && selected,
          ["cursor-not-allowed"]: disabled,
        },
        className
      )}
      style={rootStyle}
      onClick={(evt) => {
        console.log("h");
        if (shouldHandleEvent(evt) && !disabled) {
          console.log("m");
          if (onClick) {
            onClick();
          } else if (onSelect) {
            onSelect(!selected);
          }
        }
      }}
    >
      {withCheckbox && <Checkbox checked={selected} disabled={disabled} />}
      {prefixNode}
      {main}
      {menuNode && (
        <div
          onClick={(evt) => {
            markExclusivelyHandled(evt);
          }}
        >
          {menuNode}
        </div>
      )}
      {suffixNode}
    </div>
  );
};

export default ThumbnailContent;
