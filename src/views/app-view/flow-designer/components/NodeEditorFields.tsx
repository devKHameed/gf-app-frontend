import { DevTool } from "@hookform/devtools";
import { FileCopy } from "@mui/icons-material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Box,
  Button,
  Card,
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import DynamicCreateFields from "components/Form/DynamicCreateFields";
import { transformFieldsOptions } from "components/Form/helper";
import FormField from "components/FormField";
import IOSSwitch from "components/IOSSwitch";
import Scrollbar from "components/Scrollbar";
import Spin from "components/Spin";
import {
  SYSTEM_NODE_APP,
  SystemFields,
  SystemModules,
  WIDGET_START_NODE_MODULE,
  WidgetEditorFields,
} from "constants/Fusion";
import { FormElements } from "constants/index";
import { DocumentElementType } from "enums";
import { ModuleType, ParameterType } from "enums/3pApp";
import { SystemModuleType } from "enums/Fusion";
import { isArray, isPlainObject, isString } from "lodash";
import Fusion from "models/Fusion";
import use3pAppModules from "queries/3p-app/use3pAppModules";
import use3pApps from "queries/3p-app/use3pApps";
import useListAppConnections from "queries/3p-app/useListAppConnections";
import useListAppWebhooks from "queries/3p-app/useListAppWebhooks";
import { ApiModels } from "queries/apiModelMapping";
import useAuthenticate from "queries/auth/useAuthenticate";
import useFusion from "queries/fusion/useFusion";
import useFusionConnections from "queries/fusion/useFusionConnections";
import useFusionWebhooks from "queries/fusion/useFusionWebhooks";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import React, {
  PropsWithChildren,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Controller,
  FormProvider,
  UseFormReturn,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useParams } from "react-router-dom";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import {
  applyToValues,
  getIncomingOperators,
  getLocalStorage,
  getOpenIteratorOptions,
  isValidJson,
  setLocalStorage,
} from "utils";
import { parseExpressionToTags, parseTagsToExpression } from "utils/tagsParser";
import ConnectionFields from "./ConnectionFields";
import FlowFieldWrapper from "./FlowFieldWrapper";
import FlowPopover from "./FlowPopover";
import ArrayFields from "./ParamFields/ArrayFields";
import BooleanField from "./ParamFields/BooleanField";
import CertField from "./ParamFields/CertField";
import CodeField from "./ParamFields/CodeField";
import CollectionFields from "./ParamFields/CollectionFields";
import DateField from "./ParamFields/DateField";
import FileFolderField from "./ParamFields/FileFolderField";
import FileSemanticField from "./ParamFields/FileSemanticField";
import FilterField from "./ParamFields/FilterField";
import IntegerField from "./ParamFields/IntegerField";
import MixedTagField, { MixedTagFieldRef } from "./ParamFields/MixedTagField";
import NestedFieldsWrapper from "./ParamFields/NestedFieldsWrapper";
import { getSystemModuleInterfaces } from "./ParamFields/ParamMapper";
import SelectField from "./ParamFields/SelectField";
import TimeField from "./ParamFields/TimeField";
import TimezoneField from "./ParamFields/TimezoneField";
import WebhookFields from "./WebhookFields";

export type BaseParamFieldProps = {
  field: MappableParameter;
  parentNamePath?: string;
} & UseFormReturn;

type ParamFieldProps = {
  mappable?: boolean;
  parentNamePath?: string;
} & (
  | {
      documentElementType: true;
      field: DataField;
    }
  | {
      documentElementType?: false;
      field: MappableParameter;
    }
);

type DefaultFieldProps = {} & BaseParamFieldProps;

type ParamFieldWrapperProps<P extends BaseParamFieldProps = any> = {
  field: MappableParameter;
  mappable?: boolean;
  parentNamePath?: string;
  FieldComponent: React.ComponentType<P>;
  FieldComponentProps?: P;
};

type DocumentElementTypeFieldWrapperProps<P extends BaseParamFieldProps = any> =
  {
    field: MappableParameter;
    mappable?: boolean;
    parentNamePath?: string;
    FieldComponent: React.ComponentType<P>;
    FieldComponentProps?: P;
  };

const DefaultField: React.FC<DefaultFieldProps> = memo(
  (props) => {
    const { field, register, parentNamePath, watch, setValue } = props;
    const { name: fieldName } = field;

    const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

    return (
      <TextField
        id={name}
        // name={name}
        variant="filled"
        size="small"
        fullWidth
        // value={watched}
        // onChange={(e) => setValue(name, e.target.value)}
        {...register(name)}
        // value={watchNameValue ?? ""}
      />
    );
  },
  (prev, next) => prev.formState.isDirty === next.formState.isDirty
);

const mapFieldsValueMap = new Map<string, unknown>();

const MappableSwitch: React.FC<
  { name: string; parentNamePath?: string } & UseFormReturn
> = memo(
  (props) => {
    const { name: fieldName, control, parentNamePath, getValues } = props;
    const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

    return (
      <Controller
        control={control}
        name={`mapped.${name}`.split(".").join("_")}
        render={({ field }) => (
          <FormControlLabel
            control={
              <IOSSwitch
                onChange={(e) => {
                  // console.log("before mapped: ", getValues(name));
                  mapFieldsValueMap.set(name, getValues(name));
                  field.onChange(e.target.checked);
                }}
                checked={field.value ?? false}
              />
            }
            sx={{
              color: (theme) => theme.palette.primary.main,
              ".MuiFormControlLabel-label": { ml: 1 },
            }}
            label="Map"
            labelPlacement="end"
          />
        )}
      />
    );
  },
  (prev, next) => prev.formState.isDirty === next.formState.isDirty
);

const getKeys = (obj: Record<string, unknown>, prefix: string) => {
  return Object.entries(obj).reduce<[string, unknown][]>(
    (acc, [key, value]) => {
      if (isArray(value)) {
        acc.push(
          ...value.reduce<[string, unknown][]>((prev, v, idx) => {
            prev.push(...getKeys(v, `${prefix}.${key}.${idx}`));

            return prev;
          }, [])
        );
      } else if (isPlainObject(value)) {
        acc.push(
          ...getKeys(value as Record<string, unknown>, `${prefix}.${key}`)
        );
      } else {
        acc.push([`${prefix}.${key}`, value]);
      }

      return acc;
    },
    []
  );
};

const tagFieldRefMap = new Map<
  string,
  React.MutableRefObject<MixedTagFieldRef | undefined>
>();

type MapHandlerProps = {
  tagFieldRef: React.MutableRefObject<MixedTagFieldRef | undefined>;
  mapped: boolean;
  name: string;
  mappable?: boolean;
  type: ParameterType;
} & UseFormReturn;

const MapHandler: React.FC<MapHandlerProps> = memo(
  (props) => {
    const { tagFieldRef, mapped, name, mappable, type, ...form } = props;
    // console.log(
    //   "🚀 ~ file: NodeEditorFields.tsx:190 ~ mapped:",
    //   mapped,
    //   mappable,
    //   name,
    //   tagFieldRef
    // );

    const theme = useTheme();

    useEffect(() => {
      if (mappable && name) {
        handleMappable();
      }
    }, [mapped, mappable, name, type]);

    const handleMappable = () => {
      const value = mapFieldsValueMap.get(name);
      // console.log(
      //   "🚀 ~ file: NodeEditorFields.tsx:232 ~ handleMappable ~ value:",
      //   value
      // );
      if (type === ParameterType.Collection || type === ParameterType.Array) {
        if (mapped) {
          if (isPlainObject(value) || isArray(value)) {
            const parsedValue = applyToValues(value, parseTagsToExpression);
            // console.log(
            //   "🚀 ~ file: NodeEditorFields.tsx:248 ~ handleMappable ~ parsedValue:",
            //   parsedValue
            // );
            setTimeout(() => {
              // console.log(tagFieldRef.current);
              tagFieldRef.current?.setValue(JSON.stringify(parsedValue));
              form.setValue(name, JSON.stringify(parsedValue));
            }, Infinity - 1);
          }
        } else {
          // console.log(
          //   "name",
          //   name,
          //   value,
          //   form.getValues(),
          //   mapFieldsValueMap.get(name)
          // );
          if (isString(value)) {
            // console.log(parsedValue, JSON.stringify({ a: '"[[{ b: "b" }]]"' }));
            if (isValidJson(value)) {
              const parsedValue = JSON.parse(value);
              const parentObject = applyToValues(
                parsedValue,
                parseExpressionToTags,
                theme.palette.primary.main
              );

              const keys = getKeys(
                parentObject as Record<string, unknown>,
                name
              );
              // console.log(
              //   "🚀 ~ file: NodeEditorFields.tsx:253 ~ handleMappable ~ keys:",
              //   keys
              // );
              setTimeout(() => {
                keys.forEach((keyValue) => {
                  let [key, getValue] = keyValue;
                  // console.log(
                  //   "🚀 ~ file: NodeEditorFields.tsx:261 ~ keys.forEach ~ getValue:",
                  //   getValue,
                  //   key
                  // );
                  const isFieldMapped = form.getValues(
                    `mapped.${key}`.split(".").join("_")
                  );
                  if (isFieldMapped) {
                    getValue = applyToValues(getValue, parseTagsToExpression);
                  }
                  form.setValue(key, getValue);
                  // console.log(key, tagFieldRefMap.get(key), tagFieldRefMap);
                  tagFieldRefMap
                    .get(key)
                    ?.current?.setValue(getValue as string);
                });
              }, Infinity - 1);
            }
          }
        }
      }
    };

    return <></>;
  },
  (prev, next) =>
    prev.mapped === next.mapped &&
    prev.mappable === next.mappable &&
    prev.name === next.name &&
    prev.type === next.type &&
    prev.tagFieldRef.current === next.tagFieldRef.current
);

const ParamFieldWrapper: React.FC<ParamFieldWrapperProps> = (props) => {
  const {
    field,
    mappable,
    FieldComponent,
    FieldComponentProps = {},
    parentNamePath,
  } = props;
  const { label, name: fieldName, help, type } = field;

  const form = useFormContext();
  // const theme = useTheme();

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;
  const mapped = form.watch(`mapped.${name}`.split(".").join("_"));

  const tagFieldRef = useRef<MixedTagFieldRef>();

  useEffect(() => {
    tagFieldRefMap.set(name, tagFieldRef);
  }, [name]);
  // console.log(
  //   "🚀 ~ file: NodeEditorFields.tsx:254 ~ tagFieldRef:",
  //   tagFieldRef
  // );

  // useEffect(() => {
  //   const currentValue = form.getValues(name);
  //   if (mappable) {
  //     if (mapped) {
  //       if (isPlainObject(currentValue) || isArray(currentValue)) {
  //         const newValue = JSON.stringify(
  //           applyToValues(currentValue, parseExpressionToTags)
  //         );
  //         form.setValue(name, newValue);
  //         tagFieldRef.current?.setValue(newValue);
  //       } else {
  //         const newValue = parseExpressionToTags(
  //           toString(currentValue),
  //           theme.palette.primary.main
  //         );
  //         form.setValue(name, newValue);
  //         tagFieldRef.current?.setValue(newValue);
  //       }
  //     } else {
  //       if (isValidJson(currentValue)) {
  //         const obj = JSON.parse(currentValue);
  //         const parsed = applyToValues(obj, parseTagsToExpression);
  //         setTimeout(() => {
  //           form.setValue(name, parsed);
  //         }, Infinity - 1);
  //       } else {
  //         const parsed = applyToValues(currentValue, parseTagsToExpression);
  //         setTimeout(() => {
  //           form.setValue(name, parsed);
  //         }, Infinity - 1);
  //       }
  //     }
  //   }
  // }, [mapped]);

  return (
    <>
      <MapHandler
        tagFieldRef={tagFieldRef}
        mapped={mapped}
        name={name}
        mappable={mappable}
        type={type as ParameterType}
        {...form}
      />
      <NestedFieldsWrapper
        {...form}
        field={field}
        mappable={mappable}
        parentNamePath={parentNamePath}
      >
        <FlowFieldWrapper
          label={label || fieldName}
          help={help}
          extra={
            field.type !== ParameterType.Text && mappable ? (
              <MappableSwitch
                {...form}
                name={fieldName}
                parentNamePath={parentNamePath}
              />
            ) : null
          }
        >
          {!mapped && field.type !== ParameterType.Text ? (
            <FieldComponent
              {...FieldComponentProps}
              {...form}
              field={field}
              parentNamePath={parentNamePath}
            />
          ) : (
            <MixedTagField
              {...form}
              field={field}
              parentNamePath={parentNamePath}
              ref={tagFieldRef}
            />
          )}
        </FlowFieldWrapper>
      </NestedFieldsWrapper>
    </>
  );
};

// const TaggerField: React.FC<BaseParamFieldProps> = React.memo(
//   (props) => {
//     const { field, parentNamePath, ...form } = props;

//     const { name: fieldName } = field;
//     const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

//     const mapped = form.watch(`mapped.${name}`.split(".").join("_"));

//     return (
//       <MixedTagField
//         {...form}
//         field={field}
//         key={`${name}-${mapped}`}
//         parentNamePath={parentNamePath}
//       />
//     );
//   },
//   (prev, next) => prev.formState.isDirty === next.formState.isDirty
// );

const DocumentElementTypeFieldWrapper: React.FC<{
  field: DataField;
  parentNamePath?: string;
}> = (props) => {
  const { field, parentNamePath } = props;

  const form = useFormContext();

  const mapped = form.watch(`mapped.${field.slug}`.split(".").join("_"));

  const [transformField] = useMemo(() => {
    return transformFieldsOptions([field], {
      prefixName: parentNamePath,
    });
  }, [field, parentNamePath]);

  return (
    <FlowFieldWrapper
      label={field.title}
      help={field.tooltip}
      extra={<MappableSwitch {...form} name={field.slug} />}
    >
      {!mapped ? (
        <DynamicCreateFields
          {...(transformField as any)}
          label=""
          formSubmit={false}
        />
      ) : (
        <MixedTagField
          {...form}
          field={{ name: field.slug } as MappableParameter}
        />
      )}
    </FlowFieldWrapper>
  );
};

export const ParamField: React.FC<ParamFieldProps> = (props) => {
  const { field, mappable, parentNamePath, documentElementType } = props;

  if (documentElementType) {
    return (
      <DocumentElementTypeFieldWrapper
        field={field}
        parentNamePath={parentNamePath}
      />
    );
  } else {
    const { type } = field;

    const baseProps = {
      field,
      mappable,
      parentNamePath,
    };

    switch (type) {
      case ParameterType.Boolean:
        return (
          <ParamFieldWrapper {...baseProps} FieldComponent={BooleanField} />
        );
      case ParameterType.Select:
        return (
          <ParamFieldWrapper {...baseProps} FieldComponent={SelectField} />
        );
      case ParameterType.Integer:
      case ParameterType.UInteger:
      case ParameterType.Timestamp:
      case ParameterType.Port:
      case ParameterType.Number:
        return (
          <ParamFieldWrapper {...baseProps} FieldComponent={IntegerField} />
        );
      case ParameterType.Timezone:
        return (
          <ParamFieldWrapper {...baseProps} FieldComponent={TimezoneField} />
        );
      case ParameterType.Collection:
        return (
          <ParamFieldWrapper
            {...baseProps}
            FieldComponent={CollectionFields}
            FieldComponentProps={{ mappable }}
          />
        );
      case ParameterType.Array:
        return (
          <ParamFieldWrapper
            {...baseProps}
            FieldComponent={ArrayFields}
            FieldComponentProps={{ mappable }}
          />
        );

      case ParameterType.Filter:
        return (
          <ParamFieldWrapper
            {...baseProps}
            FieldComponent={FilterField}
            FieldComponentProps={{ mappable }}
          />
        );

      case ParameterType.Hidden:
        return <></>;
      case ParameterType.Date:
        return <ParamFieldWrapper {...baseProps} FieldComponent={DateField} />;
      case ParameterType.Time:
        return <ParamFieldWrapper {...baseProps} FieldComponent={TimeField} />;
      case ParameterType.Cert:
        return (
          <ParamFieldWrapper
            {...baseProps}
            FieldComponentProps={{ type: "cert" }}
            FieldComponent={CertField}
          />
        );
      case ParameterType.PKey:
        return (
          <ParamFieldWrapper
            {...baseProps}
            FieldComponentProps={{ type: "pkey" }}
            FieldComponent={CertField}
          />
        );
      case ParameterType.File:
      case ParameterType.Folder:
        return (
          <ParamFieldWrapper {...baseProps} FieldComponent={FileFolderField} />
        );
      case "filename-buffer-semantic":
        return (
          <ParamFieldWrapper
            {...baseProps}
            FieldComponent={FileSemanticField}
          />
        );
      case ParameterType.Code:
        return (
          <ParamFieldWrapper
            {...baseProps}
            FieldComponent={CodeField}
            FieldComponentProps={{ mode: field.code ?? "javascript" }}
          />
        );
      default:
        return (
          <ParamFieldWrapper {...baseProps} FieldComponent={DefaultField} />
        );
    }
  }
};

const ChargePaymentFields: React.FC = () => {
  const { data: authData } = useAuthenticate();
  const accounts = authData?.accounts || [];
  const accountOptions =
    accounts?.map((account) => ({
      label: account.name,
      value: account.slug,
    })) || [];

  return (
    <>
      <ParamField
        field={{
          name: "account_slug",
          type: ParameterType.Select,
          label: "Account",
          options: accountOptions,
          required: true,
        }}
      />
      <ParamField
        field={{
          name: "amount",
          type: ParameterType.Number,
          label: "Amount ($)",
          help: "Amount to charge the selected account in dollars",
          required: true,
          default: 1,
          validate: {
            min: 0,
          },
        }}
      />
    </>
  );
};

// const SystemWebhookFields: React.FC<{
//   operator?: FusionOperator;
// }> = (props) => {
//   const { operator } = props;

//   return (
//     <Controller
//       control={control}
//       name="webhook_slug"
//       render={({ field }) => <SystemWebhookPopover operator={operator} />}
//     />
//   );
// };

const DocumentDesignField: React.FC<{
  documents: DatasetDesign[];
  name?: string;
  parentNamePath?: string;
}> = (props) => {
  const { documents, name = "document_slug", parentNamePath = "" } = props;
  const documentOptions = documents.map((doc) => ({
    label: doc.name,
    value: doc.slug,
  }));

  return (
    <ParamField
      key={`document-field-key-${documents.length}`}
      field={{
        name,
        type: ParameterType.Select,
        label: "Document",
        options: documentOptions,
      }}
      parentNamePath={parentNamePath}
    />
  );
};

const RecordSlugField: React.FC = (props) => {
  return (
    <ParamField
      field={{
        name: "record_slug",
        type: ParameterType.Text,
        label: "ID",
      }}
      mappable
    />
  );
};

const TagFields: React.FC = (props) => {
  const { data: documents = [] } = useListItems({
    modelName: "dataset-design",
  });

  return (
    <>
      <DocumentDesignField documents={documents} />
      <RecordSlugField />
      <ParamField
        field={{
          name: "tag_value",
          type: ParameterType.Text,
          label: "Tag Value",
        }}
      />
    </>
  );
};

const getFieldType = (type: DocumentElementType) => {
  switch (type) {
    case DocumentElementType.Date:
      return ParameterType.Date;
    case DocumentElementType.Number:
      return ParameterType.UInteger;
    case DocumentElementType.Checkbox:
    case DocumentElementType.Radio:
    case DocumentElementType.Select:
      return ParameterType.Select;
    default:
      return ParameterType.Text;
  }
};

const getDocumentCollectionSpec = (
  fields: DatasetDesign["fields"]["fields"] = []
): MappableParameter[] => {
  const spec: MappableParameter[] = [];
  fields.forEach((field) => {
    const { title, slug } = field;
    const specField: MappableParameter = {
      name: slug as string,
      label: (title || slug) as string,
    };
    if (field.type === DocumentElementType.RecordList) {
      specField.type = ParameterType.Array;
      specField.spec = getDocumentCollectionSpec(field.fields || []);
    } else if (field.type === DocumentElementType.SubRecord) {
      specField.type = ParameterType.Collection;
      specField.spec = getDocumentCollectionSpec(field.fields || []);
    } else if (
      [
        DocumentElementType.Image,
        DocumentElementType.File,
        DocumentElementType.AudioVideo,
      ].includes(field.type)
    ) {
      const spec = [
        {
          name: "name",
          label: "File Name",
          type: ParameterType.Text,
        },
        {
          name: "url",
          label: "File Url",
          type: ParameterType.Text,
        },
      ];

      if (!field.multi) {
        specField.type = ParameterType.Collection;
        specField.spec = spec;
      } else {
        specField.type = ParameterType.Array;
        specField.spec = spec;
      }
    } else {
      specField.type = getFieldType(field.type as DocumentElementType);

      if (specField.type === ParameterType.Select) {
        specField.options = (field.list_items || []) as any;
        if (field.list_default_display_type === "multi_drop_down") {
          specField.multi = true;
        }
      }

      if (specField.type === ParameterType.Date) {
        if ((field.date_type as string)?.toLowerCase().includes("time")) {
          specField.time = true;
        }
      }
    }
    spec.push(specField);
  });

  return spec;
};

type TreeDataNode = {
  key: string;
  title: string;
  children?: TreeDataNode[];
};

const getFieldsTree = (
  fields: DatasetDesign["fields"]["fields"] = [],
  prefix: string = ""
): TreeDataNode[] => {
  const tree: TreeDataNode[] = [];
  fields.forEach((field) => {
    const { title, slug } = field;
    const key = `${prefix}${slug}`;
    const specField: TreeDataNode = {
      key,
      title: title || slug,
    };
    if (field.type === DocumentElementType.SubRecord) {
      specField.children = getFieldsTree(field.children || [], `${key}.`);
    }
    tree.push(specField);
  });

  return tree;
};

const LabeledCheckbox: React.FC<{ label: string } & CheckboxProps> = (
  props
) => {
  const { label, ...checkboxProps } = props;
  return (
    <FormControlLabel label={label} control={<Checkbox {...checkboxProps} />} />
  );
};

type CheckboxTreeProps = {
  treeData: TreeDataNode[];
  value: string[];
  onChange: (key: string, value: boolean) => void;
};

const CheckboxTree: React.FC<CheckboxTreeProps> = (props) => {
  const { treeData, value, onChange } = props;

  const checkboxes = React.useMemo(() => {
    return treeData.map((node) => {
      const parent = (
        <LabeledCheckbox
          key={node.key}
          label={node.title}
          checked={value.includes(node.key)}
          onChange={(_, checked) => onChange(node.key, checked)}
        />
      );
      const children = (
        <CheckboxTree
          treeData={node.children || []}
          onChange={(key, value) => onChange(key, value)}
          value={value}
        />
      );

      return (
        <Box>
          {parent}
          {node.children && <Box>{children}</Box>}
        </Box>
      );
    });
  }, [onChange, treeData, value]);

  return (
    <Box
      sx={{
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        ml: 3,
      }}
    >
      {checkboxes}
    </Box>
  );
};

const CheckboxTreeComponent: React.FC<
  { fieldsTree: TreeDataNode[] } & BaseParamFieldProps
> = (props) => {
  const { control, fieldsTree } = props;

  return (
    <Controller
      control={control}
      name="fields"
      render={({ field }) => (
        <CheckboxTree
          treeData={fieldsTree}
          value={field.value || []}
          onChange={(key, value) => {
            field.onChange(
              field.value?.includes(key)
                ? field.value?.filter((k: string) => k !== key) || []
                : [...(field.value || []), key]
            );
          }}
        />
      )}
    />
  );
};

const DocumentFields: React.FC<{
  binderDocument?: DatasetDesign;
  selectedModule?: SystemModule;
}> = (props) => {
  const { binderDocument, selectedModule } = props;

  const [collectionSpec, setCollectionSpec] = useState<MappableParameter[]>([]);
  const [fieldsTree, setFieldsTree] = useState<TreeDataNode[]>([]);

  const isReadType = [SystemModuleType.Read, SystemModuleType.ReadOne].includes(
    selectedModule?.slug as SystemModuleType
  );

  useEffect(() => {
    if (!binderDocument) {
      // form.setFieldsValue({ fields: {} });
      return;
    }

    if (isReadType) {
      setFieldsTree(getFieldsTree(binderDocument.fields.fields));
    } else {
      setCollectionSpec(
        getDocumentCollectionSpec(binderDocument.fields.fields)
      );
    }
  }, [binderDocument]);

  return isReadType ? (
    <>
      <Card
        title="Fields"
        key={`${fieldsTree.length}`}
        sx={{ background: "transparent" }}
      >
        <ParamFieldWrapper
          field={{
            type: ParameterType.Array,
            label: "Fields",
            name: "fields",
          }}
          FieldComponent={CheckboxTreeComponent}
          FieldComponentProps={{ fieldsTree }}
        />
      </Card>
    </>
  ) : (
    <ParamField
      field={{
        name: "fields",
        type: ParameterType.Collection,
        label: "Fields",
        spec: collectionSpec,
      }}
      mappable
    />
  );
};

const SelectDocumentField: React.FC<{
  selectedModule?: SystemModule;
}> = (props) => {
  const { selectedModule } = props;
  const { data: documents = [] } = useListItems({
    modelName: "dataset-design",
  });

  const { watch } = useFormContext();

  const documentSlug = watch("document_slug");

  const binderDocument = documents.find((doc) => doc.slug === documentSlug);

  return (
    <>
      <DocumentDesignField documents={documents} />
      {[SystemModuleType.Update, SystemModuleType.ReadOne].includes(
        selectedModule?.slug as SystemModuleType
      ) && <RecordSlugField />}
      {documentSlug && binderDocument && (
        <DocumentFields
          selectedModule={selectedModule}
          binderDocument={binderDocument}
        />
      )}
    </>
  );
};

const ConditionsField: React.FC = () => {
  const { data: datasets = [] } = useListItems({
    modelName: ApiModels.DatasetDesign,
  });

  const { watch } = useFormContext();

  const datasetSlug = watch("document_slug");

  const datasetDesign = React.useMemo(
    () => datasets.find((doc) => doc.slug === datasetSlug),
    [datasetSlug, datasets]
  );

  const documentFieldOptions = React.useMemo(() => {
    if (!datasetDesign) {
      return [];
    }

    return (
      datasetDesign.fields?.fields?.map((field) => ({
        label: field.title,
        value: field.slug,
      })) || []
    );
  }, [datasetDesign]);

  return ["sql", "both"].includes(datasetDesign?.engine || "") ? (
    <ParamField
      // mappable={false}
      field={{
        label: "Condition",
        name: "condition_sets",
        type: ParameterType.Filter,
        options: {
          operators: [
            {
              label: "Equal (=)",
              value: "=",
            },
            {
              label: "Not Equal (<>)",
              value: "<>",
            },
            {
              label: "Greater Than (>)",
              value: ">",
            },
            {
              label: "Less Than (<)",
              value: "<",
            },
            {
              label: "Greater Than or Equal (>=)",
              value: ">=",
            },
            {
              label: "Less Than or Equal (<=)",
              value: "<=",
            },
          ],
          store: documentFieldOptions,
        },
      }}
    />
  ) : null;
};

const RecordFields: React.FC<{
  selectedModule?: SystemModule;
}> = (props) => {
  const { selectedModule } = props;

  return (
    <>
      <SelectDocumentField selectedModule={selectedModule} />
      {selectedModule?.slug === SystemModuleType.Read && (
        <>
          <ParamField
            field={{
              name: "max_records",
              type: ParameterType.UInteger,
              label: "Max Records",
              help: "Maximum number of records to return",
            }}
          />
        </>
      )}
      {[SystemModuleType.ReadOne, SystemModuleType.Read].includes(
        selectedModule?.slug || ""
      ) && <ConditionsField />}
    </>
  );
};

const UpdateInputVariableFields: React.FC = (props) => {
  const fusion = useFusionFlowStore.useFusionDraft();
  const fields = fusion?.fusion_fields?.fields;

  return (
    <Box>
      {fields?.map((field) => (
        <ParamField documentElementType field={field as DataField} mappable />
      ))}
    </Box>
  );
};

const DataListWidgetFields: React.FC = () => {
  const [titleFieldOptions, setTitleFieldOptions] = useState<LabeledValue[]>();

  const form = useFormContext();

  const dataFields = form.watch("chart_data.data_fields");

  useEffect(() => {
    setTitleFieldOptions(
      dataFields?.map((field: { field_label: string; field_key: string }) => ({
        label: field.field_label,
        value: field.field_key,
      })) || []
    );
  }, [dataFields]);

  return (
    <Box>
      <ParamField
        mappable
        field={{
          name: "data",
          label: "Data",
          type: ParameterType.Text,
        }}
        parentNamePath="chart_data"
      />
      <ParamField
        mappable
        field={{
          name: "data_fields",
          label: "Data Fields",
          type: ParameterType.Array,
          spec: [
            {
              name: "field_label",
              label: "Field Label",
              type: ParameterType.Text,
            },
            {
              name: "field_key",
              label: "Field Key",
              type: ParameterType.Text,
            },
          ],
        }}
        parentNamePath="chart_data"
      />
      {dataFields && (
        <ParamField
          mappable
          key={`title-field-${dataFields?.length}-${titleFieldOptions?.length}`}
          field={{
            name: "title_field",
            label: "Title Field",
            type: ParameterType.Select,
            options: titleFieldOptions || [],
          }}
          parentNamePath="chart_data"
        />
      )}
    </Box>
  );
};

type DataListWidgetActionFieldsProps = {
  fusion: Partial<Fusion>;
};

const DataListWidgetActionFields: React.FC<DataListWidgetActionFieldsProps> = (
  props
) => {
  const { fusion } = props;
  const widgetActionFormData = fusion.widget_action_form_data;
  const widgetSlug = widgetActionFormData?.widget_slug;

  const { data: widget } = useGetItem({
    modelName: ApiModels.GuiDashboardWidget,
    slug: widgetSlug,
  });

  const fields = React.useMemo(() => {
    const form =
      widget?.create_forms?.find(
        (f) => f.id === fusion.widget_action_form_data?.form_id
      ) ??
      widget?.edit_forms?.find(
        (f) => f.id === fusion.widget_action_form_data?.form_id
      );

    return getDocumentCollectionSpec(form?.form_fields?.fields || []);
  }, [fusion, widget]);

  return (
    <Box>
      {fields.map((field: MappableParameter) => {
        return (
          <ParamField
            parentNamePath="chart_data"
            key={field.name}
            field={field}
            mappable
          />
        );
      })}
    </Box>
  );
};

const ChartNodeFields: React.FC<{ selectedNode: FusionOperator }> = (props) => {
  const fusion = useFusionFlowStore.useFusionDraft();

  if (fusion?.fusion_type === "data-list") {
    return <DataListWidgetFields />;
  } else if (fusion?.fusion_type?.startsWith("data-list")) {
    return <DataListWidgetActionFields fusion={fusion as Fusion} />;
  }

  return (
    <Box>
      {WidgetEditorFields[fusion?.fusion_type || ""]?.map(
        (field: MappableParameter) => {
          return (
            <ParamField
              parentNamePath="chart_data"
              key={field.name}
              field={field}
              mappable
            />
          );
        }
      )}
    </Box>
  );
};

const ArrayAggregatorFields: React.FC = (props) => {
  const selectedNode = useFusionFlowStore.useSelectedNode();
  const operator = selectedNode?.data;
  const fusion = useFusionFlowStore.useFusionDraft();
  const allModules = useFusionFlowStore.useAllModules();
  const { data: authData } = useAuthenticate();
  const { data: webhooks } = useFusionWebhooks(
    operator?.app === SYSTEM_NODE_APP ? SYSTEM_NODE_APP : operator?.app_module,
    authData?.user?.slug
  );
  const { data: documents } = useListItems({ modelName: "dataset-design" });

  const { watch, control } = useFormContext();

  const iteratorSlug = watch("iterator_slug");

  const [prevInterfaces, setPrevInterfaces] = useState<
    Record<string, MappableParameter[]>
  >({});

  useEffect(() => {
    const prevOpInterfaces = () => {
      if (!iteratorSlug || !operator) {
        return {};
      }

      const interfaces: Record<string, MappableParameter[]> = {};

      const incoming: Partial<FusionOperator>[] = [];

      let currentNode = selectedNode?.data;
      while (currentNode?.operator_slug !== iteratorSlug) {
        const prevOp = fusion?.fusion_operators?.find(
          // eslint-disable-next-line no-loop-func
          (op) => op.operator_slug === currentNode?.parent_operator_slug
        );

        if (!prevOp || prevOp.operator_slug === iteratorSlug) {
          break;
        }

        currentNode = prevOp;
        incoming.push(currentNode);
      }

      incoming.forEach((i) => {
        if (
          i.app === SYSTEM_NODE_APP &&
          i.app_module !== WIDGET_START_NODE_MODULE
        ) {
          const is = getSystemModuleInterfaces(
            webhooks,
            fusion as any,
            documents || [],
            i as FusionOperator
          );
          interfaces[`${i.operator_slug}`] = is;
        } else {
          const m = allModules?.find((module) => module.slug === i.app_module);
          interfaces[`${i.operator_slug}`] = (m?.interface ||
            []) as MappableParameter[];
        }
      });

      return interfaces;
    };

    setPrevInterfaces(prevOpInterfaces());
  }, [
    selectedNode,
    iteratorSlug,
    operator,
    fusion,
    webhooks,
    documents,
    allModules,
  ]);

  const menuItems = React.useMemo(() => {
    return Object.entries(prevInterfaces).reduce<any[]>((acc, [key, value]) => {
      acc.push(
        <ListSubheader
          disableSticky
          key={key}
          sx={{
            backgroundColor: "#222",
            lineHeight: "25px",
            fontWeight: "bold",
          }}
        >
          {key}
        </ListSubheader>
      );

      acc.push(
        ...(value?.map((o) => (
          <MenuItem key={o.name} value={`body["${key}"]["${o.name}"]`}>
            {o.label || o.name}
          </MenuItem>
        )) || [])
      );

      return acc;
    }, []);
  }, [prevInterfaces]);

  return (
    <Box>
      <ParamField
        field={{
          name: "iterator_slug",
          type: ParameterType.Select,
          label: "Source Iterator",
          required: true,
          options: getOpenIteratorOptions,
        }}
        mappable
      />
      <FlowFieldWrapper label="Aggregated Fields">
        <Controller
          name="aggregated_fields"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || []}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              id={field.name}
              multiple
              input={<OutlinedInput size="small" />}
              renderValue={(selected: unknown[]) =>
                selected
                  .map((s) =>
                    (s as string).split(/\[|\]/).filter(Boolean).pop()
                  )
                  .join(",")
              }
              defaultValue={[]}
              fullWidth
              size="small"
            >
              {menuItems}
            </Select>
          )}
        />
      </FlowFieldWrapper>
    </Box>
  );
};

const getParentOperator = (
  operator: FusionOperator,
  operators: FusionOperator[]
) => {
  return operators.find(
    (op) => op.operator_slug === operator.parent_operator_slug
  );
};

type LoopFieldsProps = {
  selectedNode?: FusionOperator;
};

const LoopFields: React.FC<LoopFieldsProps> = (props) => {
  const { selectedNode } = props;
  const { control } = useFormContext();

  const fusion = useFusionFlowStore.useFusionDraft();

  const options = React.useMemo(() => {
    if (!selectedNode) {
      return [];
    }
    const items: LabeledValue[] = [];
    const operators = fusion?.fusion_operators || [];

    let current = getParentOperator(selectedNode, operators);
    while (current != null) {
      if (
        [
          ModuleType.Search,
          ModuleType.InstantTrigger,
          ModuleType.Trigger,
        ].includes(`${current.module_type}`)
      ) {
        items.push({
          label: current.operator_title,
          value: current.operator_slug,
        });
      }
      current = getParentOperator(current, operators);
    }

    return items;
  }, [fusion, selectedNode]);

  return (
    <ParamField
      mappable
      field={{
        name: "iterator_slug",
        type: ParameterType.Select,
        label: "Source Iterator",
        options: options,
      }}
    />
  );
};

const TriggerFusionFields: React.FC = (props) => {
  const { data: fusions } = useListItems({ modelName: ApiModels.Fusion });

  const { control, watch } = useFormContext();

  const fusionSlug = watch("fusion_slug");

  const selectedFusion = fusions?.find((f) => f.fusion_slug === fusionSlug);

  return (
    <>
      <Controller
        control={control}
        name="fusion_slug"
        render={({ field }) => (
          <FormField label="Fusion">
            <Select
              value={field.value || []}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              id={field.name}
              input={<OutlinedInput size="small" />}
              renderValue={(selected: unknown) => {
                return (
                  fusions?.find((f) => f.fusion_slug === selected)
                    ?.fusion_title || ""
                );
              }}
              fullWidth
              size="small"
            >
              {fusions?.map((f) => (
                <MenuItem key={f.fusion_slug} value={f.fusion_slug}>
                  {f.fusion_title}
                </MenuItem>
              ))}
            </Select>
          </FormField>
        )}
      />
      {selectedFusion ? (
        <>
          <ParamField
            field={{
              name: "fusion_inputs",
              label: "Inputs",
              type: ParameterType.Collection,
              spec: getDocumentCollectionSpec(
                selectedFusion.fusion_fields?.fields || []
              ),
            }}
          />
          <ParamField
            field={{
              name: "is_sync",
              label: "Run Sync",
              type: ParameterType.Boolean,
              default: false,
              required: true,
            }}
          />
        </>
      ) : null}
    </>
  );
};

const AuthenticationRequest3PFields: React.FC = (props) => {
  const { data: apps = [] } = use3pApps();

  const { watch } = useFormContext();

  const appSlug = watch("app_slug");

  const { data: connections = [], isFetching } = useListAppConnections(
    appSlug,
    {
      is_global: `${apps
        .find((a) => a.slug === appSlug)
        ?.id?.startsWith("3p:global")}`,
    }
  );

  const appOptions = useMemo(() => {
    return apps.map((app) => ({ label: app.app_label, value: app.slug }));
  }, [apps]);

  const connectionOptions = useMemo(() => {
    return connections.map((connection) => ({
      label: connection.label,
      value: connection.slug,
    }));
  }, [connections]);
  console.log(
    "🚀 ~ file: NodeEditorFields.tsx:1376 ~ connectionOptions ~ connectionOptions:",
    connectionOptions
  );

  return (
    <>
      <ParamField
        field={{
          name: "app_slug",
          type: ParameterType.Select,
          label: "App",
          options: appOptions,
        }}
      />
      {appSlug ? (
        <Spin spinning={isFetching}>
          <ParamField
            field={{
              name: "connection_slug",
              type: ParameterType.Select,
              label: "Connection",
              options: connectionOptions,
            }}
          />
          <ParamField
            field={{
              name: "request_string",
              type: ParameterType.Text,
              label: "Request String",
            }}
          />
        </Spin>
      ) : null}
    </>
  );
};

type UpdateSkillVariableFieldsProps = {
  fieldKey: "skill_user_fields" | "skill_session_fields";
};

const UpdateSkillVariableFields: React.FC<UpdateSkillVariableFieldsProps> = (
  props
) => {
  const { fusionSlug } = useParams<{ fusionSlug: string }>();
  const { fieldKey } = props;

  const { data: fusion } = useFusion(fusionSlug);

  const fields = fusion?.[fieldKey]?.fields || [];
  const fieldsOptions = fields.map((f) => ({
    label: f.title,
    value: f.slug,
  }));

  return (
    <ParamField
      mappable
      field={{
        name: "fields_data",
        type: ParameterType.Array,
        label: "Fields",
        spec: [
          {
            name: "key",
            label: "Key",
            type: ParameterType.Select,
            options: [
              ...fieldsOptions,
              {
                label: "Other",
                value: "other",
                nested: [
                  {
                    name: "key_slug",
                    label: "Key Slug",
                    type: ParameterType.Text,
                  },
                ],
              },
            ],
          },
          {
            name: "value",
            label: "Value",
            type: ParameterType.Text,
          },
        ],
      }}
    />
  );
};

const TranscriptionJobTriggerFields: React.FC = (props) => {
  const { data: designs = [] } = useListItems({
    modelName: ApiModels.DatasetDesign,
  });

  const { watch } = useFormContext();

  const designSlug = watch("dataset_design_slug");

  const selectedDesign = useMemo(() => {
    return designs?.find((d) => d.slug === designSlug);
  }, [designSlug, designs]);
  console.log(
    "🚀 ~ file: NodeEditorFields.tsx:1678 ~ selectedDesign ~ selectedDesign:",
    selectedDesign
  );

  const selectedDesignFieldOptions = useMemo(() => {
    if (!selectedDesign) {
      return [];
    }
    return (
      selectedDesign?.fields?.fields?.map((f) => ({
        label: f.title,
        value: f.slug,
      })) || []
    );
  }, [selectedDesign]);

  return (
    <>
      <DocumentDesignField documents={designs} name="dataset_design_slug" />
      {selectedDesign && (
        <>
          <ParamField
            field={{
              name: "job_name_field",
              type: ParameterType.Select,
              label: "Job Name Field",
              options: [
                { label: "Slug", value: "slug" },
                ...selectedDesignFieldOptions,
              ],
            }}
            mappable={false}
          />
          <ParamField
            field={{
              name: "job_status_field",
              type: ParameterType.Select,
              label: "Job Status Field",
              options: [
                { label: "Slug", value: "slug" },
                ...selectedDesignFieldOptions,
              ],
            }}
            mappable={false}
          />
        </>
      )}
    </>
  );
};

const CreateOperatorFields: React.FC = (props) => {
  const { watch } = useFormContext();

  const selectedFusion = watch("fusion_slug");
  const selectedAppSlug = watch("app_slug");

  const { data: fusions } = useListItems({ modelName: ApiModels.Fusion });
  const { data: fusion } = useFusion(selectedFusion);
  const { data: apps } = use3pApps();

  const app = apps?.find((a) => a.slug === selectedAppSlug);
  const { data: appModules } = use3pAppModules(app?.slug, app?.id);

  return (
    <>
      <ParamField
        mappable
        field={{
          name: "fusion_slug",
          type: ParameterType.Select,
          label: "Fusion",
          options:
            fusions?.map((f) => ({
              label: f.fusion_title,
              value: f.fusion_slug,
            })) || [],
        }}
      />
      <ParamField
        mappable
        field={{
          name: "parent_operator_slug",
          type: ParameterType.Select,
          label: "Parent Operator",
          options:
            fusion?.fusion_operators?.map((f) => ({
              label: f.operator_title,
              value: f.operator_slug,
            })) || [],
        }}
      />
      <ParamField
        mappable
        field={{
          name: "app_slug",
          type: ParameterType.Select,
          label: "App",
          options:
            apps?.map((f) => ({
              label: f.app_name,
              value: f.slug,
            })) || [],
        }}
      />
      <ParamField
        mappable
        field={{
          name: "app_module_slug",
          type: ParameterType.Select,
          label: "App Module",
          options:
            appModules?.map((f) => ({
              label: f.module_name,
              value: f.slug,
            })) || [],
        }}
      />
    </>
  );
};

const GetAllOperatorFields: React.FC = (props) => {
  const { data: fusions } = useListItems({ modelName: ApiModels.Fusion });

  return (
    <>
      <ParamField
        mappable
        field={{
          name: "fusion_slug",
          type: ParameterType.Select,
          label: "Fusion",
          options:
            fusions?.map((f) => ({
              label: f.fusion_title,
              value: f.fusion_slug,
            })) || [],
        }}
      />
    </>
  );
};

const GetOperatorSlotsFields: React.FC = (props) => {
  const { watch } = useFormContext();

  const selectedFusion = watch("fusion_slug");

  const { data: fusions } = useListItems({ modelName: ApiModels.Fusion });
  const { data: fusion } = useFusion(selectedFusion);

  return (
    <>
      <ParamField
        mappable
        field={{
          name: "fusion_slug",
          type: ParameterType.Select,
          label: "Fusion",
          options:
            fusions?.map((f) => ({
              label: f.fusion_title,
              value: f.fusion_slug,
            })) || [],
        }}
      />
      <ParamField
        mappable
        field={{
          name: "parent_operator_slug",
          type: ParameterType.Select,
          label: "Parent Operator",
          options:
            fusion?.fusion_operators?.map((f) => ({
              label: f.operator_title,
              value: f.operator_slug,
            })) || [],
        }}
      />
    </>
  );
};

const DeleteOperatorFields: React.FC = (props) => {
  const { watch } = useFormContext();

  const selectedFusion = watch("fusion_slug");

  const { data: fusions } = useListItems({ modelName: ApiModels.Fusion });
  const { data: fusion } = useFusion(selectedFusion);

  return (
    <>
      <ParamField
        mappable
        field={{
          name: "fusion_slug",
          type: ParameterType.Select,
          label: "Fusion",
          options:
            fusions?.map((f) => ({
              label: f.fusion_title,
              value: f.fusion_slug,
            })) || [],
        }}
      />
      <ParamField
        mappable
        field={{
          name: "operator_slug",
          type: ParameterType.Select,
          label: "Parent Operator",
          options:
            fusion?.fusion_operators?.map((f) => ({
              label: f.operator_title,
              value: f.operator_slug,
            })) || [],
        }}
      />
    </>
  );
};

const UpdateOperatorSlotsFields: React.FC = (props) => {
  const form = useFormContext();
  const { watch, setValue } = form;

  const selectedFusion = watch("fusion_slug");
  const operatorSlug = watch("operator_slug");

  const { data: fusions } = useListItems({ modelName: ApiModels.Fusion });
  const { data: fusion } = useFusion(selectedFusion);

  const operator = fusion?.fusion_operators?.find(
    (o) => o.operator_slug === operatorSlug
  );

  const { data: appModules } = use3pAppModules(operator?.app, operator?.app_id);
  const appModule = appModules?.find((a) => a.slug === operator?.app_module);

  useEffect(() => {
    if (appModule && operator) {
      setValue("operator_inputs", operator.operator_input_settings || {});
    }
  }, [appModule, operator]);

  return (
    <>
      <ParamField
        mappable
        field={{
          name: "fusion_slug",
          type: ParameterType.Select,
          label: "Fusion",
          options:
            fusions?.map((f) => ({
              label: f.fusion_title,
              value: f.fusion_slug,
            })) || [],
        }}
      />
      <ParamField
        mappable
        field={{
          name: "operator_slug",
          type: ParameterType.Select,
          label: "Parent Operator",
          options:
            fusion?.fusion_operators?.map((f) => ({
              label: f.operator_title,
              value: f.operator_slug,
            })) || [],
        }}
      />
      <FieldList
        fields={appModule?.mappable_parameters || []}
        parentNamePath="operator_inputs"
        {...form}
      />
    </>
  );
};

const GetAllPopupVariablesFields: React.FC = (props) => {
  const { data: fusions } = useListItems({ modelName: ApiModels.Fusion });

  return (
    <>
      <ParamField
        mappable
        field={{
          name: "fusion_slug",
          type: ParameterType.Select,
          label: "Fusion",
          options:
            fusions?.map((f) => ({
              label: f.fusion_title,
              value: f.fusion_slug,
            })) || [],
        }}
      />
    </>
  );
};

const CreateTableFields: React.FC = (props) => {
  return (
    <>
      <ParamField
        mappable
        field={{
          name: "dataset_design_name",
          type: ParameterType.Text,
          label: "Dataset Design Name",
        }}
      />
      <ParamField
        mappable
        field={{
          name: "dataset_design_slug",
          type: ParameterType.Text,
          label: "Dataset Design Slug",
        }}
      />
      <ParamField
        mappable
        field={{
          name: "dataset_design_color",
          type: ParameterType.Color,
          label: "Dataset Design Color",
        }}
      />
    </>
  );
};

const AddColumnFields: React.FC = (props) => {
  const { data: datasetDesigns } = useListItems({
    modelName: ApiModels.DatasetDesign,
  });

  return (
    <>
      <ParamField
        mappable
        field={{
          name: "dataset_design_slug",
          type: ParameterType.Select,
          label: "Dataset Design Slug",
          options: datasetDesigns?.map((d) => ({
            label: d.name,
            value: d.slug,
          })),
        }}
      />
      <ParamField
        mappable
        field={{
          name: "column_name",
          type: ParameterType.Text,
          label: "Column Name",
        }}
      />
      <ParamField
        mappable
        field={{
          name: "column_slug",
          type: ParameterType.Text,
          label: "Column Slug",
        }}
      />
      <ParamField
        mappable
        field={{
          name: "column_type",
          type: ParameterType.Select,
          label: "Column Type",
          options: FormElements.map((f) => ({ label: f.name, value: f.type })),
        }}
      />
      <ParamField
        mappable
        field={{
          name: "default_value",
          type: ParameterType.Text,
          label: "Default Value",
        }}
      />
    </>
  );
};

const AlterColumnFields: React.FC = (props) => {
  const { watch } = useFormContext();

  const { data: datasetDesigns } = useListItems({
    modelName: ApiModels.DatasetDesign,
  });

  const datasetDesignSlug = watch("dataset_design_slug");

  const datasetDesign = datasetDesigns?.find(
    (d) => d.slug === datasetDesignSlug
  );

  return (
    <>
      <ParamField
        mappable
        field={{
          name: "dataset_design_slug",
          type: ParameterType.Select,
          label: "Dataset Design Slug",
          options: datasetDesigns?.map((d) => ({
            label: d.name,
            value: d.slug,
          })),
        }}
      />
      <ParamField
        mappable
        field={{
          name: "column_slug",
          type: ParameterType.Select,
          label: "Column Slug",
          options: datasetDesign?.fields?.fields?.map((c) => ({
            label: c.title,
            value: c.slug,
          })),
        }}
      />
      <ParamField
        mappable
        field={{
          name: "column_name",
          type: ParameterType.Text,
          label: "Column Name",
        }}
      />
      <ParamField
        mappable
        field={{
          name: "default_value",
          type: ParameterType.Text,
          label: "Default Value",
        }}
      />
    </>
  );
};

type UpdateDisplayFieldsProps = {
  selectedNode?: FusionOperator;
};

const UpdateDisplayFields: React.FC<UpdateDisplayFieldsProps> = (props) => {
  const { selectedNode } = props;

  const fusion = useFusionFlowStore.useFusionDraft();
  const { data: fusions } = useListItems({
    modelName: ApiModels.Fusion,
    requestOptions: { query: { type: "all" } },
  });

  const BaseFields: MappableParameter[] = [
    {
      name: "execution_type",
      type: ParameterType.Select,
      label: "Sync/Async",
      default: "sync",
      options: [
        {
          label: "Sync",
          value: "sync",
        },
        {
          label: "Async",
          value: "async",
        },
      ],
    },
    {
      name: "display_type",
      type: ParameterType.Select,
      label: "Display Type",
      default: "html",
      options: [
        {
          label: "HTML",
          value: "html",
          nested: [
            {
              name: "html",
              type: ParameterType.Code,
              label: "HTML",
              mode: "html",
            },
            {
              name: "css",
              type: ParameterType.Code,
              label: "CSS",
              mode: "css",
            },
            {
              name: "js",
              type: ParameterType.Code,
              label: "JavaScript",
              mode: "javascript",
            },
          ],
        },
        {
          label: "Code",
          value: "code",
          nested: [
            {
              name: "code_action",
              type: ParameterType.Select,
              label: "Action",
              default: "append",
              options: [
                {
                  label: "Append",
                  value: "append",
                },
                {
                  label: "Replace",
                  value: "replace",
                },
              ],
            },
            {
              name: "code",
              type: ParameterType.Code,
              label: "Code",
              mode: "html",
            },
          ],
        },
        {
          label: "Fusion",
          value: "fusion",
          nested: [
            {
              name: "fusion_type",
              type: ParameterType.Select,
              label: "Fusion Type",
              default: "open_fusion",
              options: [
                {
                  label: "Open Fusion",
                  value: "open_fusion",
                  nested: [
                    {
                      name: "fusion_slug",
                      type: ParameterType.Select,
                      label: "Fusion ID",
                      options:
                        fusions?.map((f) => ({
                          label: f.fusion_title,
                          value: f.fusion_slug,
                        })) || [],
                    },
                  ],
                },
                {
                  label: "Create Fusion",
                  value: "create_fusion",
                  nested: [
                    {
                      name: "fusion_editor_action",
                      type: ParameterType.Text,
                      label: "Fusion Editor Action",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  // const { data: jobSessions } = useJobSessions(fusionSlug);

  const prevCreateJobOperators = getIncomingOperators(
    selectedNode,
    fusion?.fusion_operators || []
  ).filter((o) => o.app_module === SystemModuleType.CreateJob);

  return (
    <>
      <ParamField
        mappable
        field={{
          name: "job_slug",
          type: ParameterType.Select,
          label: "Job",
          options: [
            { label: "General", value: "general" },
            ...(prevCreateJobOperators?.map((js) => ({
              label: js.operator_title || "",
              value: `{{body["${js.operator_slug}"]["job_id"]}}`,
            })) || []),
          ],
        }}
      />
      {BaseFields.map((f) => (
        <ParamField mappable field={f} />
      ))}
    </>
  );
};

type ChangeSelectedDisplayFieldsProps = {
  selectedNode?: FusionOperator;
};

const ChangeSelectedDisplayFields: React.FC<ChangeSelectedDisplayFieldsProps> =
  (props) => {
    const { selectedNode } = props;

    const fusion = useFusionFlowStore.useFusionDraft();

    const prevCreateJobOperators = getIncomingOperators(
      selectedNode,
      fusion?.fusion_operators || []
    ).filter((o) => o.app_module === SystemModuleType.CreateJob);

    return (
      <>
        <ParamField
          mappable
          field={{
            name: "job_slug",
            type: ParameterType.Select,
            label: "Job",
            options: [
              { label: "General", value: "general" },
              ...(prevCreateJobOperators?.map((js) => ({
                label: js.operator_title || "",
                value: `{{body["${js.operator_slug}"]["job_id"]}}`,
              })) || []),
            ],
          }}
        />
      </>
    );
  };

const isDataListActionWidgetNode = (node?: FusionOperator) => {
  return [
    "data-list-widget-create-action-form-node",
    "data-list-widget-edit-action-form-node",
  ].includes(node?.app_module || "");
};

const SystemOperatorFields: React.FC<{
  selectedModule?: SystemModule;
  selectedNode?: FusionOperator;
}> = (props) => {
  const { selectedModule, selectedNode } = props;

  if (
    selectedNode?.app_module === SystemModuleType.ChartNode ||
    (selectedNode && isDataListActionWidgetNode(selectedNode))
  ) {
    return <ChartNodeFields selectedNode={selectedNode} />;
  }

  switch (selectedModule?.slug) {
    case SystemModuleType.Read:
    case SystemModuleType.ReadOne:
    case SystemModuleType.Update:
    case SystemModuleType.Create:
    case SystemModuleType.SocialMediaAutomation:
      return <RecordFields selectedModule={selectedModule} />;
    case SystemModuleType.AddTag:
    case SystemModuleType.RemoveTag:
      return <TagFields />;
    // case SystemModuleType.Webhook:
    //   return <SystemWebhookFields operator={selectedNode?.data} />;
    case SystemModuleType.ChargePayment:
      return <ChargePaymentFields />;
    case SystemModuleType.UpdateInputVariables:
      return <UpdateInputVariableFields />;
    case SystemModuleType.ArrayAggregator:
      return <ArrayAggregatorFields />;
    case SystemModuleType.Loop:
      return <LoopFields selectedNode={selectedNode} />;
    case SystemModuleType.TriggerFusion:
      return <TriggerFusionFields />;
    case SystemModuleType.AuthenticationRequest3P:
      return <AuthenticationRequest3PFields />;
    case SystemModuleType.UpdateSkillUser:
      return <UpdateSkillVariableFields fieldKey="skill_user_fields" />;
    case SystemModuleType.UpdateSkillSession:
      return <UpdateSkillVariableFields fieldKey="skill_session_fields" />;
    case SystemModuleType.TranscriptionJobTrigger:
      return <TranscriptionJobTriggerFields />;
    case SystemModuleType.CreateOperator:
      return <CreateOperatorFields />;
    case SystemModuleType.GetAllOperators:
      return <GetAllOperatorFields />;
    case SystemModuleType.GetOperatorSlots:
      return <GetOperatorSlotsFields />;
    case SystemModuleType.DeleteOperator:
      return <DeleteOperatorFields />;
    case SystemModuleType.UpdateOperatorSlots:
      return <UpdateOperatorSlotsFields />;
    case SystemModuleType.GetAllPopupVariables:
      return <GetAllPopupVariablesFields />;
    case SystemModuleType.CreateTable:
      return <CreateTableFields />;
    case SystemModuleType.AddColumn:
      return <AddColumnFields />;
    case SystemModuleType.AlterColumn:
      return <AlterColumnFields />;
    case SystemModuleType.UpdateDisplay:
      return <UpdateDisplayFields selectedNode={selectedNode} />;
    case SystemModuleType.ChangeSelectedDisplay:
      return <ChangeSelectedDisplayFields selectedNode={selectedNode} />;
    default:
      return (
        <Box>
          <SystemParamFields
            fields={
              SystemFields[
                selectedNode?.app_module as keyof typeof SystemFields
              ] || []
            }
          />
        </Box>
      );
  }
};

type SystemParamFieldsProps = {
  fields: MappableParameter[];
};

const SystemParamFields: React.FC<SystemParamFieldsProps> = (props) => {
  const { fields: allFields } = props;

  const form = useFormContext();

  const showAdvancedFields = form.watch("show_advanced_settings");

  const { fields, advancedFields } = useMemo(() => {
    return allFields.reduce<{
      fields: MappableParameter[];
      advancedFields: MappableParameter[];
    }>(
      (acc, cur) => {
        if (
          [ParameterType.Filename, ParameterType.Buffer].includes(
            cur.type as ParameterType
          ) &&
          cur.semantic
        ) {
          const semanticField = acc.fields.find(
            (f) => f.type === "filename-buffer-semantic"
          );
          if (!semanticField) {
            acc.fields.push({
              label: "File",
              name: "filename-buffer-semantic",
              type: "filename-buffer-semantic",
              semanticFields: [cur],
            });
          } else {
            semanticField.semanticFields.push(cur);
          }

          return acc;
        }

        if (cur.advanced) {
          showAdvancedFields && acc.advancedFields.push(cur);
        } else {
          acc.fields.push(cur);
        }

        return acc;
      },
      { fields: [], advancedFields: [] }
    );
  }, [showAdvancedFields, allFields]);

  return (
    <>
      <FieldList fields={fields} {...form} />
      <FieldList fields={advancedFields} {...form} />
    </>
  );
};

export const ConnectionParamField: React.FC<
  {
    operator: FusionOperator;
    appModule: ThreePAppAction;
    isWebhookConnection?: boolean;
    parentNamePath?: string;
  } & UseFormReturn
> = memo(
  (props) => {
    const {
      control,
      operator,
      appModule,
      getValues,
      setValue,
      isWebhookConnection = false,
      parentNamePath = "",
    } = props;
    const connectionFieldRef = useRef<any>();
    const connectionPopoverContentRef = useRef<HTMLDivElement>();

    const [fusionConnections, setFusionConnections] = useState<
      FusionConnection[]
    >([]);

    const queryClient = useQueryClient();
    const fusionConnectionsData = useFusionConnections(
      operator.parent_fusion_id,
      operator.app
    );
    const { data } = useAuthenticate();
    const { data: connections } = useListAppConnections(operator.app, {
      is_global: `${operator.app_id?.startsWith("3p:global")}`,
    });

    const { data: webhooks } = useListAppWebhooks(operator.app, {
      is_global: `${operator.app_id?.startsWith("3p:global")}`,
    });

    const { user } = data || {};

    const [connection, setConnection] = useState<ThreePAppConnection>();

    useEffect(() => {
      if (!isWebhookConnection) {
        const con = connections?.find(
          (c) => c.slug === appModule.connection_id
        );

        if (con) {
          setConnection(con);
        }
      } else {
        const webhook = webhooks?.find(
          (w) => w.slug === appModule.connection_id
        );

        const connectionSlug = webhook?.connection_id;

        const con = connections?.find((c) => c.slug === connectionSlug);

        if (con) {
          setConnection(con);
        }
      }
    }, [connections, webhooks, isWebhookConnection, appModule.connection_id]);

    const connectionOptions =
      fusionConnections?.map((c) => ({
        label: c.connection_name || "No Name",
        value: c.slug,
      })) || [];

    useEffect(() => {
      if (fusionConnectionsData.data) {
        setFusionConnections(fusionConnectionsData.data);
      }
    }, [fusionConnectionsData.data]);

    const handleSubmit = async ({ onClose }: { onClose(): void }) => {
      const connectionParams = getValues("connection_params");
      if (
        [
          "oauth2_authorization_code_refresh_token",
          "oauth2_authorization_code",
        ].includes(`${connection?.type}`)
      ) {
        const data = {
          user_id: user?.slug,
          app_connection_id: connection?.slug,
          app_id: operator?.app,
          app: operator?.app_id,
          type: "authorize",
          ...connectionParams,
        };
        setLocalStorage("fusion:oauth2", {
          ...data,
          connectionType: connection?.type,
        });

        const { data: res } = await Fusion.createConnection(data);
        if (res.query_string) {
          const popup = window.open(
            res.query_string,
            "_blank",
            "width=600, height=800"
          );
          const interval = setInterval(() => {
            const authData = getLocalStorage("fusion:oauth2") as {
              query: { code: string };
            };
            if (authData?.query?.code) {
              clearInterval(interval);
              Fusion.createConnection({
                ...data,
                type: "token",
                ...authData.query,
              }).then((conRes) => {
                onClose();
                queryClient.invalidateQueries({
                  queryKey: [
                    "fusion-connections",
                    operator.parent_operator_id,
                    operator.app,
                  ],
                });
                setFusionConnections((prev) => [conRes.data, ...prev]);
                setValue("fusion_connection_slug", conRes.data.slug);
              });
            } else if (popup?.closed) {
              clearInterval(interval);
            }
          }, 1000);
        }
      } else {
        Fusion.createConnection({
          user_id: user?.slug,
          app_connection_id: connection?.slug,
          app_id: operator?.app,
          app: operator?.app_id,
          ...connectionParams,
        }).then((res) => {
          onClose();
          queryClient.invalidateQueries({
            queryKey: [
              "fusion-connections",
              operator.parent_operator_id,
              operator.app,
            ],
          });
          setFusionConnections((prev) => [res.data, ...prev]);
          setValue("fusion_connection_slug", res.data.slug);
        });
      }
    };

    return (
      <FlowFieldWrapper
        label="Connection"
        help={`Here you can set up a custom sender email address. If you enter an incorrect email address, an error may occur when sending a message because your account may not have permission to send emails from a different address than your own. E.g. test@mail.com or "John Bush" test@email.com`}
      >
        <Controller
          control={control}
          name={
            parentNamePath
              ? `${parentNamePath}.fusion_connection_slug`
              : "fusion_connection_slug"
          }
          render={({ field }) => {
            return (
              <Select
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                id="connection"
                inputRef={(el) => {
                  connectionFieldRef.current = el;
                }}
                variant="filled"
                placeholder="Connection"
                size="small"
                fullWidth
                IconComponent={() => null}
                endAdornment={
                  <InputAdornment position="end" sx={{ height: "100%" }}>
                    <FlowPopover
                      content={
                        <Box ref={connectionPopoverContentRef}>
                          {connection && (
                            <ConnectionFields connection={connection} />
                          )}
                        </Box>
                      }
                      containerProps={{
                        title: "Create a connection",
                        disableScroll: true,
                      }}
                      onSaveClick={handleSubmit}
                      transformOrigin={{
                        vertical: "center",
                        horizontal: "right",
                      }}
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "left",
                      }}
                    >
                      <Button
                        variant="text"
                        size="small"
                        sx={{ p: "0", minWidth: "inherit" }}
                      >
                        Add{" "}
                        <AddOutlinedIcon
                          fontSize="small"
                          sx={{ width: "10px" }}
                        />
                      </Button>
                    </FlowPopover>
                  </InputAdornment>
                }
              >
                <MenuItem value={0}>None</MenuItem>
                {connectionOptions.map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            );
          }}
        />
      </FlowFieldWrapper>
    );
  },
  (prev, next) => prev.formState.isDirty === next.formState.isDirty
);

type LinkWithCopyButtonProps = {
  href: string;
};

const LinkWithCopyButton: React.FC<PropsWithChildren<LinkWithCopyButtonProps>> =
  (props) => {
    const { href, children } = props;
    const handleCopy = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();
      navigator.clipboard.writeText(href);
    };

    return (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
        <Link
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          href={href}
          target="_blank"
        >
          {children}
        </Link>
        <IconButton
          sx={{ padding: 0 }}
          color="primary"
          size="small"
          onClick={handleCopy}
        >
          <FileCopy fontSize="small" />
        </IconButton>
      </Stack>
    );
  };

type InstantTriggerFieldProps = {
  operator: FusionOperator;
  appModule: ThreePAppAction;
} & UseFormReturn;

const InstantTriggerField: React.FC<InstantTriggerFieldProps> = (props) => {
  const { operator, appModule, ...form } = props;

  const { fusionSlug } = useParams<{ fusionSlug: string }>();

  const { control, getValues, setValue } = form;

  const connectionFieldRef = useRef<any>();
  const connectionPopoverContentRef = useRef<HTMLDivElement>();

  const [fusionWebhooks, setFusionWebhooks] = useState<FusionWebhook[]>([]);

  const queryClient = useQueryClient();

  const { data } = useAuthenticate();
  const { user } = data || {};

  const fusionWebhooksData = useFusionWebhooks(operator.app_module, user?.slug);

  const { data: webhooks } = useListAppWebhooks(operator.app, {
    is_global: `${operator.app_id?.startsWith("3p:global")}`,
  });

  const webhook = webhooks?.find((c) => c.slug === appModule.connection_id);

  const webhooksOptions =
    fusionWebhooks?.map((c) => ({
      label: c.webhook_name || "No Name",
      value: c.slug,
    })) || [];

  useEffect(() => {
    if (fusionWebhooksData.data) {
      setFusionWebhooks(fusionWebhooksData.data);
    }
  }, [fusionWebhooksData.data]);

  const handleSubmit = async ({ onClose }: { onClose(): void }) => {
    const connectionParams = getValues("connection_params");

    Fusion.createWebhook({
      ...connectionParams,
      module_slug: operator?.app_module,
      fusion_slug: fusionSlug,
      user_id: user?.slug,
    }).then((res) => {
      console.log({ data: res.data });
      onClose();
      queryClient.invalidateQueries({
        queryKey: ["fusion-webhooks", operator.app_module, user?.slug],
      });
      setFusionWebhooks((prev) => [res.data, ...prev]);
      setValue("fusion_connection_slug", res.data.slug);
    });
  };

  return (
    <FlowFieldWrapper
      label="Webhook"
      help={`Here you can set up a custom sender email address. If you enter an incorrect email address, an error may occur when sending a message because your account may not have permission to send emails from a different address than your own. E.g. test@mail.com or "John Bush" test@email.com`}
    >
      <Controller
        control={control}
        name="fusion_connection_slug"
        render={({ field }) => {
          const selected = fusionWebhooksData.data?.find(
            (w) => w.slug === field.value
          );
          return (
            <>
              <Select
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                id="connection"
                inputRef={(el) => {
                  connectionFieldRef.current = el;
                }}
                variant="filled"
                placeholder="Connection"
                size="small"
                fullWidth
                IconComponent={() => null}
                endAdornment={
                  <InputAdornment position="end" sx={{ height: "100%" }}>
                    <FlowPopover
                      content={
                        <Box ref={connectionPopoverContentRef}>
                          {webhook && (
                            <WebhookFields
                              webhook={webhook}
                              operator={operator}
                              appModule={appModule}
                            />
                          )}
                        </Box>
                      }
                      containerProps={{
                        title: "Create a connection",
                        disableScroll: true,
                      }}
                      onSaveClick={handleSubmit}
                      transformOrigin={{
                        vertical: "center",
                        horizontal: "right",
                      }}
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "left",
                      }}
                    >
                      <Button
                        variant="text"
                        size="small"
                        sx={{ p: "0", minWidth: "inherit" }}
                      >
                        Add{" "}
                        <AddOutlinedIcon
                          fontSize="small"
                          sx={{ width: "10px" }}
                        />
                      </Button>
                    </FlowPopover>
                  </InputAdornment>
                }
              >
                <MenuItem value={0}>None</MenuItem>
                {webhooksOptions.map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
              {selected && (
                <LinkWithCopyButton href={selected.webhook_url}>
                  {selected.webhook_url}
                </LinkWithCopyButton>
              )}
            </>
          );
        }}
      />
    </FlowFieldWrapper>
  );
};

const ConnectionField: React.FC<{
  operator: FusionOperator;
  appModule: ThreePAppAction;
}> = (props) => {
  const { operator, appModule } = props;
  const form = useFormContext();

  // if (!appModule.connection_id || !appModule.alt_connection_id) {
  //   return null;
  // }

  switch (appModule.module_type) {
    case ModuleType.InstantTrigger:
      return (
        <InstantTriggerField
          {...form}
          operator={operator}
          appModule={appModule}
        />
      );
    default:
      return (
        <ConnectionParamField
          {...form}
          operator={operator}
          appModule={appModule}
        />
      );
  }
};

type AppFieldsProps = {
  fields: MappableParameter[];
  parentNamePath?: string;
};

const FieldList: React.FC<AppFieldsProps & UseFormReturn> = memo(
  (props) => {
    const { fields, parentNamePath } = props;

    return (
      <>
        {fields.map((field) => (
          <ParamField
            key={field.name}
            field={field}
            parentNamePath={parentNamePath}
            mappable
          />
        ))}
      </>
    );
  },
  (prev, next) =>
    prev.formState.isDirty === next.formState.isDirty &&
    prev.fields === next.fields
);

const AppFields: React.FC<AppFieldsProps> = (props) => {
  const { fields: allFields } = props;

  const form = useFormContext();

  const connectionSlug = form.watch("fusion_connection_slug");
  const showAdvancedFields = form.watch("show_advanced_settings");

  const { fields, advancedFields } = useMemo(() => {
    if (!connectionSlug) {
      return {
        fields: [],
        advancedFields: [],
      };
    }

    return allFields.reduce<{
      fields: MappableParameter[];
      advancedFields: MappableParameter[];
    }>(
      (acc, cur) => {
        if (
          [ParameterType.Filename, ParameterType.Buffer].includes(
            cur.type as ParameterType
          ) &&
          cur.semantic
        ) {
          const semanticField = acc.fields.find(
            (f) => f.type === "filename-buffer-semantic"
          );
          if (!semanticField) {
            acc.fields.push({
              label: "File",
              name: "filename-buffer-semantic",
              type: "filename-buffer-semantic",
              semanticFields: [cur],
            });
          } else {
            semanticField.semanticFields.push(cur);
          }

          return acc;
        }

        if (cur.advanced) {
          showAdvancedFields && acc.advancedFields.push(cur);
        } else {
          acc.fields.push(cur);
        }

        return acc;
      },
      { fields: [], advancedFields: [] }
    );
  }, [showAdvancedFields, connectionSlug, allFields]);

  return (
    <>
      <FieldList fields={fields} {...form} />
      <FieldList fields={advancedFields} {...form} />
    </>
  );
};

// const FormWatcher: React.FC = React.memo(() => {
//   const form = useFormContext();

//   useEffect(() => {
//     const subscription = form.watch((data, { name, type }) => {});

//     return () => {
//       subscription.unsubscribe();
//     }
//   }, [])

//   return null;
// });

type Props = {
  operator: FusionOperator;
  id: string;
  onClose?(): void;
};

const NodeEditorFields: React.FC<Props> = (props) => {
  const { operator, id, onClose } = props;

  const { data: appModules, isFetching } = use3pAppModules(
    operator.app,
    operator.app_id
  );
  const queryClient = useQueryClient();

  const updateOperatorSettings =
    useFusionFlowStore.useUpdateNodeOperatorInputSettings();

  const [formValuesSet, setFormValuesSet] = useState(false);

  const appModule = appModules?.find((m) => m.slug === operator.app_module);

  useEffect(() => {
    queryClient.prefetchQuery(["connections", operator.app]);
  }, [operator.app, queryClient]);

  const fields = useMemo(() => {
    // if (operator.app === "system") {
    //   return (
    //     SystemFields[operator.app_module as keyof typeof SystemFields] || []
    //   );
    // }

    return appModule?.mappable_parameters || [];
  }, [appModule, operator]);

  // const isSystemOperator =
  //   operator?.app === SYSTEM_NODE_APP &&
  //   operator?.app_module !== WIDGET_START_NODE_MODULE;

  const systemSelectedModule = React.useMemo(() => {
    return [...SystemModules].find((m) => m.slug === operator?.app_module);
  }, [operator?.app_module]);

  const form = useForm();

  console.log(form.formState.isDirty);

  useEffect(() => {
    if (operator) {
      Object.entries(operator.operator_input_settings || {}).forEach(
        ([key, value]) => {
          form.setValue(key, value);
        }
      );
      setFormValuesSet(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operator]);

  const handleSubmit = (values: any) => {
    // delete values.mapped;
    delete values.connection_params;
    delete values.show_advanced_settings;
    updateOperatorSettings(id, values);
    onClose?.();
  };

  return (
    <Spin spinning={isFetching}>
      {formValuesSet && (
        <FormProvider {...form}>
          {/* <FormWatcher /> */}
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Scrollbar autoHeight autoHeightMax={"calc(100vh - 300px)"}>
              <Box sx={{ p: 2 }}>
                {operator.app !== "system" && appModule && (
                  <ConnectionField operator={operator} appModule={appModule} />
                )}
                <AppFields fields={fields} />
                {fields.length === 0 && (
                  <SystemOperatorFields
                    selectedModule={systemSelectedModule}
                    selectedNode={operator}
                  />
                )}
                <Controller
                  name="show_advanced_settings"
                  control={form.control}
                  render={({ field }) => (
                    <FormControlLabel
                      sx={{ m: 0 }}
                      control={
                        <Checkbox
                          sx={{ p: 0.5 }}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Show advanced settings"
                    />
                  )}
                />
              </Box>
            </Scrollbar>
            <Box
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                p: 2.25,
                borderRadius: "0 0 6px 6px",
              }}
            >
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1.5}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{ borderColor: "#fff", color: "#fff" }}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  type="submit"
                  sx={{
                    backgroundColor: "#fff",
                    color: (theme) => theme.palette.primary.main,
                    borderColor: "#fff",
                    boxShadow: "none",
                  }}
                >
                  Save Changes
                </Button>
              </Stack>
            </Box>
          </form>
        </FormProvider>
      )}
      <DevTool control={form.control} />
    </Spin>
  );
};

export default NodeEditorFields;
