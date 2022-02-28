import { css } from "@emotion/css";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import React from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/router";
import { formBodyClassName } from "../../components/form/classNames";
import FormError from "../../components/form/FormError";
import { userConstants } from "../../lib/definitions/user";
import { getFormError, preSubmitCheck } from "../../components/form/formUtils";
import useFormHelpers from "../../lib/hooks/useFormHelpers";
import UserEndpoint from "../../lib/api/endpoints/user";
import UserSessionStorageFns from "../../lib/storage/userSession";
import SessionActions from "../../lib/store/session/actions";
import { appOrgPaths } from "../../lib/definitions/system";
import { toAppErrorsArray } from "../../lib/api/utils";
import { flattenErrorList } from "../../lib/utilities/utils";

export interface ILoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface ILoginProps {}

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().max(userConstants.maxPasswordLength).required(),
});

const initialValues: ILoginFormValues = {
  email: "",
  password: "",
  remember: false,
};

export default function Login(props: ILoginProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const onSubmit = React.useCallback(async (data: ILoginFormValues) => {
    try {
      const result = await UserEndpoint.login({
        email: data.email,
        password: data.password,
      });

      if (data.remember) {
        UserSessionStorageFns.saveUserToken(result.token);
      }

      dispatch(
        SessionActions.loginUser({
          token: result.token,
          userId: result.user.resourceId,
        })
      );

      router.push(appOrgPaths.orgs);
    } catch (error) {
      const errArray = toAppErrorsArray(error);
      const flattenedErrors = flattenErrorList(errArray);
      throw flattenedErrors;
    }
  }, []);

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema,
      initialValues: initialValues,
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);

  const emailNode = (
    <Form.Item
      required
      label="Email Address"
      help={
        formik.touched.email && (
          <FormError visible={formik.touched.email}>
            {formik.errors.email}
          </FormError>
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        autoComplete="email"
        name="email"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.email}
        disabled={submitResult.loading}
        placeholder="Enter your email address"
      />
    </Form.Item>
  );

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
        autoComplete="current-password"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.password}
        disabled={submitResult.loading}
        placeholder="Enter your password"
        maxLength={userConstants.maxPasswordLength}
      />
    </Form.Item>
  );

  const rememberNode = (
    <Form.Item>
      <Checkbox
        name="remember"
        onChange={formik.handleChange}
        checked={formik.values.remember}
        disabled={submitResult.loading}
      >
        Remember Me
      </Checkbox>
    </Form.Item>
  );

  return (
    <div className={formBodyClassName}>
      <form onSubmit={formik.handleSubmit}>
        <Typography.Title level={4}>Login</Typography.Title>
        {globalError && (
          <Form.Item>
            <FormError error={globalError} />
          </Form.Item>
        )}
        {emailNode}
        {passwordNode}
        {rememberNode}
        <Form.Item className={css({ marginTop: "16px" })}>
          <Button
            block
            type="primary"
            htmlType="submit"
            loading={submitResult.loading}
            onClick={() => preSubmitCheck(formik)}
          >
            {submitResult.loading ? "Logging In" : "Log In"}
          </Button>
        </Form.Item>
      </form>
    </div>
  );
}
