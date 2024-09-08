import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import DeleteButton from "@/components/utils/buttons/DeleteButton";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import prettyBytes from "pretty-bytes";
import { UseFormReturn } from "react-hook-form";
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

export function SelectedFilesForm(props: SelectedFilesFormProps) {
  const { form, className, style, isDirectory, beforeUpdateModifyName } = props;

  const wFiles = form.watch("files");

  const handleRemoveFile = (index: number) => {
    const update = wFiles.filter((nextValue, nextIndex) => nextIndex !== index);
    form.setValue("files", update);
  };

  // TODO: show file entry error in panel
  const panelNodes = wFiles.map((value, index) => (
    <AccordionItem key={value.__localId} value={value.__localId}>
      <AccordionTrigger>
        <div className="flex">
          <div className="flex-1">
            <span>{value.name}</span>
            {/* {errors && errors[index] ? (
              <span className="text-red-600">Entry contains error</span>
            ) : null} */}
          </div>
          <div className="space-x-4 ml-4">
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
  ));

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
