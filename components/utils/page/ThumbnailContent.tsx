import { css, cx } from "@emotion/css";
import { Checkbox, MenuProps } from "antd";
import { defaultTo } from "lodash";
import React from "react";
import { useHandledEventTraker } from "../../hooks/useHandledEventTraker";
import DropdownButton from "../buttons/DropdownButton";
import MenuButton from "../buttons/MenuButton";
import { GridHelpers, GridPortions, GridTemplateLayout } from "../styling/grid";
import { appClasses } from "../theme";

export interface IThumbnailContentProps {
  prefixNode?: React.ReactNode;
  suffixNode?: React.ReactNode;
  main: React.ReactNode;
  menu?: MenuProps | React.ReactElement;
  selectable?: boolean;
  selected?: boolean;
  withCheckbox?: boolean;
  onSelect?: (state: boolean) => void;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const classes = {
  root: css({
    display: "grid",
    columnGap: "16px",
  }),
};

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
      <DropdownButton menu={menu as MenuProps} triggerNode={<MenuButton />} />
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

  const { shouldHandleEvt } = useHandledEventTraker();

  return (
    <div
      className={cx(className, classes.root, {
        [appClasses.selectable]: selectable,
        [appClasses.selected]: selectable && selected,
        [appClasses.disabled]: disabled,
      })}
      style={rootStyle}
      onClick={(evt) => {
        const shouldHandle = shouldHandleEvt(evt);
        if (shouldHandle && !disabled) {
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
      {menuNode}
      {suffixNode}
    </div>
  );
};

export default ThumbnailContent;
