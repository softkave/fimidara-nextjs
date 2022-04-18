import { css, cx } from "@emotion/css";
import { Alert, Button, Form, Input, message, Typography } from "antd";
import * as yup from "yup";
import React from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/router";
import { systemValidation } from "../../../../lib/validation/system";
import { messages } from "../../../../lib/definitions/messages";
import {
  INewPresetPermissionsGroupInput,
  IPresetPermissionsGroup,
  presetPermissionsGroupConstants,
} from "../../../../lib/definitions/presets";
import PresetPermissionsGroupAPI from "../../../../lib/api/endpoints/presetPermissionsGroup";
import {
  checkEndpointResult,
  processAndThrowEndpointError,
} from "../../../../lib/api/utils";
import usePermissionGroup from "../../../../lib/hooks/workspaces/usePermissionGroup";
import {
  appWorkspacePaths,
  systemConstants,
} from "../../../../lib/definitions/system";
import useFormHelpers from "../../../../lib/hooks/useFormHelpers";
import { getFormError } from "../../../form/formUtils";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import SelectPresetInput from "./SelectPresetInput";

const presetValidation = yup.object().shape({
  name: systemValidation.name.required(messages.fieldIsRequired),
  description: systemValidation.description,
  presets: yup.array().max(presetPermissionsGroupConstants.maxAssignedPresets),
});

const initialValues: INewPresetPermissionsGroupInput = {
  name: "",
  description: "",
  presets: [],
};

function getPresetFormInputFromPreset(
  item: IPresetPermissionsGroup
): INewPresetPermissionsGroupInput {
  return {
    name: item.name,
    description: item.description,
    presets: item.presets.map((item) => ({
      presetId: item.presetId,
      order: item.order,
    })),
  };
}

export interface IPresetFormProps {
  preset?: IPresetPermissionsGroup;
  className?: string;
  workspaceId: string;
}

export default function PresetForm(props: IPresetFormProps) {
  const { preset, className, workspaceId } = props;
  const router = useRouter();
  const { mutate } = usePermissionGroup(preset?.resourceId);
  const onSubmit = React.useCallback(
    async (data: INewPresetPermissionsGroupInput) => {
      try {
        let presetId: string | null = null;

        if (preset) {
          const result = await PresetPermissionsGroupAPI.updatePreset({
            preset: data,
            presetId: preset.resourceId,
          });

          checkEndpointResult(result);
          presetId = result.preset.resourceId;
          mutate(result);
          message.success("Permission group updated");
        } else {
          const result = await PresetPermissionsGroupAPI.addPreset({
            workspaceId: workspaceId,
            preset: data,
          });

          checkEndpointResult(result);
          presetId = result.preset.resourceId;
          message.success("Permission group created");
        }

        router.push(appWorkspacePaths.permissionGroup(workspaceId, presetId));
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [preset, workspaceId, mutate, router]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: presetValidation,
      initialValues: preset
        ? getPresetFormInputFromPreset(preset)
        : initialValues,
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);
  const nameNode = (
    <Form.Item
      required
      label="Preset Name"
      help={
        formik.touched?.name &&
        formik.errors?.name && (
          <FormError visible={formik.touched.name} error={formik.errors.name} />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        name="name"
        value={formik.values.name}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter preset name"
        disabled={submitResult.loading}
        maxLength={systemConstants.maxNameLength}
        autoComplete="off"
      />
    </Form.Item>
  );

  const descriptionNode = (
    <Form.Item
      label="Description"
      help={
        formik.touched?.description &&
        formik.errors?.description && (
          <FormError
            visible={formik.touched.description}
            error={formik.errors.description}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.TextArea
        name="description"
        value={formik.values.description}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter preset description"
        disabled={submitResult.loading}
        maxLength={systemConstants.maxDescriptionLength}
        autoSize={{ minRows: 3 }}
      />
    </Form.Item>
  );

  const assignedPresetsNode = (
    <Form.Item
      label="Assigned Presets"
      help={
        formik.touched?.presets &&
        formik.errors?.presets && (
          <FormError
            visible={formik.touched.presets}
            error={formik.errors.presets}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <SelectPresetInput
        workspaceId={workspaceId}
        value={formik.values.presets || []}
        disabled={submitResult.loading}
        onChange={(items) => formik.setFieldValue("presets", items)}
      />
    </Form.Item>
  );

  return (
    <div className={cx(formClasses.formBodyClassName, className)}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>Preset Form</Typography.Title>
          </Form.Item>
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
          {nameNode}
          {descriptionNode}
          {assignedPresetsNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {preset ? "Update Preset" : "Create Preset"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
