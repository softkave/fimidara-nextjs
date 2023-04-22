import { flatten, map } from "lodash";
import React from "react";
import { FieldObject } from "./types";
import { extractContainedFieldObjects } from "./utils";

export function useContainedFieldObjects(props: { fieldObject: FieldObject }) {
  const { fieldObject } = props;
  const containedObjects = React.useMemo(() => {
    const objectsMap: Map<FieldObject, FieldObject> = new Map([
      [fieldObject, fieldObject],
    ]);

    objectsMap.forEach((nextObject) => {
      const nextContainedObjects = flatten(
        map(nextObject.fields, extractContainedFieldObjects)
      );
      nextContainedObjects.forEach((fieldbase) =>
        objectsMap.set(fieldbase, fieldbase)
      );
    });

    return objectsMap;
  }, [fieldObject]);

  return containedObjects;
}
