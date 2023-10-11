import { zodResolver } from "@hookform/resolvers/zod";
import InfoIcon from "@mui/icons-material/Info";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import FormField from "components/FormField";
import Scrollbar from "components/Scrollbar";
import useCreate3pSubmodule from "queries/3p-app-submodules/useCreate3pSubmodule";
import useList3pSubmodule from "queries/3p-app-submodules/useList3pSubmodule";
import { ThreePAppSubModels } from "queries/apiModelMapping";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  label: z
    .string()
    .min(1, "Name is required")
    .max(128, "Must be at most 128 characters long."),
  webhook_type: z.string(),
  connection_id: z.string(),
});

type ThreePAppWebhook = z.infer<typeof formSchema>;

type Props = {
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const HookOptions = [
  {
    label: "Dedicated URL Address",
    value: "dedicated",
  },
  {
    label: "Shared URL Address",
    value: "shared",
  },
];
const AddThreePAppWebhookModal: React.FC<Props> = (props) => {
  const { onClose, ...dialogProps } = props;
  const { slug: threePAppSlug } =
    useParams<{ slug: string; datasetSlug: string }>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = useForm<Partial<ThreePAppWebhook>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { mutate: createThreePAppWebhook, isLoading } = useCreate3pSubmodule(
    ThreePAppSubModels.ThreePAppWebhook,
    { app: threePAppSlug! }
  );
  const { data: threePAppsConnections } = useList3pSubmodule(
    ThreePAppSubModels.ThreePAppConnection,
    { app: threePAppSlug! }
  );
  const webhookType = watch("webhook_type");
  const submitHandler = (data: Partial<ThreePAppWebhook>) => {
    createThreePAppWebhook(data, {
      onSuccess: () => {
        console.log("inner success");
        onClose();
        reset();
      },
    });
  };

  return (
    <Dialog
      onClose={(e, r) => {
        console.log(e, r);
      }}
      disableEscapeKeyDown
      scroll="body"
      {...dialogProps}
    >
      <DialogTitle>Add Webhook</DialogTitle>
      <Scrollbar className="form-scroller">
        <DialogContent>
          <Box component="form">
            <FormField label="Label" error={errors.label}>
              <TextField
                {...register("label")}
                autoFocus
                margin="dense"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField label="Type" error={errors.webhook_type}>
              <Select {...register("webhook_type")}>
                {HookOptions.map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormField>
            {webhookType && (
              <Box>
                <FormField label="Connection" error={errors.connection_id}>
                  <Select {...register("connection_id")}>
                    {threePAppsConnections?.map((op) => (
                      <MenuItem key={op.label} value={op.slug}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormField>
                <Typography variant="body2">
                  <InfoIcon /> If you plan to register webhook automatically,
                  you will need a connection.
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Scrollbar>
      <DialogActions>
        <LoadingButton onClick={onClose}>Cancel</LoadingButton>
        <LoadingButton
          onClick={handleSubmit(submitHandler)}
          variant="contained"
          loading={isLoading}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddThreePAppWebhookModal;
