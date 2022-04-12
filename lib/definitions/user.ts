import { getFields, makeExtract } from "../utilities/extract";
import OperationError from "../utilities/OperationError";
import { IAssignedPresetPermissionsGroup } from "./presets";

export interface IUserWorkspace {
  workspaceId: string;
  joinedAt: string;
  presets: IAssignedPresetPermissionsGroup[];
}

export interface IUser {
  resourceId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  lastUpdatedAt?: string;
  passwordLastChangedAt: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: string | null;
  emailVerificationEmailSentAt?: string | null;
  workspaces: IUserWorkspace[];
}

export interface ICollaborator extends IUserWorkspace {
  resourceId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface IUserProfileInput {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const userInputFields = getFields<IUserInput>({
  firstName: true,
  lastName: true,
  email: true,
  password: true,
});

export const extractUserInput = makeExtract(userInputFields);

export const userConstants = {
  minNameLength: 1,
  maxNameLength: 50,
  minPasswordLength: 7,
  maxPasswordLength: 40,
  maxConfirmationCodeLength: 5,
  resendCodeTimeout: 1 * 60 * 1000, // 1 minute
  changePasswordTokenQueryParam: "t",
};

export class EmailAddressNotAvailableError extends OperationError {
  public name = "EmailAddressNotAvailableError";
  public message = "Email address is not available";
}
