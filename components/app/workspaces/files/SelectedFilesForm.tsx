import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import DeleteButton from "@/components/utils/buttons/DeleteButton";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import prettyBytes from "pretty-bytes";
import { FieldError, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { SingleFileForm } from "./SingleFileForm";
import { newFileValidationSchema } from "./validation.ts";

export const selectedFilesSchema = z.object({
  files: z.array(newFileValidationSchema),
});

export interface SelectedFilesFormProps extends StyleableComponentProps {
  form: UseFormReturn<z.infer<typeof selectedFilesSchema>>;
  isDirectory?: boolean;
  beforeUpdateModifyName?: (name: string) => string;
}

function getFirstErrorMessage(errors: Record<string, FieldError>) {
  const errorKeys = Object.keys(errors);
  return errorKeys.length ? errors[errorKeys[0]]?.message : undefined;
}

export function SelectedFilesForm(props: SelectedFilesFormProps) {
  const { form, className, style, isDirectory, beforeUpdateModifyName } = props;

  const wFiles = form.watch("files");

  const handleRemoveFile = (index: number) => {
    const update = wFiles.filter((nextValue, nextIndex) => nextIndex !== index);
    form.setValue("files", update);
  };

  // TODO: show file entry error in panel
  const panelNodes = wFiles.map((value, index) => {
    const errors = form.getFieldState(`files.${index}`)?.error;
    const errorMessage = getFirstErrorMessage(
      (errors || {}) as Record<string, FieldError>
    );

    return (
      <AccordionItem key={value.__localId} value={value.__localId}>
        <AccordionTrigger>
          <div className="flex flex-1 items-center mr-2">
            <div className="flex flex-1 flex-col items-start">
              <span className="line-clamp-1 text-left">{value.name}</span>
              {errorMessage && (
                <span className="text-sm font-medium text-destructive text-left">
                  {errorMessage}
                </span>
              )}
            </div>
            <div className="space-x-4 ml-4 flex items-center">
              {value?.file ? (
                <span className="text-secondary">
                  {prettyBytes(value.file.size)}
                </span>
              ) : null}
              <DeleteButton onClick={() => handleRemoveFile(index)} />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <SingleFileForm
            key={value.__localId}
            index={index}
            form={form}
            isExistingFile={!!value.resourceId}
            isDirectory={isDirectory}
            beforeUpdateModifyName={beforeUpdateModifyName}
          />
        </AccordionContent>
      </AccordionItem>
    );
  });

  const collapseNode = panelNodes.length ? (
    <div className="mb-4">
      <Accordion type="single" collapsible>
        {panelNodes}
      </Accordion>
    </div>
  ) : null;

  return (
    <div className={className} style={style}>
      {collapseNode}
    </div>
  );
}
