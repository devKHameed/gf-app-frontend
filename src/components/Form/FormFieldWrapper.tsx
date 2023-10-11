import Stack from "@mui/material/Stack";
import FormField, { FormFieldProps } from "components/FormField";
import {
  Controller,
  FieldError,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { ControllerProps } from "react-hook-form/dist/types";

const FormFieldWrapper = (
  props: { name: string } & FormFieldProps & Omit<ControllerProps, "control">
) => {
  const { name, render, rules, label, labelProps = {}, ...rest } = props;
  //const { field,} = useController({ name });
  const { control } = useFormContext();
  const { errors } = useFormState({ name });

  return (
    <Stack spacing={8}>
      <FormField
        label={label}
        labelProps={{
          ...labelProps,
          sx: {
            fontWeight: 400,
            color: "text.primary",
            fontSize: "14px",
            lineHeight: "20px",
            mb: 1,
            ...labelProps.sx,
          },
        }}
        error={errors?.[name] as FieldError}
      >
        <Controller
          control={control}
          name={name}
          render={(data) => render(data)}
          rules={rules}
          {...rest}
        />
      </FormField>
    </Stack>
  );
};

export default FormFieldWrapper;
