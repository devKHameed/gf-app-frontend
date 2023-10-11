import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  TextField,
} from "@mui/material";
import FormField from "components/FormField";
import Scrollbar from "components/Scrollbar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  tab_name: z.string().min(1, { message: "Name is required" }),
});

export type AddGuiTabFormType = z.infer<typeof formSchema>;

type Props = {
  onSubmit(data: AddGuiTabFormType): Promise<void>;
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const AddGuiTabModal: React.FC<Props> = (props) => {
  const { onClose, onSubmit, ...dialogProps } = props;

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddGuiTabFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const submitHandler = (data: AddGuiTabFormType) => {
    setIsLoading(true);
    onSubmit(data)
      .then(() => {
        reset();
        onClose();
      })
      .finally(() => {
        setIsLoading(true);
      });
  };

  const handleClose = () => {
    onClose?.();
    reset();
  };
  return (
    <Dialog
      onClose={handleClose}
      disableEscapeKeyDown
      scroll="body"
      {...dialogProps}
    >
      <DialogTitle>Add Gui</DialogTitle>

      <Scrollbar className="form-scroller">
        <DialogContent>
          <Box component="form">
            <FormField label="Tab Title" error={errors.tab_name}>
              <TextField
                {...register("tab_name")}
                autoFocus
                margin="dense"
                id="name"
                type="text"
                fullWidth
              />
            </FormField>
          </Box>
        </DialogContent>
      </Scrollbar>

      <DialogActions>
        <LoadingButton onClick={handleClose}>Cancel</LoadingButton>
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

export default AddGuiTabModal;
