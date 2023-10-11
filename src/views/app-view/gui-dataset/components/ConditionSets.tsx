import {
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import React, { useMemo } from "react";
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";

export type BaseParamFieldProps = {
  // field: MappableParameter;
  parentNamePath?: string;
} & Partial<UseFormReturn>;
type FilterFieldProps = {} & BaseParamFieldProps;
type ConditionSetsProps = {
  conditionsLength: number;
} & BaseParamFieldProps;

const operators = [
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
];

const RulesButton = styled(Button)(({ theme }) => {
  return {
    height: "40px",
    boxShadow: "none",
  };
});
const ConditionSets: React.FC<ConditionSetsProps> = (props) => {
  const { datasetDesignSlug } =
    useParams<{
      slug: string;
      datasetDesignSlug: string;
      datasetSlug: string;
    }>();
  const { data: datasetDesign } = useGetItem({
    modelName: ApiModels.DatasetDesign,
    slug: datasetDesignSlug,
    queryOptions: { enabled: false },
  });

  const {
    parentNamePath,
    control,
    register,
    conditionsLength,
    // field,
    ...rest
  } = props;
  const name = parentNamePath
    ? `${parentNamePath}.condition_set`
    : "condition_set";

  const { fields, remove, insert } = useFieldArray({
    control,
    name,
  });

  const datasetDesignFields = useMemo(
    () => datasetDesign?.fields.fields || [],
    [datasetDesign]
  );
  return (
    <React.Fragment>
      {fields?.map((_, conditionIdx) => {
        return (
          <Stack
            direction="column"
            alignItems="center"
            spacing={"11px"}
            key={_.id}
            id={_.id}
          >
            {conditionIdx > 0 && (
              <RulesButton
                variant="contained"
                onClick={() => {
                  remove(conditionIdx);
                }}
                fullWidth
              >
                Remove
              </RulesButton>
            )}
            <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
              <Controller
                name={`${name}[${conditionIdx}].a`}
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      displayEmpty
                      id={name}
                      fullWidth
                      size="small"
                      sx={{ ".MuiPaper-root": { maxHeight: "300px" } }}
                      value={field.value || ""}
                      onChange={field.onChange}
                    >
                      {datasetDesignFields.map((field) => (
                        <MenuItem value={field.slug}>{field.title}</MenuItem>
                      ))}
                    </Select>
                  );
                }}
              />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
              <Controller
                name={`${name}[${conditionIdx}].o`}
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      displayEmpty
                      id={name}
                      fullWidth
                      size="small"
                      sx={{ ".MuiPaper-root": { maxHeight: "300px" } }}
                      value={field.value || ""}
                      onChange={field.onChange}
                    >
                      {operators.map((item) => (
                        <MenuItem value={item.value} key={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  );
                }}
              />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
              <Controller
                name={`${name}[${conditionIdx}].b`}
                control={control}
                render={({ field }) => {
                  return (
                    <TextField
                      id={name}
                      fullWidth
                      variant="filled"
                      size="small"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
            </Stack>
          </Stack>
        );
      })}
      <Stack
        spacing={1}
        direction="row"
        justifyContent="flex-start"
        sx={{ width: "100%" }}
      >
        <RulesButton
          variant="contained"
          onClick={() => insert(fields.length, { a: "", b: "", o: "=" })}
          fullWidth
        >
          AND
        </RulesButton>
      </Stack>
    </React.Fragment>
  );
};

export default ConditionSets;
