import CloseOutlined from "@mui/icons-material/CloseOutlined";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ParameterType } from "enums/3pApp";
import isArray from "lodash/isArray";
import React, { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { BaseParamFieldProps, ParamField } from "../NodeEditorFields";
import MixedTagField from "./MixedTagField";
import SelectField from "./SelectField";

type FilterFieldProps = {} & BaseParamFieldProps;
type ConditionSetsProps = {
  conditionsLength: number;
  onAddOrRuleClick(): void;
  onRemoveOrRule(): void;
} & BaseParamFieldProps;

const ConditionSets: React.FC<ConditionSetsProps> = (props) => {
  const {
    parentNamePath,
    control,
    register,
    onAddOrRuleClick,
    onRemoveOrRule,
    conditionsLength,
    field,
    ...rest
  } = props;
  const name = parentNamePath
    ? `${parentNamePath}.condition_set`
    : "condition_set";

  const { fields, remove, insert } = useFieldArray({
    control,
    name,
  });

  const operators =
    !isArray(field.options) &&
    typeof field.options !== "function" &&
    typeof field.options !== "string"
      ? field.options?.operators || []
      : [];

  const store =
    typeof field.options !== "function" && typeof field.options !== "string"
      ? isArray(field.options)
        ? field.options
        : field.options?.store
      : [];

  return (
    <>
      {fields?.map((_, conditionIdx) => {
        return (
          <Stack direction="column" alignItems="center" spacing={1}>
            {conditionIdx > 0 && (
              <Typography variant="body2" sx={{ width: "fit-content" }}>
                and
              </Typography>
            )}
            <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
              {store?.length ? (
                <SelectField
                  control={control}
                  register={register}
                  field={{
                    name: "a",
                    type: ParameterType.Select,
                    options: store,
                  }}
                  parentNamePath={`${name}.${conditionIdx}`}
                  {...rest}
                />
              ) : (
                <MixedTagField
                  {...rest}
                  control={control}
                  register={register}
                  parentNamePath={`${name}.${conditionIdx}`}
                  field={{ name: "a", type: ParameterType.Text }}
                />
              )}
              {conditionsLength > 1 || fields?.length > 1 ? (
                <IconButton
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(conditionIdx);
                    } else {
                      onRemoveOrRule();
                    }
                  }}
                >
                  <CloseOutlined />
                </IconButton>
              ) : null}
            </Stack>
            {operators.length > 0 ? (
              <SelectField
                control={control}
                register={register}
                field={{
                  name: "o",
                  type: ParameterType.Select,
                  options: operators,
                  grouped: !!operators[0]?.options?.length,
                }}
                parentNamePath={`${name}.${conditionIdx}`}
                {...rest}
              />
            ) : (
              <ParamField
                mappable={false}
                field={{
                  name: "o",
                  type: ParameterType.Text,
                  label: "Operator",
                }}
              />
            )}
            <MixedTagField
              {...rest}
              control={control}
              register={register}
              parentNamePath={`${name}.${conditionIdx}`}
              field={{ name: "b", type: ParameterType.Text }}
            />
            <Stack
              spacing={1}
              direction="row"
              justifyContent="flex-start"
              sx={{ width: "100%" }}
            >
              <Button
                variant="contained"
                onClick={() =>
                  insert(conditionIdx + 1, { a: "", b: "", o: "equal" })
                }
              >
                Add AND Rule
              </Button>
              <Button variant="contained" onClick={() => onAddOrRuleClick()}>
                Add OR Rule
              </Button>
            </Stack>
          </Stack>
        );
      })}
    </>
  );
};

const FilterField: React.FC<FilterFieldProps> = (props) => {
  const {
    field: paramField,
    control,
    register,
    parentNamePath,
    ...rest
  } = props;
  const { name: fieldName } = paramField;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  const {
    fields: aFields,
    remove,
    insert,
    replace,
  } = useFieldArray({
    control,
    name,
  });

  const fields = React.useMemo(() => aFields as FilterFieldType[], [aFields]);
  // console.log("🚀 ~ file: FilterField.tsx:172 ~ fields:", fields);

  useEffect(() => {
    if (!fields.length) {
      replace([{ condition_set: [{ a: "", b: "", o: "text:equal:ci" }] }]);
    }
  }, [fields]);

  return (
    <Box sx={{ ml: 3 }}>
      {fields.map((field, fieldIdx) => {
        return (
          <Stack direction="column" spacing={1} key={field.id}>
            {fieldIdx > 0 && (
              <Divider
                sx={{
                  "&:before, &:after": {
                    borderColor: (theme) => theme.palette.primary.main,
                  },
                }}
              >
                or
              </Divider>
            )}
            <ConditionSets
              onAddOrRuleClick={() =>
                insert(fieldIdx + 1, {
                  condition_set: [{ a: "", b: "", o: "equal" }],
                })
              }
              control={control}
              register={register}
              parentNamePath={`${name}.${fieldIdx}`}
              onRemoveOrRule={() => remove(fieldIdx)}
              conditionsLength={fields.length}
              field={paramField}
              {...rest}
            />
          </Stack>
        );
      })}
    </Box>
  );
};

export default FilterField;
