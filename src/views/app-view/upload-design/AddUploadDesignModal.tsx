import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import FormField from "components/FormField";
import Scrollbar from "components/Scrollbar";
import FileUploader from "components/Uploader";
import { queryClient } from "queries";
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import React from "react";
import { Accept } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export const getAcceptedFileTypes = (
  type: AddUploadDesignFormType["type"]
): Accept => {
  switch (type) {
    case "audio":
      return { "audio/*": [] };
    case "csv":
      return { "text/*": [".csv"] };
    case "image":
      return { "image/*": [] };
    case "video":
      return { "video/*": [] };
    case "word_doc":
      return { "application/*": [".docx", ".doc"] };
  }
};

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["word_doc", "image", "csv", "audio", "video"]).default("csv"),
  sample_file: z.any().optional(),
});

type AddUploadDesignFormType = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: AddUploadDesignFormType) => void;
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const AddUploadDesignModal: React.FC<Props> = (props) => {
  const { onClose, onSubmit, ...dialogProps } = props;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = useForm<AddUploadDesignFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "csv",
    },
  });

  const { mutate: createUploadDesign, isLoading } = useCreateItem({
    modelName: ApiModels.UploadDesign,
  });

  const type = watch("type");

  const submitHandler = (data: AddUploadDesignFormType) => {
    createUploadDesign(data, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: [ApiModels.Folder, ApiModels.UploadDesign],
          type: "active",
          exact: true,
        });
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
      <DialogTitle>Add Dataset Design</DialogTitle>
      <Scrollbar className="form-scroller">
        <DialogContent>
          <Stack direction="column" spacing={1} component="form">
            <FormField
              label="Title"
              error={dirtyFields.title ? errors.title : undefined}
            >
              <TextField
                {...register("title")}
                autoFocus
                margin="dense"
                id="title"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField
              label="Type"
              error={dirtyFields.type ? errors.type : undefined}
            >
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    {...field}
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    id="type"
                  >
                    <MenuItem value="word_doc">Word Document</MenuItem>
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Sample File Link" fullWidth>
              <Controller
                control={control}
                name="sample_file"
                render={({ field }) => (
                  <FileUploader
                    single={true}
                    files={field.value}
                    onChange={field.onChange}
                    uploadPathPrefix="imports"
                    accept={getAcceptedFileTypes(type)}
                    multiple={false}
                    maxFiles={1}
                    extra={{
                      description: ".jpg, .png, .csv, .doc, or .docx",
                    }}
                    sxProps={{
                      width: "100% !important",
                      maxWidth: "100% !important",
                      margin: "0 !important",
                      background: "rgba(0, 0, 0, 0.12)",
                    }}
                  />
                )}
              />
            </FormField>
          </Stack>
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

export default AddUploadDesignModal;
