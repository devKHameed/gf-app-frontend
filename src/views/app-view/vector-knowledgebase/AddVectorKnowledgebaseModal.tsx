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
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type AddVectorKnowledgebaseFormType = z.infer<typeof formSchema>;

type AddVectorKnowledgebaseModalProps = {
  onSubmit: (data: AddVectorKnowledgebaseFormType) => void;
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const AddVectorKnowledgebaseModal: React.FC<AddVectorKnowledgebaseModalProps> =
  (props) => {
    const { onClose, onSubmit, ...dialogProps } = props;
    const {
      register,
      handleSubmit,
      formState: { errors, dirtyFields },
      reset,
    } = useForm<AddVectorKnowledgebaseFormType>({
      mode: "onBlur",
      resolver: zodResolver(formSchema),
      defaultValues: {},
    });

    const { mutate: createVectorKnowledgebase, isLoading } = useCreateItem({
      modelName: ApiModels.VectorKnowledgebase,
    });

    const submitHandler = (data: AddVectorKnowledgebaseFormType) => {
      createVectorKnowledgebase(data, {
        onSuccess: () => {
          // queryClient.refetchQueries([
          //   [ApiModels.Folder, ApiModels.DatasetDesign],
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
        <DialogTitle>Add Vector Knowledgebase</DialogTitle>
        <Scrollbar className="form-scroller">
          <DialogContent>
            <Box component="form">
              <FormField
                label="Vector Knowledgebase Name"
                error={dirtyFields.name ? errors.name : undefined}
              >
                <TextField
                  {...register("name")}
                  autoFocus
                  margin="dense"
                  id="name"
                  type="text"
                  fullWidth
                />
              </FormField>
              <FormField
                label="Vector Knowledgebase Description"
                error={dirtyFields.description ? errors.description : undefined}
              >
                <TextField
                  {...register("description")}
                  margin="dense"
                  id="description"
                  type="text"
                  fullWidth
                  hiddenLabel
                  rows={4}
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

export default AddVectorKnowledgebaseModal;
