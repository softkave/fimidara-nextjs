import React from "react";
import { appClasses } from "../../../utils/theme";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import { getBaseError } from "../../../../lib/utilities/errors";
import { IPermissionItem } from "../../../../lib/definitions/permissionItem";
import {
  IGetResourceInputItem,
  IResource,
} from "../../../../lib/definitions/resource";
import useResourceList from "../../../../lib/hooks/workspaces/useResourceList";

export const getResourceKey = (item: IGetResourceInputItem) =>
  `${item.resourceId}-${item.resourceType}`;

export interface IPermissionItemListResourcesContainerProps {
  workspaceId: string;
  items: IPermissionItem[];
  includePermissionOwner?: boolean;
  includeEntity?: boolean;
  includeItemResource?: boolean;
  render: (
    resourcesMap: Record<string, IResource>,
    items: IPermissionItem[]
  ) => React.ReactElement;
}

const PermissionItemListResourcesContainer: React.FC<
  IPermissionItemListResourcesContainerProps
> = (props) => {
  const {
    workspaceId,
    items,
    includeItemResource,
    includeEntity,
    includePermissionOwner,
    render,
  } = props;

  const resourcesInput: IGetResourceInputItem[] = React.useMemo(() => {
    const map: Record<string, IGetResourceInputItem> = {};
    const addItem = (item: IGetResourceInputItem) => {
      map[getResourceKey(item)] = item;
    };

    items.forEach((item) => {
      if (includeItemResource && item.itemResourceId) {
        addItem({
          resourceId: item.itemResourceId,
          resourceType: item.itemResourceType,
        });
      }

      if (includeEntity) {
        addItem({
          resourceId: item.permissionEntityId,
          resourceType: item.permissionEntityType,
        });
      }

      if (includePermissionOwner) {
        addItem({
          resourceId: item.permissionOwnerId,
          resourceType: item.permissionOwnerType,
        });
      }
    });

    return Object.values(map);
  }, [items, includeEntity, includeItemResource, includePermissionOwner]);

  const { isLoading, error, data } = useResourceList({
    workspaceId: workspaceId,
    resources: resourcesInput,
  });

  const resourcesMap: Record<string, IResource> = React.useMemo(() => {
    const map: Record<string, IResource> = {};
    const resources = data?.resources || [];
    resources.forEach((resource) => {
      map[getResourceKey(resource)] = resource;
    });

    return map;
  }, [data?.resources]);

  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching resources"}
      />
    );
  } else if (isLoading || !data) {
    content = (
      <PageLoading
        className={appClasses.main}
        messageText="Loading resources..."
      />
    );
  }

  return render(resourcesMap, items);
};

export default PermissionItemListResourcesContainer;
