import { Box, Divider, Grid, Stack, styled, TextField } from "@mui/material";
import ColorPicker from "components/ColorPicker";
import Label from "components/Form/Label";
import FormField from "components/FormField";
import Uploader from "components/Uploader";
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
type Props = {
  register: UseFormRegister<Partial<ThreePApp>>;
  errors: FieldErrors<Partial<ThreePApp>>;
  control: Control<Partial<ThreePApp>, any>;
};

export const LabelHolder = styled(Grid)(({ theme }) => ({
  ".MuiFormLabel-root": {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "400",
    color: theme.palette.text.primary,
  },

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

export const StackHolder = styled(Stack)(({ theme }) => ({
  maxWidth: "400px",
  padding: "0 0 0 30px",

  ".MuiFormLabel-root ": {
    fontSize: "14px",
    lineHeight: "20px",
    color: theme.palette.text.primary,
    margin: "0 0 8px",
  },
}));

const GeneralComponent = ({ register, errors, control }: Props) => {
  return (
    <Box>
      <Grid container>
        <LabelHolder item xs={12} sm={5}>
          <Label label="App details" />
        </LabelHolder>
        <Grid item sm={7} xs={12}>
          <StackHolder spacing={2.5}>
            <FormField label="Label" error={errors.app_label}>
              <TextField
                {...register("app_label")}
                autoFocus
                type="text"
                hiddenLabel={true}
                variant="filled"
                size="small"
                fullWidth
              />
            </FormField>
            <FormField label="Description" error={errors.app_description}>
              <TextField
                {...register("app_description")}
                autoFocus
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="filled"
                size="small"
              />
            </FormField>
            <FormField label="Color" error={errors.app_color}>
              <Controller
                name="app_color"
                control={control}
                render={({ field }) => (
                  <ColorPicker {...field} arrow color={field.value} />
                )}
              />
            </FormField>
            <FormField
              label="Icon"
              error={errors.app_logo_image as unknown as FieldError}
            >
              <Controller
                name="app_logo_image"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Uploader
                      single={true}
                      files={value!}
                      onChange={onChange}
                      accept={{
                        "image/*": [],
                      }}
                      multiple={false}
                      maxFiles={1}
                      maxSize={2 * 1024 * 1024} //Mb to bytes
                    />
                  );
                }}
              />
            </FormField>
          </StackHolder>
        </Grid>
      </Grid>
      <RDivider />
      <Grid container>
        <LabelHolder item xs={12} sm={5}>
          <Label label="Other" />
        </LabelHolder>
        <Grid item sm={7} xs={12}>
          <StackHolder spacing={2.5}>
            <FormField label="Label" error={errors.app_language}>
              <TextField
                {...register("app_language")}
                type="text"
                fullWidth
                variant="filled"
                size="small"
              />
            </FormField>
          </StackHolder>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralComponent;
