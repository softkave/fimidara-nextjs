import AppTitle from "@/components/app/AppTitle.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/components/utils.ts";
import useAppResponsive from "@/lib/hooks/useAppResponsive.ts";
import { keyBy } from "lodash-es";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleableComponentProps } from "../../styling/types.ts";
import PageDrawer from "../PageDrawer.tsx";
import { ISomeNavItem } from "./types.ts";

export interface ISideNavProps {
  isOpen?: boolean;
  title: React.ReactNode;
  selectedKeys?: string[];
  openKeys?: string[];
  items: ISomeNavItem[];
  onClose: () => void;
  hideOnClose?: boolean;
}

export function SideNav(props: ISideNavProps) {
  const {
    isOpen,
    title,
    selectedKeys,
    openKeys,
    items,
    onClose,
    hideOnClose = true,
  } = props;
  const responsive = useAppResponsive();
  const isLg = responsive?.lg;
  const defaultOpenKeys = isLg && !isOpen ? undefined : openKeys;
  const [isLgLocal, setLgLocal] = useState(isLg);
  const [open, setOpen] = useState<string[]>(() => defaultOpenKeys || []);
  const [selected, setSelected] = useState<string[]>(() => selectedKeys || []);

  useEffect(() => {
    if (isLg !== isLgLocal) {
      setLgLocal(isLg);

      if (isLgLocal && isOpen) {
        onClose();
      }
    }
  }, [isLg, isLgLocal, isOpen, onClose]);

  useEffect(() => {
    setOpen(defaultOpenKeys || []);
  }, [defaultOpenKeys]);

  useEffect(() => {
    setSelected(selectedKeys || []);
  }, [selectedKeys]);

  const key = useMemo(
    () => (defaultOpenKeys ? Math.random() : undefined),
    [defaultOpenKeys]
  );

  const handleSelect = useCallback(
    (keys: string[]) => {
      setSelected(keys);

      if (!isLg) {
        onClose();
      }
    },
    [onClose, isLg]
  );

  const menuNode = (
    <SomeNav
      key={key}
      items={items as ISomeNavItem[]}
      style={{ minWidth: isOpen ? "300px" : undefined }}
      className={"h-full py-2"}
      selected={selected}
      onSelect={handleSelect}
      open={open}
      onOpen={setOpen}
    />
  );

  if (isLg) {
    if (!isOpen && hideOnClose) {
      return null;
    }

    return (
      <div>
        <AppTitle
          className={cn(
            "py-4",
            "px-4",
            "items-center",
            "flex",
            "sticky top-0 bg-white z-50"
          )}
        />
        <ScrollArea>{menuNode}</ScrollArea>
      </div>
    );
  } else {
    return (
      <PageDrawer open={isOpen} onClose={onClose} title={title}>
        {menuNode}
      </PageDrawer>
    );
  }
}

export interface ISomeNavProps extends StyleableComponentProps {
  items: Array<ISomeNavItem>;
  open?: string[];
  selected?: string[];
  onOpen?: (open: string[]) => void;
  onSelect?: (selected: string[]) => void;

  // internal props
  _openMap?: Record<string, string>;
  _selectedMap?: Record<string, string>;
}

function SomeNav(props: ISomeNavProps) {
  const {
    items,
    className,
    style,
    open,
    selected,
    _openMap,
    _selectedMap,
    onOpen,
    onSelect,
  } = props;

  const openMap = useMemo(() => {
    return _openMap || keyBy(open, (k) => k);
  }, [open, _openMap]);

  const selectedMap = useMemo(() => {
    return _selectedMap || keyBy(selected, (k) => k);
  }, [selected, _selectedMap]);

  console.log({ openMap, selectedMap });

  const handleOpen = (key: string) => {
    if (openMap[key]) {
      onOpen?.((open || []).filter((k) => k !== key));
    } else {
      onOpen?.((open || []).concat(key));
    }
  };

  const handleSelect = (key: string) => {
    if (selectedMap[key]) {
      onSelect?.((selected || []).filter((k) => k !== key));
    } else {
      onSelect?.((selected || []).concat(key));
    }
  };

  const nNode = items.map((item) => (
    <div key={item.key}>
      <div
        className={cn(
          "space-x-2 flex items-center py-0.5 px-4 hover:bg-slate-200",
          selectedMap[item.key] && "bg-slate-200"
        )}
      >
        {item.children?.length ? (
          <span
            onClick={() => {
              handleOpen(item.key);
            }}
          >
            {openMap[item.key] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        ) : null}
        <div
          className="space-x-2 flex items-center"
          onClick={() => {
            handleSelect(item.key);
          }}
        >
          {item.icon && (
            <span className="inline-flex items-center justify-center h-8">
              {item.icon}
            </span>
          )}
          <span className="inline-flex items-center justify-center h-8">
            {item.label}
          </span>
        </div>
      </div>
      {item.children?.length && openMap[item.key] ? (
        <SomeNav
          items={item.children}
          className="ml-6"
          open={open}
          _openMap={openMap}
          onOpen={onOpen}
          selected={selected}
          _selectedMap={selectedMap}
          onSelect={onSelect}
        />
      ) : null}
    </div>
  ));

  return (
    <div className={className} style={style}>
      {nNode}
    </div>
  );
}
