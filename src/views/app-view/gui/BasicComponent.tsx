import { Settings } from "@mui/icons-material";
import { Box, Button, Divider, Grid, Stack, styled } from "@mui/material";
import ColorPicker from "components/ColorPicker";
import Label from "components/Form/Label";
import ToolTipInput from "components/Form/TooltipFields/Input";
import TooltipSelect from "components/Form/TooltipFields/Select";
import FormField from "components/FormField";
import IconPickerField from "components/IconPicker";
import { GUI_TYPE_OPTIONS } from "constants/gui";
import { NativeMaterialIconNames } from "constants/index";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

type Props = {
  register: UseFormRegister<Partial<GfGui>>;
  errors: FieldErrors<Partial<GfGui>>;
  control: Control<Partial<GfGui>, any>;
  onEditDashboardClick: (_: React.SyntheticEvent) => void;
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

const BasicComponent = ({
  register,
  errors,
  control,
  onEditDashboardClick,
}: Props) => {
  return (
    <Box>
      <RDivider />
      <Grid container>
        <LabelHolder item xs={12} sm={5}>
          <Label label="General" />
        </LabelHolder>
        <Grid item sm={7} xs={12}>
          <StackHolder spacing={2.5}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
                <TooltipSelect
                  name="gui_type"
                  label={"Workspace type"}
                  options={GUI_TYPE_OPTIONS}
                  tooltipInlineElementProps={{
                    disabled: true,
                    defaultOpen: false,
                  }}
                />
              </Box>
              <Button
                variant="outlined"
                onClick={onEditDashboardClick}
                sx={{
                  minWidth: "220px",
                  height: "41px",
                  marginTop: "27px",
                  marginLeft: "28px",
                }}
              >
                Edit Dashboard <Settings sx={{ marginLeft: "10px" }} />
              </Button>
            </Box>

            <ToolTipInput name={"name"} label={"Workspace Title"} />

            <FormField label="Color" error={errors.icon}>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <ColorPicker {...field} color={field.value} />
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
