import { css } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import UserAPI from "../../../lib/api/endpoints/user";
import { checkEndpointResult } from "../../../lib/api/utils";
import { userConstants } from "../../../lib/definitions/user";
import useFormHelpers from "../../../lib/hooks/useFormHelpers";
import UserSessionStorageFns from "../../../lib/storage/userSession";
import SessionActions from "../../../lib/store/session/actions";
import { getFlattenedError } from "../../../lib/utils/errors";
import { formClasses } from "../../form/classNames";
import FormError from "../../form/FormError";
import { FormAlert } from "../../utils/FormAlert";

export interface IChangePasswordFormData {
  password: string;
}

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength)
    .required(),
});

export default function ChangeUserPassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const onSubmit = React.useCallback(
    async (data: IChangePasswordFormData) => {
      try {
        const result = await UserAPI.changePassword({
          password: data.password,
        });

        checkEndpointResult(result);
        UserSessionStorageFns.saveUserToken(result.token);
        UserSessionStorageFns.saveClientAssignedToken(
          result.clientAssignedToken
        );
        dispatch(
          SessionActions.update({
            data: { token: result.token },
          })
        );
      } catch (error) {
        throw getFlattenedError(error);
      }
    },
    [dispatch]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema,
      initialValues: { password: undefined } as any,
      onSubmit: submitResult.run,
    },
  });

  const passwordNode = (
    <Form.Item
      required
      label="Password"
      help={
        formik.touched.password && (
          <FormError visible={formik.touched.password}>
            {formik.errors.password}
          </FormError>
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.Password
        visibilityToggle
        autoComplete="new-password"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.password}
        placeholder="Enter new password"
        disabled={submitResult.loading}
        maxLength={userConstants.maxPasswordLength}
      />
    </Form.Item>
  );

  return (
    <div className={formClasses.formBodyClassName}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <FormAlert error={submitResult.error} />
          {passwordNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {submitResult.loading ? "Changing Password" : "Change Password"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
