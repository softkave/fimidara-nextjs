import { css, cx } from "@emotion/css";
import { Button, Input, Space, Typography } from "antd";
import React from "react";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";

export interface IListHeaderProps {
  onCreate: () => void;
  onSearchTextChange: (text: string) => void;
  title: string;
  searchInputPlaceholder?: string;
  hideAddButton?: boolean;
  hideSearchButton?: boolean;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const classes = {
  searchContainer: css({
    justifyContent: "flex-end",
    flex: 1,
    "& .ant-space-item:first-of-type": { flex: 1 },
  }),
  controlsContainer: css({ flex: 1, display: "flex" }),
  title: css({
    textTransform: "uppercase",
    display: "inline-flex",
    flex: 1,
    margin: "0 16px 0 0 !important",
    alignItems: "center",
  }),
};

const ListHeader: React.FC<IListHeaderProps> = (props) => {
  const {
    onSearchTextChange,
    onCreate,
    style,
    hideAddButton,
    hideSearchButton,
    className,
    disabled,
    title,
    searchInputPlaceholder,
  } = props;

  const [inSearchMode, setSearchMode] = React.useState(false);
  const toggleSearchMode = React.useCallback(
    () => setSearchMode((mode) => !mode),
    []
  );
  const endSearchMode = React.useCallback(() => {
    toggleSearchMode();
    onSearchTextChange("");
  }, [toggleSearchMode, onSearchTextChange]);

  const searchInputNode = inSearchMode && (
    <div className={classes.searchContainer}>
      <Space style={{ width: "100%" }}>
        <Input
          allowClear
          disabled={disabled}
          placeholder={searchInputPlaceholder}
          prefix={<FiSearch />}
          onChange={(evt) => onSearchTextChange(evt.target.value)}
        />
        <Button onClick={endSearchMode} className="icon-btn">
          <FiX />
        </Button>
      </Space>
    </div>
  );

  const addButtonNode = !hideAddButton && (
    <Button disabled={disabled} onClick={() => onCreate()} className="icon-btn">
      <FiPlus />
    </Button>
  );

  // const searchButtonNode = !hideSearchButton && (
  //   <Button disabled={disabled} onClick={toggleSearchMode} className="icon-btn">
  //     <FiSearch />
  //   </Button>
  // );

  const controlNode = !inSearchMode && (
    <div className={classes.controlsContainer}>
      <Typography.Title className={classes.title} level={5}>
        {title}
      </Typography.Title>
      <Space>
        {addButtonNode}
        {/* {searchButtonNode} */}
      </Space>
    </div>
  );

  return (
    <div className={cx(className)} style={style}>
      {controlNode}
      {searchInputNode}
    </div>
  );
};

export default React.memo(ListHeader);
