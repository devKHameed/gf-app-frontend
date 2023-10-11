import { debounce, Divider, Stack, TooltipProps } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { DataTableFieldProps } from "components/DataTable/DataTableField";
import { DocumentElementType } from "enums/Form";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  ControllerProps,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import DynamicEditField, {
  DynamicFieldProps,
  FormEvent,
} from "./DynamicEditFields";
import transformObject from "./helper";
import Label from "./Label";

type Props = {
  className?: string;
  fields: DynamicFieldProps[];
  onFormEvent?: (
    event: FormEvent & { form: UseFormReturn<FieldValues, any> }
  ) => void;
  submitButton?: boolean;
  onSubmit?: SubmitHandler<FieldValues>;
  bottomFields?: Omit<ControllerProps, "control">[];
  name?: string;
  disableTableActions?: DataTableFieldProps["disableTableActions"];
  recordListView?: "list" | "table";
  tooltipProps?: Partial<TooltipProps>;
} & UseFormProps<FieldValues>;
export type DynamicEditFormProps = Props;

export const LabelHolder = styled(Grid)(({ theme }) => ({
  [`${theme.breakpoints.down("sm")}`]: {
    marginBottom: "20px",
  },
}));

export const RDivider = styled(Divider)(({ theme }) => ({
  margin: "30px 0",

  [`${theme.breakpoints.down("sm")}`]: {
    margin: "20px 0",
  },
}));

// At the moment I know the types that gonna be submiting
// on changes But later maybe we can pass a props that will define which key to save on change
const useSubmitValuesOnChange = (
  form: UseFormReturn<FieldValues, any>,
  {
    fields,
    onSubmit,
  }: { fields: DynamicFieldProps[]; onSubmit: Props["onSubmit"] }
) => {
  const watch = form.watch;
  const fieldsMap = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    fields.forEach((field) => {
      fieldsMap.current.set(field.name, field.type);
    });
  }, [fields]);

  useEffect(() => {
    const submitDeb = debounce(() => {
      form.handleSubmit(onSubmit!)();
    }, 300);
    const subscription = watch((_, { name }) => {
      const type = fieldsMap.current.get(name!);
      switch (type) {
        case DocumentElementType.Color:
        case DocumentElementType.Boolean:
        case DocumentElementType.Checkbox:
        case DocumentElementType.Radio:
        case DocumentElementType.Progress:
        case DocumentElementType.Date:
        case DocumentElementType.Rating:
        case DocumentElementType.File:
        case DocumentElementType.AudioVideo:
        case DocumentElementType.Image:
        case "icon":
          submitDeb();

          return;
        default:
          return;
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onSubmit]);
};

export type FormRefAttribute = UseFormReturn<FieldValues, any>;

const FieldContainer = styled("div")(() => ({}));
const DynamicEditForm = forwardRef<FormRefAttribute | unknown, Props>(
  (
    {
      className,
      submitButton = true,
      onSubmit,
      fields,
      bottomFields = [],
      name,
      disableTableActions,
      onFormEvent,
      recordListView,
      tooltipProps,
      ...rest
    },
    ref
  ) => {
    const form = useForm({ ...rest });

    const submit = useCallback(
      (value: any) => {
        // console.log("----values", value);
        onSubmit?.(value);
      },
      [onSubmit]
    );
    //Hack To submit Values onChanges
    useSubmitValuesOnChange(form, { fields, onSubmit: submit });

    const transformFields = useMemo(() => transformObject(fields), [fields]);
    useImperativeHandle(ref, () => form);
    return (
      <Box className={className}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            {transformFields.map((transformField) => {
              if (transformField.type === DocumentElementType.RecordList) {
                return (
                  <Grid container>
                    {transformField.fields.map((f) => (
                      <>
                        <Grid item xs={12} sm={3}>
                          <Label label={f.title || f.label || ""} />
                        </Grid>
                        <Grid item xs={12}>
                          <Stack>
                            <FieldContainer sx={f.sx}>
                              <DynamicEditField
                                {...f}
                                onFormEvent={(event) => {
                                  onFormEvent?.({
                                    ...event,
                                    form,
                                  });
                                }}
                                disableTableActions={disableTableActions}
                                formSubmit={false}
                                recordListView={recordListView}
                                tooltipProps={tooltipProps}
                              />
                            </FieldContainer>
                          </Stack>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                );
              }
              return (
                <React.Fragment>
                  <Grid container>
                    <LabelHolder item xs={12} sm={4}>
                      <FieldContainer sx={transformField?.label?.sx}>
                        <DynamicEditField
                          onFormEvent={(event) =>
                            onFormEvent?.({
                              ...event,
                              form,
                            })
                          }
                          {...transformField.label}
                        />
                      </FieldContainer>
                    </LabelHolder>
                    <Grid item xs={12} sm={6}>
                      <Stack gap={1}>
                        {transformField.fields.map((field) => (
                          <Box>
                            <FieldContainer sx={field?.sx}>
                              <DynamicEditField
                                onFormEvent={(event) => {
                                  onFormEvent?.({
                                    ...event,
                                    form,
                                  });
                                }}
                                disableTableActions={disableTableActions}
                                recordListView={recordListView}
                                tooltipProps={tooltipProps}
                                {...field}
                              />
                            </FieldContainer>
                          </Box>
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                  <RDivider />
                </React.Fragment>
              );
            })}
          </form>
        </FormProvider>
      </Box>
    );
  }
);

export default styled(DynamicEditForm)((theme) => {
  return {};
});
