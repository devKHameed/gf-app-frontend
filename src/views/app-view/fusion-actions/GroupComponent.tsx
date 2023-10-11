import { Box, Stack, styled, Typography } from "@mui/material";
import CodeEditorField from "components/CodeEditor/CodeEditorField";
import FormField from "components/FormField";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

type Props = {
  register: UseFormRegister<Partial<ThreePApp>>;
  errors: FieldErrors<Partial<ThreePApp>>;
  control: Control<Partial<ThreePApp>, any>;
};

const ItemWrapper = styled(Stack)(() => {
  return {
    marginBottom: "30px",
  };
});

const LinkWrapper = styled(Box)(({ theme }) => {
  return {
    display: "inline-block",
    verticalAlign: "top",
    color: theme.palette.primary.main,
    cursor: "pointer",

    svg: {
      width: "24px",
      height: "auto",
      marginLeft: "8px",
      display: "inline-block",
      verticalAlign: "middle",
      color: theme.palette.background.GF60,
    },
  };
});

const GroupComponent = ({ register, errors, control }: Props) => {
  return (
    <Box>
      <ItemWrapper gap={2.5}>
        <Box>
          <Typography variant="h6">Groups</Typography>
          <Typography variant="body1" color="text.secondary">
            List of groups. Allows you to change ordinality of modules or group
            different types of modules together. If you left all modules in a
            default Other group, we'll display modules grouped by type.
          </Typography>
        </Box>
        <FormField>
          <Controller
            name="groups"
            control={control}
            render={({ field }) => (
              <CodeEditorField {...field} value={field.value!} mode="json" />
            )}
          />
        </FormField>
      </ItemWrapper>
    </Box>
  );
};

export default GroupComponent;
