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
import {
  ActionTypeOptions,
  ModuleTypeOptions,
  UniversalSubtypeOptions,
} from "constants/3pApps";
import { ModuleType } from "enums/3pApp";
import useCreate3pSubmodule from "queries/3p-app-submodules/useCreate3pSubmodule";
import useList3pSubmodule from "queries/3p-app-submodules/useList3pSubmodule";
import { ThreePAppSubModels } from "queries/apiModelMapping";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  module_type: z.string(),
  module_action: z.string().optional(),
  universal_subtype: z.string().optional(),
  connection_id: z.string().optional(),
  module_name: z.string(),
  label: z
    .string()
    .min(1, "label is required")
    .max(128, "Must be at most 128 characters long."),
});

type ThreePAppAction = z.infer<typeof formSchema>;

type Props = {
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const AddThreePAppActionModal: React.FC<Props> = (props) => {
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
  } = useForm<Partial<ThreePAppAction>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      module_type: "",
      module_action: "",
      universal_subtype: "",
      connection_id: "",
      module_name: "",
      label: "",
    },
  });

  const { mutate: createThreePAppAction, isLoading } = useCreate3pSubmodule(
    ThreePAppSubModels.ThreePAppAction,
    { app: threePAppSlug! }
  );
  const { data: threePAppsConnections } = useList3pSubmodule(
    ThreePAppSubModels.ThreePAppConnection,
    { app: threePAppSlug! }
  );
  const { data: threePAppsWebhooks } = useList3pSubmodule(
    ThreePAppSubModels.ThreePAppWebhook,
    { app: threePAppSlug! }
  );
  const moduleType = watch("module_type");
  const submitHandler = (data: Partial<ThreePAppAction>) => {
    createThreePAppAction(data, {
      onSuccess: () => {
        console.log("inner success");
        onClose();
        reset();
      },
    });
  };

  const connectionElement = useMemo(() => {
    switch (moduleType) {
      case ModuleType.Responder:
        return null;
      case ModuleType.InstantTrigger:
        return (
          <FormField label="Webhook" error={errors.connection_id}>
            <Select {...register("connection_id")}>
              {threePAppsWebhooks?.map((op) => (
                <MenuItem key={op.label} value={op.slug}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormField>
        );
      default:
        return (
          <FormField label="Connection" error={errors.connection_id}>
            <Select {...register("connection_id")}>
              {threePAppsConnections?.map((op) => (
                <MenuItem key={op.label} value={op.slug}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormField>
        );
    }
  }, [
    errors.connection_id,
    moduleType,
    register,
    threePAppsConnections,
    threePAppsWebhooks,
  ]);
  return (
    <Dialog
      onClose={(e, r) => {
        console.log(e, r);
      }}
      disableEscapeKeyDown
      scroll="body"
      {...dialogProps}
    >
      <DialogTitle>Add Action</DialogTitle>
      <Scrollbar className="form-scroller">
        <DialogContent>
          <Box component="form">
            <FormField label="Module Type" error={errors.module_type}>
              <Select {...register("module_type")}>
                {ModuleTypeOptions.map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormField>

            {moduleType === ModuleType.Action && (
              <Box>
                <FormField label="Module action" error={errors.module_action}>
                  <Select {...register("module_action")}>
                    {ActionTypeOptions?.map((op) => (
                      <MenuItem key={op.label} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormField>
                <Typography variant="body2">
                  <InfoIcon /> Select the action performed by the module. If the
                  module is multipurpose, then leave the field empty.
                </Typography>
              </Box>
            )}
            {moduleType === ModuleType.Universal && (
              <Box>
                <FormField label="Subtype" error={errors.universal_subtype}>
                  <Select {...register("universal_subtype")}>
                    {UniversalSubtypeOptions?.map((op) => (
                      <MenuItem key={op.label} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormField>
              </Box>
            )}
            {connectionElement}
            <FormField label="Name" error={errors.module_name}>
              <TextField
                {...register("module_name")}
                autoFocus
                margin="dense"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField label="Label" error={errors.label}>
              <TextField
                {...register("label")}
                autoFocus
                margin="dense"
                type="text"
                fullWidth
              />
            </FormField>
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

export default AddThreePAppActionModal;
