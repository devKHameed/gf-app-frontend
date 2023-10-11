import { Button, Divider, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { DocumentElementType } from "enums/Form";
import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import {
  Controller,
  ControllerProps,
  FieldValues,
  FormProvider,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import DynamicCreateFields, { DynamicFieldProps } from "./DynamicCreateFields";
import { FormEvent } from "./DynamicEditFields";
import Label from "./Label";
import transformObject from "./helper";

type Props = {
  className?: string;
  fields: DynamicFieldProps[];
  submitButton?: boolean;
  onFormEvent?: (
    event: FormEvent & { form: UseFormReturn<FieldValues, any> }
  ) => void;
  onSubmit?: (value: any) => void;
  bottomFields?: Omit<ControllerProps, "control">[];
  submitButtonComponent?: (
    _: UseFormReturn<FieldValues, any>
  ) => React.ReactElement;
  name?: string;
  labelCol?: boolean;
  allFieldsFullWidth?: boolean;
};

const getColWith = (type: string) => {
  switch (type) {
    case "email":
    case "url":
    case "phone":
    case "money":
    case DocumentElementType.Color:
    case DocumentElementType.Boolean:
    case DocumentElementType.Select:
    case DocumentElementType.Number:
    case DocumentElementType.TextField:
      return { xs: 12, sm: 6 };
    default:
      return { xs: 12 };
  }
};

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

export type FormRefAttribute = UseFormReturn<FieldValues, any>;
const DynamicCreateForm = forwardRef<FormRefAttribute | unknown, Props>(
  (
    {
      className,
      submitButton = true,
      onSubmit,
      submitButtonComponent,
      fields,
      bottomFields = [],
      name,
      onFormEvent,
      labelCol = true,
      allFieldsFullWidth = false,
    },
    ref
  ) => {
    const form = useForm({
      shouldUnregister: true,
    });
    const submit = (value: any) => {
      // console.log("----values", value);
      onSubmit?.(value);
    };

    const transformFields = useMemo(() => transformObject(fields), [fields]);

    // const formValues = form.watch();
    // console.log("🚀 ~ file: DynamicCreateForm.tsx:70 ~ formValues:", formValues);
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
                        <Grid item xs={12}>
                          <Label label={f.title || f.label || ""} />
                        </Grid>
                        <Grid item xs={12}>
                          <Stack>
                            <DynamicCreateFields
                              {...f}
                              formSubmit={false}
                              onFormEvent={(event) => {
                                onFormEvent?.({
                                  ...event,
                                  form,
                                });
                              }}
                            />
                          </Stack>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                );
              }

              return (
                <>
                  <Grid container>
                    {labelCol && (
                      <LabelHolder item xs={12} sm={3}>
                        <DynamicCreateFields
                          {...transformField.label}
                          onFormEvent={(event) => {
                            onFormEvent?.({
                              ...event,
                              form,
                            });
                          }}
                        />
                      </LabelHolder>
                    )}
                    <Grid item sm={9} xs={12} {...(labelCol ? {} : { sm: 12 })}>
                      <Stack spacing={1}>
                        <Grid container columnSpacing={2.5} rowSpacing={2}>
                          {transformField.fields.map((field) => (
                            <Grid
                              item
                              xs={
                                allFieldsFullWidth
                                  ? 12
                                  : getColWith(field.type).xs
                              }
                              sm={
                                allFieldsFullWidth
                                  ? 12
                                  : getColWith(field.type).sm
                              }
                            >
                              <DynamicCreateFields
                                {...field}
                                onFormEvent={(event) => {
                                  onFormEvent?.({
                                    ...event,
                                    form,
                                  });
                                }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Stack>
                    </Grid>
                  </Grid>
                  <RDivider />
                </>
              );
            })}
            {bottomFields.map((field) => {
              return <Controller control={form.control} {...field} />;
            })}
            {submitButton && (
              <React.Fragment>
                {submitButtonComponent ? (
                  submitButtonComponent(form)
                ) : (
                  <Stack direction="row" justifyContent="flex-end">
                    <Button type="submit" variant="contained">
                      Submit
                    </Button>
                  </Stack>
                )}
              </React.Fragment>
            )}
          </form>
          {/* <DevTool control={form.control} /> */}
        </FormProvider>
      </Box>
    );
  }
);

export default styled(DynamicCreateForm)((theme) => {
  return {};
});
