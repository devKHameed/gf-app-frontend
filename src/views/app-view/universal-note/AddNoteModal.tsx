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
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "first name is required"),
  note_type: z.string().min(1, "last name is required"),
  value: z.string({ required_error: "email name is required" }),
});

type AddUniversalNoteFormType = z.infer<typeof formSchema>;

type Props = {
  onClose: () => void;
  noteType: string;
} & Omit<DialogProps, "onSubmit">;

const AddUniversalNoteModal: React.FC<Props> = (props) => {
  const { onClose, noteType, ...dialogProps } = props;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
  } = useForm<AddUniversalNoteFormType>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: { note_type: noteType },
  });

  const { mutate: createUniversalNote, isLoading } = useCreateItem({
    modelName: ApiModels.UniversalNote,
    mutationOptions: {
      mutationKey: [noteType, ApiModels.UniversalNote],
    },
  });

  const submitHandler = (data: AddUniversalNoteFormType) => {
    createUniversalNote(data, {
      onSuccess: () => {
        console.log("inner success");
        // queryClient.refetchQueries([
        //   [ApiModels.Folder, ApiModels.UniversalNote],
        // ]);
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
      <DialogTitle>Add Note</DialogTitle>
      <Scrollbar className="form-scroller">
        <DialogContent>
          <Box component="form">
            <FormField
              label="Title"
              error={dirtyFields.title ? errors.title : undefined}
            >
              <TextField
                {...register("title")}
                autoFocus
                margin="dense"
                id="name"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField
              label="Last Name"
              error={dirtyFields.value ? errors.value : undefined}
            >
              <TextField
                {...register("value")}
                margin="dense"
                type="text"
                rows={4}
                fullWidth
                multiline
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

export default AddUniversalNoteModal;
