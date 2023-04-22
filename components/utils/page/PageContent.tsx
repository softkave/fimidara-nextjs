import { cx } from "@emotion/css";
import { defaultTo, isFunction } from "lodash";
import React from "react";
import { GridHelpers, GridPortions, GridTemplateLayout } from "../styling/grid";
import { IStyleableComponent } from "../styling/types";
import { appClasses } from "../theme";
import EmptyMessage from "./EmptyMessage";
import InlineLoading from "./InlineLoading";
import LoadingEllipsis from "./LoadingEllipsis";
import MessageList, { IMessageListProps } from "./MessageList";

export interface IPageContentProps<T = any> extends IStyleableComponent {
  isLoading?: boolean;
  error?: IMessageListProps["messages"];
  emptyMessage?: string;
  data?: T;
  render: ((item: T) => React.ReactNode) | React.ReactNode;
  styleInlineLoading?: IStyleableComponent;
  styleMessageList?: IStyleableComponent;
  styleRender?: IStyleableComponent;
}

function PageContent<T>(props: IPageContentProps<T>) {
  const {
    data,
    emptyMessage,
    isLoading,
    error,
    render,
    className,
    style,
    styleInlineLoading,
    styleMessageList,
    styleRender,
  } = props;

  if (data) {
    const columnsLayout: GridTemplateLayout = [
      [GridHelpers.includePortion(isLoading), GridPortions.Auto],
      [GridHelpers.includePortion(error), GridPortions.Auto],
      [GridHelpers.includePortion(true), GridPortions.Fr(1)],
    ];
    const rootStyle: React.CSSProperties = {
      ...defaultTo(style, {}),
      gridTemplateRows: GridHelpers.toStringGridTemplate(columnsLayout),
    };
    return (
      <div style={rootStyle} className={cx(className, appClasses.grid)}>
        {isLoading && (
          <InlineLoading
            key="inline-loading"
            className={styleInlineLoading?.className}
            style={styleInlineLoading?.style}
          />
        )}
        {error && (
          <MessageList
            useAlertGroup
            key="message-list"
            type="danger"
            messages={error}
            className={styleMessageList?.className}
            style={styleMessageList?.style}
          />
        )}
        <div className={styleRender?.className} style={styleRender?.style}>
          {isFunction(render) ? render(data) : render}
        </div>
      </div>
    );
  } else {
    if (isLoading) {
      return <LoadingEllipsis key="loading-ellipsis" />;
    } else if (error) {
      return (
        <MessageList
          useEmptyMessage
          shouldFillParent
          maxWidth
          key="message-list"
          type="danger"
          messages={error}
        />
      );
    } else {
      return (
        <EmptyMessage
          shouldPad
          key="empty-message"
          children={emptyMessage || "Not found"}
        />
      );
    }
  }
}

export default PageContent as React.FC<IPageContentProps>;
