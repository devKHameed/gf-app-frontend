import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import use3pApps from "queries/3p-app/use3pApps";
import React, { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { getIncomingOperators } from "utils";
import { BaseParamFieldProps, ParamField } from "../NodeEditorFields";

type FileSemanticFieldProps = {} & BaseParamFieldProps;

const FileSemanticField: React.FC<FileSemanticFieldProps> = (props) => {
  const { field, control, parentNamePath, watch, setValue } = props;
  const { name: fieldName } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  const [radioOptions, setRadioOptions] = useState<
    (LabeledValue & { color?: string })[]
  >([]);

  const selectedNode = useFusionFlowStore.useSelectedNode();
  const fusionDraft = useFusionFlowStore.useFusionDraft();
  const allModules = useFusionFlowStore.useAllModules();
  const { data: apps } = use3pApps();

  useEffect(() => {
    const prevOperators = getIncomingOperators(
      selectedNode?.data,
      fusionDraft?.fusion_operators
    );
    const operatorModules = prevOperators.map((op) =>
      allModules.find((m) => m.slug === op.app_module)
    );
    const semanticReturnModules = operatorModules
      .filter((m) => !!m?.interface.some((i) => !!i.sematic))
      .filter(Boolean);
    const semanticOperators = semanticReturnModules
      .map((m) => prevOperators.find((op) => op.app_module === m.slug))
      .filter(Boolean);

    setRadioOptions(
      semanticOperators.map((op) => ({
        label: `${op.operator_title} - ${op.operator_subtitle}`,
        value: op.operator_slug || "",
        color: apps?.find((app) => app.slug === op.app)?.app_color || "",
      }))
    );
  }, [field, selectedNode, fusionDraft, allModules, apps]);

  const fieldValue = watch(name);
  const showAdvancedFields = watch("show_advanced_settings");

  const semanticFields: MappableParameter[] = useMemo(() => {
    if (showAdvancedFields) {
      return field.semanticFields || [];
    }

    return (field.semanticFields || []).filter(
      (f: MappableParameter) => !f.advanced
    );
  }, [field.semanticFields, showAdvancedFields]);

  useEffect(() => {
    if (fieldValue && fieldValue !== "map") {
      const operator = fusionDraft?.fusion_operators?.find(
        (op) => op.operator_slug === fieldValue
      );
      if (operator) {
        const opModule = allModules.find((m) => m.slug === operator.app_module);
        const filenameField = opModule?.interface.find(
          (i) => i.semantic === "file:name"
        ) as MappableParameter;
        const fileDataField = opModule?.interface.find(
          (i) => i.semantic === "file:data"
        ) as MappableParameter;

        (field.semanticFields as MappableParameter[])?.forEach((f) => {
          const fieldFullName = parentNamePath
            ? `${parentNamePath}.${f.name}`
            : f.name;
          if (f.semantic === "file:name" && filenameField) {
            setValue(
              fieldFullName,
              `${operator.operator_slug}.${filenameField.name}`
            );
          } else if (f.semantic === "file:data" && fileDataField) {
            setValue(
              fieldFullName,
              `${operator.operator_slug}.${fileDataField.name}`
            );
          }
        });
      }
    } else {
      (field.semanticFields as MappableParameter[])?.forEach((f) => {
        const fieldFullName = parentNamePath
          ? `${parentNamePath}.${f.name}`
          : f.name;
        if (f.semantic === "file:name") {
          setValue(fieldFullName, "");
        } else if (f.semantic === "file:data") {
          setValue(fieldFullName, "");
        }
      });
    }
  }, [allModules, field, fieldValue, fusionDraft, parentNamePath, setValue]);

  return (
    <Box sx={{ ml: 2 }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <RadioGroup
              name="file-semantic-radio-group"
              defaultValue="map"
              value={field.value ?? "map"}
              sx={{ ml: 1 }}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {radioOptions.map((op) => (
                <FormControlLabel
                  sx={{ mb: 1 }}
                  value={op.value}
                  control={<Radio sx={{ p: 0, mr: 1 }} size="small" />}
                  label={
                    <Typography
                      sx={{ background: op.color, px: 1, borderRadius: "5px" }}
                    >
                      {op.label}
                    </Typography>
                  }
                />
              ))}
              <FormControlLabel
                sx={{ mb: 1 }}
                value="map"
                control={<Radio sx={{ p: 0, mr: 1 }} size="small" />}
                label="Map"
              />
            </RadioGroup>
          );
        }}
      />
      {!fieldValue || fieldValue === "map" ? (
        <>
          {semanticFields.map((f) => (
            <ParamField field={f} mappable parentNamePath={parentNamePath} />
          ))}
        </>
      ) : null}
    </Box>
  );
};

export default FileSemanticField;
