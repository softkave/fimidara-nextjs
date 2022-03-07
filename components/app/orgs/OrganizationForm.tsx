import { css, cx } from "@emotion/css";
import { Alert, Button, Form, Input, message, Typography } from "antd";
import * as yup from "yup";
import React from "react";
import { useRequest } from "ahooks";
import { systemValidation } from "../../../lib/validation/system";
import { messages } from "../../../lib/definitions/messages";
import {
  INewOrganizationInput,
  IOrganization,
} from "../../../lib/definitions/organization";
import OrganizationAPI from "../../../lib/api/endpoints/organization";
import {
  checkEndpointResult,
  processAndThrowEndpointError,
} from "../../../lib/api/utils";
import { useSWRConfig } from "swr";
import { getUseOrgHookKey } from "../../../lib/hooks/orgs/useOrg";
import useFormHelpers from "../../../lib/hooks/useFormHelpers";
import { getFormError } from "../../form/formUtils";
import FormError from "../../form/FormError";
import { appOrgPaths, systemConstants } from "../../../lib/definitions/system";
import { formClasses } from "../../form/classNames";
import Head from "next/head";
import getAppFonts from "../../utils/appFonts";
import WebHeader from "../../web/WebHeader";
import { useRouter } from "next/router";

const organizationValidation = yup.object().shape({
  name: systemValidation.name.required(messages.fieldIsRequired),
  description: systemValidation.description.required(messages.fieldIsRequired),
});

const initialValues: INewOrganizationInput = { name: "", description: "" };

export interface IOrganizationFormProps {
  org?: IOrganization;
  className?: string;
}

export default function OrganizationForm(props: IOrganizationFormProps) {
  const { org, className } = props;
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const onSubmit = React.useCallback(
    async (data: INewOrganizationInput) => {
      try {
        let orgId: string | null = null;

        if (org) {
          const result = await OrganizationAPI.updateOrganization({
            organization: data,
            organizationId: org.resourceId,
          });

          checkEndpointResult(result);
          orgId = result.organization.resourceId;
          mutate(getUseOrgHookKey(org.resourceId), result.organization, false);
          message.success("Organization updated");
        } else {
          const result = await OrganizationAPI.addOrganization(data);
          checkEndpointResult(result);
          orgId = result.organization.resourceId;
          message.success("Organization created");
        }

        router.push(`${appOrgPaths.orgs}/${orgId}`);
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [org]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: organizationValidation,
      initialValues: org || initialValues,
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);
  const nameNode = (
    <Form.Item
      required
      label="Organization Name"
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
        placeholder="Enter organization name"
        disabled={submitResult.loading}
        maxLength={systemConstants.maxNameLength}
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
        placeholder="Enter organization description"
        disabled={submitResult.loading}
        maxLength={systemConstants.maxDescriptionLength}
        autoSize={{ minRows: 3 }}
      />
    </Form.Item>
  );

  return (
    <div className={cx(formClasses.formBodyClassName, className)}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Typography.Title level={4}>Organization Form</Typography.Title>
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
          {nameNode}
          {descriptionNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {org ? "Update Organization" : "Create Organization"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
