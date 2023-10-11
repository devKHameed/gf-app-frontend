import { Box, Button, Dialog, DialogContent, DialogProps } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import FormField, { FormFieldProps } from "components/FormField";
import useOpenClose from "hooks/useOpenClose";
import React, { useEffect, useRef } from "react";
import {
  Controller,
  FieldError,
  useFormContext,
  useFormState,
} from "react-hook-form";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
  UseFormStateReturn,
} from "react-hook-form/dist/types";

export type CustomControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  render: ({
    field,
    fieldState,
    formState,
    fieldRef,
  }: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
    isBaseElement?: boolean;
    isTooltipOpen?: boolean;
    fieldRef?: React.MutableRefObject<any>;
  }) => React.ReactElement;
} & UseControllerProps<TFieldValues, TName>;

const FormFieldModalWrapper = (
  props: {
    name: string;
    showBaseLabel?: boolean;
    onSubmit?(name: string, value: unknown): void;
    dialogProps?: Partial<DialogProps>;
  } & Omit<FormFieldProps, "onSubmit"> &
    Omit<CustomControllerProps, "control">
) => {
  const [open, onOpen, onClose] = useOpenClose();
  const {
    name,
    render,
    label,
    labelProps,
    showBaseLabel = true,
    onSubmit,
    dialogProps = {},
    ...rest
  } = props;
  const { control, getValues, setValue } = useFormContext();
  const { errors } = useFormState({ name });
  const submitButtonRef = useRef<any>();
  const fieldRef = useRef<any>();
  const revertValueRef = useRef<any>();
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      revertValueRef.current = getValues(name);
      setTimeout(() => {
        fieldRef.current?.focus();
      }, 200);
    }
  }, [open, name]);

  const handleSubmit = () => {
    if (submitButtonRef.current) submitButtonRef.current.click();
    onSubmit?.(name, getValues(name));
    //close tooltip
    onClose();
  };
  const handleCancel = () => {
    setValue(name, revertValueRef.current);
    onClose();
  };
  return (
    <Stack spacing={1}>
      {/* HIDDEN FROM BUTTON FOR SUMITTION OUT PARENT FORM */}
      <Button
        type="submit"
        size="small"
        variant="contained"
        ref={submitButtonRef}
        sx={{ display: "none" }}
      />

      {/* HIDDEN FROM BUTTON FOR SUMITTION OUT PARENT FORM */}
      <div onClick={onOpen}>
        <FormField
          label={label}
          labelProps={{
            sx: {
              fontWeight: 400,
              color: "text.primary",
              fontSize: "14px",
              lineHeight: "20px",
              mb: 1,
              display: !showBaseLabel ? "none" : undefined,
            },
          }}
          error={errors[name] as FieldError}
        >
          <Controller
            control={control}
            name={name}
            render={(fields) => render({ ...fields, isBaseElement: true })}
            {...rest}
          />
        </FormField>
      </div>
      <Dialog
        onClose={(e, r) => {
          onClose();
        }}
        disableEscapeKeyDown
        scroll="body"
        open={open}
        fullWidth
        maxWidth="xl"
        {...dialogProps}
      >
        <DialogContent>
          <Box component="form">
            <FormField
              label={label}
              labelProps={{
                sx: {
                  fontWeight: 400,
                  color: "text.primary",
                  fontSize: "14px",
                  lineHeight: "20px",
                  mb: 1,
                },
              }}
              error={errors[name] as FieldError}
            >
              <Controller
                control={control}
                name={name}
                render={(props) => render({ ...props, fieldRef })}
                {...rest}
              />
            </FormField>
          </Box>
          <Stack direction="row" justifyContent="flex-end" pt={3} gap={1.75}>
            <Button
              onClick={handleCancel}
              size="small"
              color="inherit"
              sx={{
                bgcolor: theme.palette.background.GF10,
                color: theme.palette.background.GF50,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="small"
              variant="contained"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default FormFieldModalWrapper;
