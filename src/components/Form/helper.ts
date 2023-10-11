import { DocumentElementType } from "enums";
import { SelectTypes } from "enums/Form";
import { DynamicFieldProps } from "./DynamicCreateFields";

const transformObject = (
  originalObject: DynamicFieldProps[]
  // options: { parentName?: string }
) => {
  const transformedObject = [];
  let currentLabel = null;
  let currentFields = [];

  let index = 0;
  for (const obj of originalObject) {
    if (obj.type === DocumentElementType.RecordList) {
      if (currentLabel != null) {
        transformedObject.push({ label: currentLabel, fields: currentFields });
      }
      transformedObject.push({
        label: {
          ...obj,
          type: DocumentElementType.Label,
          name: obj.title || obj.label,
        } as typeof obj,
        fields: [obj],
        type: DocumentElementType.RecordList,
      });

      if (!originalObject[index + 1]) {
        currentLabel = null;
        continue;
      }

      if (originalObject[index + 1]?.type !== "label") {
        if (!currentLabel) {
          currentLabel = { type: "label", name: "label_placeholder" };
        }
      } else {
        currentLabel = null;
      }

      currentFields = [];
      continue;
    }
    if (index === 0 && obj.type !== "label") {
      currentLabel = { type: "label", name: "label_placeholder" };
    }
    if (obj.type === "label") {
      if (currentLabel !== null) {
        transformedObject.push({ label: currentLabel, fields: currentFields });
      }
      currentLabel = obj;
      currentFields = [];
    } else {
      currentFields.push(obj);
    }
    index++;
  }

  if (currentLabel != null) {
    transformedObject.push({ label: currentLabel, fields: currentFields });
  }

  return transformedObject;
};

export default transformObject;

export const getAcceptedFileTypes = (type: string) => {
  switch (type) {
    case DocumentElementType.Image:
      return "image/*";
    case "video":
      return "video/*";
    case "audio":
      return "audio/*";
    default:
      return "*";
  }
};
export const transformFieldsOptions = (
  fields: DatasetDesign["fields"]["fields"],
  options: { prefixName?: string }
) => {
  return fields.map(({ multi, ...field }) => ({
    label: field.title,
    name: options.prefixName
      ? `${options.prefixName}.${field.slug}`
      : field.slug,
    options: field.list_items,
    date_type: field.date_type,
    multi:
      field.type === DocumentElementType.Select
        ? field.list_default_display_type === SelectTypes.Multiple
        : multi,
    ...field,
  }));
};
