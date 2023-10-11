import { zodResolver } from "@hookform/resolvers/zod";
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
  module_name: z
    .string()
    .min(1, "Name is required")
    .max(128, "Must be at most 128 characters long."),

  connection_id: z.string(),
});

type ThreePAppRemoteProcedure = z.infer<typeof formSchema>;

type Props = {
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const AddThreePAppRemoteProcedureModal: React.FC<Props> = (props) => {
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
  } = useForm<Partial<ThreePAppRemoteProcedure>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { mutate: createThreePAppRemoteProcedure, isLoading } =
    useCreate3pSubmodule(ThreePAppSubModels.ThreePAppRemoteProcedure, {
      app: threePAppSlug!,
    });
  const { data: threePAppsConnections } = useList3pSubmodule(
    ThreePAppSubModels.ThreePAppConnection,
    { app: threePAppSlug! }
  );
  const submitHandler = (data: Partial<ThreePAppRemoteProcedure>) => {
    createThreePAppRemoteProcedure(data, {
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
      <DialogTitle>Add Remote Procedure</DialogTitle>
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
            <FormField label="Name" error={errors.module_name}>
              <TextField
                {...register("module_name")}
                autoFocus
                margin="dense"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField label="Connection" error={errors.connection_id}>
              <Select {...register("connection_id")}>
                {threePAppsConnections?.map((op) => (
                  <MenuItem key={op.label} value={op.slug}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
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

export default AddThreePAppRemoteProcedureModal;
