import { Box, Divider, Grid, Stack, styled, TextField } from "@mui/material";
import ColorPicker from "components/ColorPicker";
import Label from "components/Form/Label";
import FormField from "components/FormField";
import IconPickerField from "components/IconPicker";
import { NativeMaterialIconNames } from "constants/index";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

type Props = {
  register: UseFormRegister<Partial<DatacardDesign>>;
  errors: FieldErrors<Partial<DatacardDesign>>;
  control: Control<Partial<DatacardDesign>, any>;
};

const icons = NativeMaterialIconNames.map((icon, idx) => ({
  id: "string",
  slug: icon,
  title: icon,
  svg: "string",
  native_ref: icon,
  tags: [],
  icon_type: "native",
  category_name: `native`,
  created_by: "string",
  created_at: "string",
  updated_at: "string",
  is_deleted: 0,
}));
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
  // maxWidth: "400px",
  padding: "0 0 0 10px",

  ".MuiFormLabel-root ": {
    fontSize: "14px",
    lineHeight: "20px",
    color: theme.palette.text.primary,
    margin: "0 0 8px",
  },
}));

const BasicComponent = ({ register, errors, control }: Props) => {
  return (
    <Box>
      <Grid container>
        <LabelHolder item xs={12} sm={5}>
          <Label label="Basic Settings" />
        </LabelHolder>
        <Grid item sm={7} xs={12}>
          <StackHolder spacing={2}>
            <FormField label="Card Title" error={errors.name}>
              <TextField
                {...register("name")}
                autoFocus
                type="text"
                hiddenLabel={true}
                variant="filled"
                size="small"
                fullWidth
              />
            </FormField>
            <FormField label="Card Description" error={errors.description}>
              <TextField
                {...register("description")}
                autoFocus
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="filled"
                size="small"
              />
            </FormField>
            <FormField label="Card Color" error={errors.color}>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <ColorPicker {...field} arrow color={field.value} />
                )}
              />
            </FormField>
            <FormField label="Icon" error={errors.icon}>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <IconPickerField {...field} icons={icons} compact={true} />
                )}
              />
            </FormField>
          </StackHolder>
        </Grid>
      </Grid>
      <RDivider />
    </Box>
  );
};

export default BasicComponent;
