import { flatten, map } from "lodash";
import React from "react";
import { FieldObject } from "./types";
import { extractContainedFieldObjects } from "./utils";

export function useContainedFieldObjects(props: { fieldObject: FieldObject }) {
  const { fieldObject } = props;
  const containedObjects = React.useMemo(() => {
    const objectsMap: Map<string | undefined, FieldObject> = new Map([
      [fieldObject.name, fieldObject],
    ]);

    objectsMap.forEach((nextObject) => {
      const nextContainedObjects = flatten(
        map(nextObject.fields, (field) =>
          extractContainedFieldObjects(field.data)
        )
      );
      nextContainedObjects.forEach((fieldbase) =>
        objectsMap.set(fieldbase.name, fieldbase)
      );
    });

    return objectsMap;
  }, [fieldObject]);

  return containedObjects;
}
