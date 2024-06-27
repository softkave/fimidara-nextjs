import { FormAlert } from "@/components/utils/FormAlert";
import CustomIcon from "@/components/utils/buttons/CustomIcon";
import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import { appWorkspacePaths, systemConstants } from "@/lib/definitions/system";
import {
  useWorkspaceFileUploadMutationHook,
  useWorkspaceFolderAddMutationHook,
  useWorkspaceFolderUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { useTransferProgressHandler } from "@/lib/hooks/useTransferProgress";
import { messages } from "@/lib/messages/messages";
import { fileValidationParts } from "@/lib/validation/file";
import { systemValidation } from "@/lib/validation/system";
import { UploadOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Button, Form, Input, Space, Typography, Upload, message } from "antd";
import { Folder } from "fimidara";
import { FormikTouched } from "formik";
import { compact, isString } from "lodash";
import { useRouter } from "next/router";
import { ChangeEventHandler, ReactNode, useMemo } from "react";
import * as yup from "yup";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import { FilesFormUploadProgress } from "./FilesFormUploadProgress";
import { SelectedFilesForm } from "./SelectedFilesForm";
import { SingleFileFormValue } from "./types";
import {
  debouncedReplaceBaseFolderName,
  getFirstFoldername,
  getNewFileLocalId,
  replaceBaseFoldername,
} from "./utils";
import { newFileValidationSchema } from "./validation";

const folderValidation = yup.object().shape({
  name: fileValidationParts.filename.required(messages.fieldIsRequired),
  description: systemValidation.description.nullable(),
  // maxFileSizeInBytes: yup
  //   .number()
  //   .max(fileConstants.maxFileSizeInBytes)
  //   .nullable(),
  files: yup.array().of(newFileValidationSchema),
});

export interface FolderFormValues {
  name: string;
  description?: string;
  files?: Array<SingleFileFormValue>;
}

const initialValues: FolderFormValues = {
  name: "",
};

function getFolderFormInputFromFolder(item: Folder): FolderFormValues {
  return {
    name: item.name,
    description: item.description,
  };
}

export interface FolderFormProps {
  folder?: Folder;
  className?: string;
  parentId?: string;
  /** folder parent path without rootname */
  parentPath?: string;
  workspaceId: string;
  workspaceRootname: string;
}

export default function FolderForm(props: FolderFormProps) {
  const { folder, className, workspaceId, workspaceRootname, parentPath } =
    props;

  const router = useRouter();
  const updateHook = useWorkspaceFolderUpdateMutationHook({
    onSuccess(data, params) {
      message.success("Folder updated");
      router.push(
        appWorkspacePaths.folder(workspaceId, data.body.folder.resourceId)
      );
    },
  });

  const createHook = useWorkspaceFolderAddMutationHook({
    onSuccess(data, params) {
      message.success("Folder created");
      router.push(
        appWorkspacePaths.folder(workspaceId, data.body.folder.resourceId)
      );
    },
  });

  const progressHandlerHook = useTransferProgressHandler();
  const uploadHook = useWorkspaceFileUploadMutationHook({
    onSuccess(data, params) {
      message.success("File uploaded");
      // router.push(
      //   appWorkspacePaths.file(workspaceId, data.body.file.resourceId)
      // );
    },
    onError(e, params) {
      const filepath = params[0].body.filepath;
      if (filepath) progressHandlerHook.setOpError(filepath, e);
    },
  });

  const hookLoading =
    uploadHook.loading || createHook.loading || updateHook.loading;
  const hookError = uploadHook.error || createHook.error || updateHook.error;

  const handleSubmitFile = async (input: SingleFileFormValue) => {
    if (input.file) {
      const filepath = addRootnameToPath(
        parentPath
          ? `${parentPath}${folderConstants.nameSeparator}${input.name}`
          : input.name,
        workspaceRootname
      );

      return await uploadHook.runAsync({
        body: {
          filepath,
          // fileId: input.resourceId,
          data: input.file,
          description: input.description,
          mimetype: input.mimetype,
          encoding: input.encoding,
        },
        onUploadProgress: progressHandlerHook.getProgressHandler(filepath),
      });
    }
  };

  const handleCreateFolder = (data: FolderFormValues) => {
    if (!folder) {
      const folderpath = parentPath
        ? `${parentPath}${folderConstants.nameSeparator}${data.name}`
        : data.name;

      return createHook.runAsync({
        body: {
          folder: {
            folderpath: addRootnameToPath(folderpath, workspaceRootname),
            description: data.description,
          },
        },
      });
    }
  };

  const handleUpdateFolder = (data: FolderFormValues) => {
    const folderpath = addRootnameToPath(
      parentPath
        ? `${parentPath}${folderConstants.nameSeparator}${data.name}`
        : data.name,
      workspaceRootname
    );

    return updateHook.runAsync({
      body: {
        // folderId: folder.resourceId,
        folderpath,
        folder: { description: data.description },
      },
    });
  };

  const { formik } = useFormHelpers({
    errors: hookError,
    formikProps: {
      validationSchema: folderValidation,
      initialValues: folder
        ? getFolderFormInputFromFolder(folder)
        : initialValues,
      onSubmit: async (data) => {
        if (data.files) {
          await Promise.all(data.files.map(handleSubmitFile));

          if (data.description) {
            await handleUpdateFolder(data);
          }
        } else if (folder) {
          await handleUpdateFolder(data);
        } else {
          await handleCreateFolder(data);
        }
      },
    },
  });

  const autofillName = useMemo(() => {
    return getFirstFoldername(formik.values.files || []);
  }, [formik.values.files]);

  const onAutofillName = () => {
    if (!autofillName || folder) {
      return;
    }

    formik.setValues({ ...formik.values, name: autofillName });
  };

  const onUpdateFolderName: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const name = evt.target.value;
    formik.setValues({ ...formik.values, name });

    if (name) {
      debouncedReplaceBaseFolderName(formik.values.files || [], name);
    }
  };

  const nameNode = (
    <Form.Item
      required
      label="Folder Name"
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
        onChange={onUpdateFolderName}
        placeholder="Enter folder name"
        disabled={hookLoading || !!folder}
        maxLength={systemConstants.maxNameLength}
        autoComplete="off"
      />
      {autofillName && !folder && (
        <Button
          type="link"
          onClick={onAutofillName}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Typography.Text
            style={{ textDecoration: "underline", color: "inherit" }}
          >
            Use <Typography.Text strong>{autofillName}</Typography.Text> from
            selected {formik.values.files?.length === 1 ? "file" : "files"}
          </Typography.Text>
        </Button>
      )}
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
        placeholder="Enter folder description"
        disabled={hookLoading}
        maxLength={systemConstants.maxDescriptionLength}
        autoSize={{ minRows: 3 }}
      />
    </Form.Item>
  );

  // TODO: include max file size
  const selectFolderNode = (
    <Form.Item
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      help={
        formik.touched.files &&
        isString(formik.errors.files) && (
          <FormError visible error={formik.errors.files} />
        )
      }
    >
      <Upload
        directory
        showUploadList={false}
        multiple={false}
        disabled={hookLoading}
        fileList={compact(formik.values.files?.map((item) => item.file))}
        beforeUpload={(file, fileList) => {
          let files = fileList.map(
            (file): SingleFileFormValue => ({
              file,
              mimetype: file.type,
              resourceId: undefined,
              name: file.webkitRelativePath,
              __localId: getNewFileLocalId(),
            })
          );
          let foldername = formik.values.name;

          if (folder) {
            files = replaceBaseFoldername(files, foldername);
          } else {
            foldername = getFirstFoldername(files) || foldername;
          }

          formik.setValues({ ...formik.values, name: foldername, files });
          return false;
        }}
      >
        <Button title="Select Folder">
          <Space>
            <CustomIcon icon={<UploadOutlined />} />
            Select Folder
          </Space>
        </Button>
      </Upload>
    </Form.Item>
  );

  let selectedFilesNode: ReactNode = null;

  if (formik.values.files?.length) {
    selectedFilesNode = (
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <SelectedFilesForm
          isDirectory
          values={formik.values.files}
          disabled={hookLoading}
          errors={formik.errors.files}
          touched={
            formik.touched.files as
              | FormikTouched<SingleFileFormValue>[]
              | undefined
          }
          onChange={(files) => {
            if (formik.values.name) {
              files = replaceBaseFoldername(files, formik.values.name);
            }

            formik.setValues({ ...formik.values, files });
          }}
        />
      </Form.Item>
    );
  }

  return (
    <div className={cx(formClasses.formBodyClassName, className)}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>Folder Form</Typography.Title>
          </Form.Item>
          <FormAlert error={hookError} />
          {selectedFilesNode}
          {nameNode}
          {descriptionNode}
          {selectFolderNode}
          <FilesFormUploadProgress
            identifiers={progressHandlerHook.identifiers}
          />
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={hookLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
