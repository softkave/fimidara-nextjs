import { permissionGroupPermissionsGroupConstants } from "@/lib/definitions/permissionGroups";
import { useWorkspacePermissionGroupAssignMutationHook } from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { css, cx } from "@emotion/css";
import { Button, Form, message } from "antd";
import { isString } from "lodash";
import * as yup from "yup";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import { FormAlert } from "../../../utils/FormAlert";
import { StyleableComponentProps } from "../../../utils/styling/types";
import PermissionGroupListContainer from "./PermissionGroupListContainer";

const validationSchema = yup.object().shape({
  permissionGroups: yup
    .array()
    .max(permissionGroupPermissionsGroupConstants.maxAssignedPermissionGroups),
});

export interface IAssignPermissionGroupsFormProps
  extends StyleableComponentProps {
  entityId: string;
  workspaceId: string;
  permissionGroups: string[];
}

export default function AssignPermissionGroupsForm(
  props: IAssignPermissionGroupsFormProps
) {
  const { entityId, permissionGroups, className, style, workspaceId } = props;
  const assignHook = useWorkspacePermissionGroupAssignMutationHook({
    onSuccess(data, params) {
      message.success(
        `Permission group${
          params[0].body.permissionGroups.length === 1 ? "" : "s"
        } assigned.`
      );
    },
  });

  const { formik } = useFormHelpers({
    errors: assignHook.error,
    formikProps: {
      validationSchema: validationSchema,
      initialValues: { permissionGroups },
      onSubmit: (body) =>
        assignHook.runAsync({
          body: {
            entityId: [entityId],
            permissionGroups: body.permissionGroups.map((pId) => ({
              permissionGroupId: pId,
            })),
          },
        }),
    },
  });

  const permissionGroupsNode = (
    <Form.Item
      required
      help={
        formik.touched?.permissionGroups &&
        isString(formik.errors?.permissionGroups) && (
          <FormError
            visible={formik.touched.permissionGroups}
            error={formik.errors.permissionGroups}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <PermissionGroupListContainer workspaceId={workspaceId} />
    </Form.Item>
  );

  return (
    <div className={cx(formClasses.formBodyClassName, className)} style={style}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          {/* <Form.Item>
            <Typography.Title level={4}>
              Assign Permission Group Form
            </Typography.Title>
          </Form.Item> */}
          <FormAlert error={assignHook.error} />
          {permissionGroupsNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={assignHook.loading}
            >
              Update Assigned Permission Groups
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
