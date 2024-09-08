import { Button } from "@/components/ui/button.tsx";
import { Form } from "@/components/ui/form.tsx";
import { cn } from "@/components/utils.ts";
import { FormAlert } from "@/components/utils/FormAlert";
import { useToast } from "@/hooks/use-toast.ts";
import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import {
  useWorkspaceFileUpdateMutationHook,
  useWorkspaceFileUploadMutationHook,
} from "@/lib/hooks/mutationHooks";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers";
import { useTransferProgressHandler } from "@/lib/hooks/useTransferProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { File as FimidaraFile } from "fimidara";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FilesFormUploadProgress } from "./FilesFormUploadProgress";
import { MultipleFilesForm } from "./MultipleFilesForm";
import { SingleFileForm } from "./SingleFileForm";
import { SingleFileFormValue } from "./types";
import { getNewFileLocalId } from "./utils";
import { newFileValidationSchema } from "./validation";

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

const newFileFormValidationSchema = z.object({
  files: z.array(newFileValidationSchema).min(1),
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
  const { toast } = useToast();
  const progressHandlerHook = useTransferProgressHandler();
  const updateHook = useWorkspaceFileUpdateMutationHook({
    onSuccess(data, params) {
      toast({ title: "File updated" });
      // router.push(
      //   appWorkspacePaths.file(workspaceId, data.body.file.resourceId)
      // );
    },
  });
  const uploadHook = useWorkspaceFileUploadMutationHook({
    onSuccess(data, params) {
      toast({ title: "File uploaded" });
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
            description: input.description || undefined,
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
              description: input.description || undefined,
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
          description: input.description || undefined,
          mimetype: input.mimetype,
          encoding: input.encoding,
        },
        onUploadProgress: progressHandlerHook.getProgressHandler(filepath),
      });
    }
  };

  const onSubmit = async (
    data: z.infer<typeof newFileFormValidationSchema>
  ) => {
    await Promise.all(data.files.map(submitFile));
  };

  const form = useForm<z.infer<typeof newFileFormValidationSchema>>({
    resolver: zodResolver(newFileFormValidationSchema),
    defaultValues: file ? getFileFormInputFromFile(file) : initialValues,
  });

  useFormHelpers(form, { errors: mergedHook.error });

  let contentNode: React.ReactNode = null;

  if (file) {
    contentNode = <SingleFileForm isExistingFile form={form} index={0} />;
  } else {
    contentNode = (
      <div className="mb-4">
        <MultipleFilesForm form={form} disabled={mergedHook.loading} />
      </div>
    );
  }

  // TODO: should "uploading files progress" below open the progress drawer on
  // click?
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8", className)}
      >
        <div className="mb-4">
          <h4>File Form</h4>
        </div>
        <FormAlert error={mergedHook.error} />
        {contentNode}
        <FilesFormUploadProgress
          identifiers={progressHandlerHook.identifiers}
        />
        <div className="my-4">
          <Button type="submit" loading={mergedHook.loading}>
            {file ? "Update File" : "Upload File"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
