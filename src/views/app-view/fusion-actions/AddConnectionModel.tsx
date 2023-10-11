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
import { ConnectionTypeOptions } from "constants/index";
import useCreate3pSubmodule from "queries/3p-app-submodules/useCreate3pSubmodule";
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
  type: z.string(),
});

type ThreePAppConnection = z.infer<typeof formSchema>;

type Props = {
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const AddThreePAppConnectionModal: React.FC<Props> = (props) => {
  const { onClose, ...dialogProps } = props;
  const { slug: threePAppSlug } =
    useParams<{ slug: string; datasetSlug: string }>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
  } = useForm<Partial<ThreePAppConnection>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { mutate: createThreePAppConnection, isLoading } = useCreate3pSubmodule(
    ThreePAppSubModels.ThreePAppConnection,
    { app: threePAppSlug! }
  );

  const submitHandler = (data: Partial<ThreePAppConnection>) => {
    createThreePAppConnection(data, {
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
      <DialogTitle>Add Connection</DialogTitle>
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
            <FormField label="Type" error={errors.type}>
              <Select {...register("type")}>
                {ConnectionTypeOptions.map((op) => (
                  <MenuItem key={op} value={op}>
                    {op}
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

export default AddThreePAppConnectionModal;
