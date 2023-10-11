import { json } from "@codemirror/lang-json";
import { ContentCopy } from "@mui/icons-material";
import {
  Box,
  Portal,
  Snackbar,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import CodeEditor from "components/CodeEditor";
import CodeEditorField from "components/CodeEditor/CodeEditorField";
import FormField from "components/FormField";
import { useState } from "react";
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
  shareableUrl?: string;
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

const SnackbarWrap = styled(Snackbar)(({ theme }) => {
  return {
    ".MuiPaper-root ": {
      background: theme.palette.success.main,
      color: theme.palette.text.primary,
    },
  };
});

const BaseComponet = ({ register, errors, control, shareableUrl }: Props) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(window.location.toString());
  };
  return (
    <Box>
      <ItemWrapper>
        <FormField>
          <Controller
            name="base_structure"
            control={control}
            render={({ field }) => (
              <CodeEditorField {...field} value={field.value!} mode="json" />
            )}
          />
        </FormField>
      </ItemWrapper>
      <ItemWrapper gap={2.5}>
        <Box>
          <Typography variant="h6">Common data</Typography>
          <Typography variant="body1" color="text.secondary">
            Collection of common data accessible through common.variable
            expression. Contains sensitive information like API keys or API
            secrets. This collection is shared across all modules.
          </Typography>
        </Box>
        <FormField>
          <CodeEditor
            // {...register("app_label")}
            extensions={[json()]}
          />
        </FormField>
      </ItemWrapper>
      <ItemWrapper>
        <Stack gap={1.25}>
          <Box>
            <Typography variant="h6">Invite users</Typography>
            <Typography variant="body1" color="text.secondary">
              Share this invitation URL with other users to allow them to use
              your App.
            </Typography>
          </Box>
          <Box>
            <LinkWrapper onClick={handleClick}>
              {shareableUrl} <ContentCopy />
            </LinkWrapper>
            <Portal>
              <SnackbarWrap
                open={open}
                message="Copied to clipboard"
                onClose={() => setOpen(false)}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              />
            </Portal>
          </Box>
        </Stack>
      </ItemWrapper>
    </Box>
  );
};

export default BaseComponet;
