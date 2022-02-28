import { IUser, IUserInput } from "../../definitions/user";
import {
  GetEndpointResult,
  GetEndpointResultError,
  IEndpointResultBase,
} from "../types";
import { invokeEndpoint, invokeEndpointWithAuth } from "../utils";

export type IUserLoginResult = GetEndpointResult<{
  user: IUser;
  token: string;
}>;

export interface ISignupAPIProps extends Required<IUserInput> {}

export type ISignupEndpointErrors = GetEndpointResultError<ISignupAPIProps>;

async function signup(props: ISignupAPIProps) {
  const result = await invokeEndpoint<IUserLoginResult>({
    path: "/account/signup",
    data: props,
  });

  return result;
}

export interface ILoginAPIProps {
  email: string;
  password: string;
}

export type ILoginEndpointErrors = GetEndpointResultError<ILoginAPIProps>;

async function login(props: ILoginAPIProps): Promise<IUserLoginResult> {
  const result = await invokeEndpoint<IUserLoginResult>({
    path: "/account/login",
    data: props,
  });

  return result;
}

export interface IUpdateUserAPIProps extends IUserInput {}

export type IUpdateUserEndpointErrors =
  GetEndpointResultError<IUpdateUserAPIProps>;

async function updateUser(props: IUpdateUserAPIProps) {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: "/account/updateUser",
    data: props,
  });
}

export interface IChangePasswordAPIProps {
  password: string;
}

async function changePassword(props: IChangePasswordAPIProps) {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: "/account/changePassword",
    data: props,
  });
}

export interface IForgotPasswordAPIProps {
  email: string;
}

export type IForgotPasswordEndpointErrors =
  GetEndpointResultError<IForgotPasswordAPIProps>;

async function forgotPassword(props: IForgotPasswordAPIProps) {
  const result = await invokeEndpoint<IEndpointResultBase>({
    path: "/account/forgotPassword",
    data: props,
  });

  return result;
}

export interface IUserExistsEndpointParams {
  email: string;
}

export type IUserExistsEndpointResult = GetEndpointResult<{
  exists: boolean;
}>;

async function userExists(props: IUserExistsEndpointParams) {
  const result = await invokeEndpoint<IUserExistsEndpointResult>({
    path: "/account/accountExists",
    data: props,
  });

  return result;
}

export interface IChangePasswordWithTokenEndpointParams {
  password: string;
  token: string;
}

export type IChangePasswordWithTokenEndpointErrors =
  GetEndpointResultError<IChangePasswordWithTokenEndpointParams>;

async function changePasswordWithToken(
  props: IChangePasswordWithTokenEndpointParams
) {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: "/account/changePasswordWithToken",
    data: {
      password: props.password,
    },
    token: props.token,
  });
}

async function sendEmailVerificationCode() {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: "/account/sendEmailVerificationCode",
  });
}

export interface IConfirmEmailAddressParams {
  token: string;
}

export type IConfirmEmailAddressErrors =
  GetEndpointResultError<IConfirmEmailAddressParams>;

async function confirmEmailAddress(props: IConfirmEmailAddressParams) {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: "/account/confirmEmailAddress",
    token: props.token,
  });
}

export interface IGetUserDataParams {
  token: string;
}

async function getUserData(props: IGetUserDataParams) {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: "/account/getUserData",
    token: props.token,
  });
}

export default class UserAPI {
  public static signup = signup;
  public static login = login;
  public static updateUser = updateUser;
  public static changePassword = changePassword;
  public static forgotPassword = forgotPassword;
  public static userExists = userExists;
  public static changePasswordWithToken = changePasswordWithToken;
  public static getUserData = getUserData;
  public static sendEmailVerificationCode = sendEmailVerificationCode;
  public static confirmEmailAddress = confirmEmailAddress;
}
