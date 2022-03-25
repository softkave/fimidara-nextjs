import { List } from "antd";
import Link from "next/link";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import { css } from "@emotion/css";
import { IFile } from "../../../../lib/definitions/file";
import FileMenu from "./FileMenu";

export interface IAppFileListProps {
  files: IFile[];
  renderFileItem?: (item: IFile) => React.ReactNode;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const AppFileList: React.FC<IAppFileListProps> = (props) => {
  const { files, renderFileItem } = props;
  const internalRenderItem = React.useCallback(
    (item: IFile) => (
      <List.Item key={item.resourceId} actions={[<FileMenu file={item} />]}>
        <List.Item.Meta
          title={
            <Link href={appOrgPaths.file(item.organizationId, item.resourceId)}>
              {item.name}
            </Link>
          }
          description={item.description}
        />
      </List.Item>
    ),
    []
  );

  return (
    <List
      className={classes.list}
      itemLayout="horizontal"
      dataSource={files}
      renderItem={renderFileItem || internalRenderItem}
    />
  );
};

export default AppFileList;
