import {
  Button,
  Card,
  CardActions,
  CardContent,
  ClickAwayListener,
  styled,
  Tooltip,
  TooltipProps,
  useTheme,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import FormField, { FormFieldProps } from "components/FormField";
import useOpenClose from "hooks/useOpenClose";
import { useEffect, useRef } from "react";
import {
  FieldError,
  useController,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { CustomControllerProps } from "./FormFieldModalWrapper";

const DialogCard = styled(Card)(({ theme }) => {
  return {
    background: "none",

    ".MuiCardContent-root ": {
      padding: "0",
    },

    ".MuiCardActions-root": {
      padding: "20px 0 0",

      ".MuiButtonBase-root ": {
        minWidth: "87px",
      },

      ".btn-cancel": {
        background: theme.palette.background.GF10,
        color: theme.palette.background.GF50,
      },
    },
  };
});

const FormFieldTooltipWrapper = (
  props: {
    name: string;
    showBaseLabel?: boolean;
    onSubmit?(name: string, value: unknown): void;
    formSubmit?: boolean;
    tooltipProps?: Partial<TooltipProps>;
  } & Omit<FormFieldProps, "onSubmit"> &
    Omit<CustomControllerProps, "control">
) => {
  const [open, onOpen, onClose] = useOpenClose();
  const theme = useTheme();
  const {
    name,
    render,
    label,
    tooltipProps = {},
    labelProps = {},
    showBaseLabel = true,
    onSubmit,
    formSubmit = true,
    ...rest
  } = props;
  const { control, getValues, setValue } = useFormContext();
  const { errors } = useFormState({ name });
  const submitButtonRef = useRef<any>();
  const fieldRef = useRef<any>();
  const revertValueRef = useRef<any>();
  const controlProps = useController({ name });

  useEffect(() => {
    if (open) {
      revertValueRef.current = getValues(name);
      setTimeout(() => {
        fieldRef.current?.focus();
      }, 200);
    }
  }, [open, name]);

  const handleSubmit = () => {
    if (submitButtonRef.current && formSubmit) submitButtonRef.current.click();
    onSubmit?.(name, getValues(name));
    //close tooltip
    onClose();
  };
  const handleCancel = () => {
    if (open) {
      setValue(name, revertValueRef.current);
      onClose();
    }
  };
  return (
    <ClickAwayListener
      onClickAway={(e) => {
        handleCancel();
      }}
    >
      <Stack>
        {/* HIDDEN FROM BUTTON FOR SUMITTION OUT PARENT FORM */}
        <Button
          type="submit"
          size="small"
          variant="contained"
          ref={submitButtonRef}
          sx={{ display: "none" }}
        />

        {/* HIDDEN FROM BUTTON FOR SUMITTION OUT PARENT FORM */}
        <Tooltip
          open={open}
          arrow
          PopperProps={{
            sx: {
              "& .MuiTooltip-tooltip": {
                maxWidth: "inherit",
                width: "470px",

                [`${theme.breakpoints.down("sm")}`]: {
                  width: "375px",
                },

                ".MuiPaper-root": {
                  overflow: "visible",
                },
              },
            },
          }}
          title={
            <DialogCard>
              <CardContent>
                <Stack spacing={1}>
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
                    {render({ ...controlProps, isTooltipOpen: open, fieldRef })}
                  </FormField>
                </Stack>
              </CardContent>
              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  onClick={handleCancel}
                  size="small"
                  className="btn-cancel"
                >
                  Cancel
                </Button>
                <Button
                  // type="submit"
                  size="small"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </CardActions>
            </DialogCard>
          }
          {...tooltipProps}
        >
          <div onClick={() => onOpen()}>
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
                  display: !showBaseLabel ? "none" : undefined,
                },
              }}
              error={errors?.[name] as FieldError}
            >
              {render({
                ...controlProps,
                isTooltipOpen: open,
                field: {
                  ...controlProps.field,
                  value: getValues(controlProps.field.name),
                },
                isBaseElement: true,
              })}
            </FormField>
          </div>
        </Tooltip>
      </Stack>
    </ClickAwayListener>
  );
};

export default FormFieldTooltipWrapper;
