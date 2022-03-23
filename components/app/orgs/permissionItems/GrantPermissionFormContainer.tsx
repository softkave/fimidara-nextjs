import { useRequest } from "ahooks";
import { message } from "antd";
import React from "react";
import PermissionItemAPI, {
  INewPermissionItemInputByResource,
} from "../../../../lib/api/endpoints/permissionItem";
import {
  checkEndpointResult,
  processEndpointError,
} from "../../../../lib/api/utils";
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

  const { data, error, isLoading, mutate } = useResourcePermissionList(
    orgId,
    itemResourceType,
    itemResourceId
  );

  const onSave = React.useCallback(
    async (items: INewPermissionItemInputByResource[]) => {
      try {
        // TODO: invalidate all the data that has assigned presets
        // when request is successful

        const result = await PermissionItemAPI.replaceItemsByResource({
          itemResourceType,
          itemResourceId,
          items,
          permissionOwnerId,
          permissionOwnerType,
          organizationId: orgId,
        });

        checkEndpointResult(result);
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
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={
          getBaseError(error) || "Error fetching resource permission items"
        }
      />
    );
  } else if (isLoading || !data) {
    content = (
      <PageLoading messageText="Loading resource permission items..." />
    );
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
