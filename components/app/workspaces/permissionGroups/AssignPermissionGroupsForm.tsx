import FormError from "@/components/form/FormError";
import { formClasses } from "@/components/form/classNames";
import { FormAlert } from "@/components/utils/FormAlert";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import { permissionGroupPermissionsGroupConstants } from "@/lib/definitions/permissionGroups";
import {
  useMergeMutationHookStates,
  useWorkspacePermissionGroupAssignMutationHook,
  useWorkspacePermissionGroupUnassignMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { indexArray } from "@/lib/utils/indexArray";
import { css, cx } from "@emotion/css";
import { Form, Modal, message } from "antd";
import { isString } from "lodash";
import React from "react";
import * as yup from "yup";
import PermissionGroupListContainer from "./PermissionGroupListContainer";

type AssignPermissionGroupsFormValues = {
  permissionGroups: string[];
};

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
  onClose: () => void;
  onCompleteSubmit: () => void;
}

const classes = {
  root: css({
    "& .ant-modal-body": {
      padding: 0,
    },
  }),
};

export default function AssignPermissionGroupsForm(
  props: IAssignPermissionGroupsFormProps
) {
  const {
    entityId,
    permissionGroups,
    className,
    style,
    workspaceId,
    onClose,
    onCompleteSubmit,
  } = props;

  const assignHook = useWorkspacePermissionGroupAssignMutationHook();
  const unassignHook = useWorkspacePermissionGroupUnassignMutationHook();
  const mergedHook = useMergeMutationHookStates(assignHook, unassignHook);

  const handleSubmit = async (body: AssignPermissionGroupsFormValues) => {
    const initialPgsMap = indexArray(permissionGroups);
    const assignedPgsMap = indexArray(body.permissionGroups);
    const unassignedPgs = permissionGroups.filter(
      (pgId) => !assignedPgsMap[pgId]
    );
    const assignedPgs = body.permissionGroups.filter(
      (pgId) => !initialPgsMap[pgId]
    );

    // TODO: should we have different runs for assign and unassign?
    await Promise.all([
      assignedPgs.length &&
        assignHook.runAsync({
          body: {
            workspaceId,
            entityId: [entityId],
            permissionGroups: assignedPgs.map((pId) => ({
              permissionGroupId: pId,
            })),
          },
        }),
      unassignedPgs.length &&
        unassignHook.runAsync({
          body: {
            workspaceId,
            entityId: [entityId],
            permissionGroups: unassignedPgs,
          },
        }),
    ]);

    if (assignedPgs.length || unassignedPgs.length) {
      message.success(`Assigned permission groups updated.`);
    }

    onCompleteSubmit();
    onClose();
  };

  const { formik } = useFormHelpers({
    errors: mergedHook.error,
    formikProps: {
      validationSchema: validationSchema,
      initialValues: { permissionGroups },
      onSubmit: handleSubmit,
    },
  });

  const selectedMap = React.useMemo(() => {
    return indexArray(formik.values.permissionGroups, {
      reducer: (item) => true,
    });
  }, [formik.values.permissionGroups]);

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
      <PermissionGroupListContainer
        withCheckbox
        workspaceId={workspaceId}
        selectedMap={selectedMap}
        onSelect={(pg) => {
          const idList = [...formik.values.permissionGroups];
          const i = idList.indexOf(pg.resourceId);

          if (i === -1) idList.push(pg.resourceId);
          else idList.splice(i, 1);

          formik.setValues({ permissionGroups: idList });
        }}
      />
    </Form.Item>
  );

  const mainNode = (
    <div className={cx(formClasses.formBodyClassName, className)} style={style}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          {/* <Form.Item>
            <Typography.Title level={4}>
              Assign Permission Group Form
            </Typography.Title>
          </Form.Item> */}
          <FormAlert error={mergedHook.error} />
          {permissionGroupsNode}
        </form>
      </div>
    </div>
  );

  return (
    <Modal
      open
      destroyOnClose
      closable={false}
      onOk={formik.submitForm}
      onCancel={onClose}
      okButtonProps={{ disabled: mergedHook.loading }}
      cancelButtonProps={{ danger: true, disabled: mergedHook.loading }}
      okText="Update"
      cancelText="Close"
      className={classes.root}
    >
      {mainNode}
    </Modal>
  );
}
