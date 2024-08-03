import styles from "@/components/utils/form/form.module.css";
import { FormAlert } from "@/components/utils/FormAlert";
import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import {
  useWorkspaceFileUpdateMutationHook,
  useWorkspaceFileUploadMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { useTransferProgressHandler } from "@/lib/hooks/useTransferProgress";
import { messages } from "@/lib/messages/messages";
import { fileValidationParts } from "@/lib/validation/file";
import { systemValidation } from "@/lib/validation/system";
import { yupObject } from "@/lib/validation/utils";
import { css, cx } from "@emotion/css";
import { Button, Form, message } from "antd";
import Title from "antd/es/typography/Title";
import { File as FimidaraFile } from "fimidara";
import { isString } from "lodash-es";
import * as yup from "yup";
import { FilesFormUploadProgress } from "./FilesFormUploadProgress";
import { MultipleFilesForm } from "./MultipleFilesForm";
import { SingleFileForm } from "./SingleFileForm";
import { SingleFileFormValue } from "./types";
import { getNewFileLocalId } from "./utils";
import { newFileValidationSchema } from "./validation";
import FormError from "@/components/utils/form/FormError.tsx";

export interface FileFormValue {
  files: Array<SingleFileFormValue>;
}

const initialValues: FileFormValue = {
  files: [],
};

function getFileFormInputFromFile(item: FimidaraFile): FileFormValue {
  return {
    files: [
      {
        __localId: getNewFileLocalId(),
        resourceId: item.resourceId,
        name: item.name,
        description: item.description,
        encoding: item.encoding,
        mimetype: item.mimetype,
      },
    ],
  };
}

const existingFileValidationSchema = yupObject<
  Omit<SingleFileFormValue, "__localId" | "resourceId">
>({
  name: fileValidationParts.filename.required(messages.fieldIsRequired),
  description: systemValidation.description.nullable(),
  file: yup.mixed(),
  encoding: yup.string(),
  mimetype: yup.string(),
});
const newFileFormValidationSchema = yupObject<FileFormValue>({
  files: yup.array().of(newFileValidationSchema).min(1).required(),
});
const existingFileFormValidationSchema = yupObject<FileFormValue>({
  files: yup.array().of(existingFileValidationSchema).max(1).required(),
});

export interface FileFormProps {
  file?: FimidaraFile;
  className?: string;
  /** file parent folder without rootname. */
  folderpath?: string;
  workspaceId: string;
  workspaceRootname: string;
  directory?: boolean;
}

export default function FileForm(props: FileFormProps) {
  const { file, className, folderpath, workspaceRootname, directory } = props;
  const progressHandlerHook = useTransferProgressHandler();
  const updateHook = useWorkspaceFileUpdateMutationHook({
    onSuccess(data, params) {
      message.success("File updated");
      // router.push(
      //   appWorkspacePaths.file(workspaceId, data.body.file.resourceId)
      // );
    },
  });
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
  const mergedHook = file ? updateHook : uploadHook;

  const submitFile = async (input: SingleFileFormValue) => {
    const filepath = addRootnameToPath(
      folderpath
        ? `${folderpath}${folderConstants.nameSeparator}${input.name}`
        : input.name,
      workspaceRootname
    );

    if (input.resourceId) {
      if (input.file) {
        return await uploadHook.runAsync({
          body: {
            fileId: input.resourceId,
            data: input.file,
            size: input.file.size,
            description: input.description,
            mimetype: input.mimetype,
            encoding: input.encoding,
          },
          onUploadProgress: progressHandlerHook.getProgressHandler(filepath),
        });
      } else {
        return await updateHook.runAsync({
          body: {
            fileId: input.resourceId,
            file: {
              description: input.description,
              mimetype: input.mimetype,

              // TODO: add to server
              // encoding: input.encoding,
            },
          },
        });
      }
    } else {
      if (!input.file) {
        // TODO: show error?
        return;
      }

      return await uploadHook.runAsync({
        body: {
          filepath,
          data: input.file,
          size: input.file.size,
          description: input.description,
          mimetype: input.mimetype,
          encoding: input.encoding,
        },
        onUploadProgress: progressHandlerHook.getProgressHandler(filepath),
      });
    }
  };

  const { formik } = useFormHelpers({
    errors: mergedHook.error,
    formikProps: {
      validationSchema: file
        ? existingFileFormValidationSchema
        : newFileFormValidationSchema,
      initialValues: file ? getFileFormInputFromFile(file) : initialValues,
      onSubmit: async (data) => {
        await Promise.all(data.files.map(submitFile));
      },
    },
  });

  let contentNode: React.ReactNode = null;

  if (file) {
    const touched = formik.touched?.files ? formik.touched.files[0] : undefined;
    const error = formik.errors?.files ? formik.errors.files[0] : undefined;
    contentNode = (
      <Form.Item
        help={
          touched && isString(error) ? (
            <FormError visible error={error} />
          ) : null
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <SingleFileForm
          value={formik.values.files[0]}
          touched={touched}
          errors={error}
          disabled={mergedHook.loading}
          onChange={(partialValue) =>
            formik.setValues({
              files: [{ ...formik.values.files[0], ...partialValue }],
            })
          }
        />
      </Form.Item>
    );
  } else {
    contentNode = (
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <MultipleFilesForm
          values={formik.values.files}
          disabled={mergedHook.loading}
          errors={formik.errors.files}
          touched={formik.touched.files}
          onChange={(files) => formik.setValues({ files })}
        />
      </Form.Item>
    );
  }

  // TODO: should "uploading files progress" below open the progress drawer on
  // click?
  return (
    <div className={cx(styles.formBody, className)}>
      <div className={styles.formContentWrapper}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Title level={4}>File Form</Title>
          </Form.Item>
          <FormAlert error={mergedHook.error} />
          {contentNode}
          <FilesFormUploadProgress
            identifiers={progressHandlerHook.identifiers}
          />
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={mergedHook.loading}
            >
              {file ? "Update File" : "Upload File"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
