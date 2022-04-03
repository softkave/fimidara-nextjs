import { useRequest } from "ahooks";
import { message } from "antd";
import React from "react";
import PermissionItemAPI from "../../../../lib/api/endpoints/permissionItem";
import { IEndpointResultBase } from "../../../../lib/api/types";
import {
  checkEndpointResult,
  processEndpointError,
} from "../../../../lib/api/utils";
import { INewPermissionItemInput } from "../../../../lib/definitions/permissionItem";
import { AppResourceType } from "../../../../lib/definitions/system";
import useResourcePermissionList from "../../../../lib/hooks/orgs/useResourcePermissionList";
import { getBaseError } from "../../../../lib/utilities/errors";
import { getFormError } from "../../../form/formUtils";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import { appClasses } from "../../../utils/theme";
import { appComponentConstants } from "../../../utils/utils";
import GrantPermissionForm from "./GrantPermissionForm";

export interface IGrantPermissionFormContainerProps {
  orgId: string;
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
  onCancel: () => void;
}

const GrantPermissionFormContainer: React.FC<
  IGrantPermissionFormContainerProps
> = (props) => {
  const {
    orgId,
    itemResourceType,
    itemResourceId,
    permissionOwnerId,
    permissionOwnerType,
    onCancel,
  } = props;

  const { data, error, isLoading, mutate } = useResourcePermissionList({
    itemResourceType,
    itemResourceId,
    permissionOwnerId,
    permissionOwnerType,
    organizationId: orgId,
  });

  const onSave = React.useCallback(
    async (newItems: INewPermissionItemInput[], deletedItemIds: string[]) => {
      try {
        // TODO: invalidate all the data that has assigned presets
        // when request is successful

        // console.log({ newItems, deletedItemIds });

        let result: IEndpointResultBase;

        if (deletedItemIds.length) {
          result = await PermissionItemAPI.deleteItemsById({
            itemIds: deletedItemIds,
            organizationId: orgId,
          });

          checkEndpointResult(result);
        }

        if (newItems.length) {
          result = await PermissionItemAPI.addItems({
            items: newItems,
            organizationId: orgId,
          });

          checkEndpointResult(result);
        }

        message.success("Resource permissions updated");
        mutate();
      } catch (error: any) {
        message.error(
          getFormError(processEndpointError(error)) ||
            "Error updating resource permissions",
          appComponentConstants.errorDuration
        );
      }
    },
    [
      itemResourceType,
      itemResourceId,
      permissionOwnerId,
      permissionOwnerType,
      orgId,
      mutate,
    ]
  );

  const saveItemsHelper = useRequest(onSave, { manual: true });

  if (error) {
    return (
      <PageError
        className={appClasses.main}
        messageText={
          getBaseError(error) || "Error fetching resource permission items"
        }
      />
    );
  } else if (isLoading || !data) {
    return <PageLoading messageText="Loading resource permission items..." />;
  }

  return (
    <GrantPermissionForm
      {...props}
      existingPermissionItems={data?.items || []}
      onSave={saveItemsHelper.run}
      onCancel={onCancel}
      loading={saveItemsHelper.loading}
    />
  );
};

export default GrantPermissionFormContainer;
