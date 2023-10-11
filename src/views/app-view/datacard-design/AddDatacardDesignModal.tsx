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
import ColorPicker from "components/ColorPicker";
import FormField from "components/FormField";
import IconPickerField from "components/IconPicker";
import Scrollbar from "components/Scrollbar";
import { NativeMaterialIconNames } from "constants/index";
import { queryClient } from "queries";
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const icons = NativeMaterialIconNames.map((icon, idx) => ({
  id: "string",
  slug: icon,
  title: icon,
  svg: "string",
  native_ref: icon,
  tags: [],
  icon_type: "native",
  category_name: `native`,
  created_by: "string",
  created_at: "string",
  updated_at: "string",
  is_deleted: 0,
}));

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dataset_slug: z.string().min(1, "Slug is required"),
  color: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
});

type AddDataCardDesignFormType = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: AddDataCardDesignFormType) => void;
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const AddDataCardDesignModal: React.FC<Props> = (props) => {
  const { onClose, onSubmit, ...dialogProps } = props;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
  } = useForm<AddDataCardDesignFormType>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: "#ffffff",
    },
  });

  const { mutate: createDatacardDesign, isLoading } = useCreateItem({
    modelName: ApiModels.DatacardDesign,
    mutationOptions: {
      mutationKey: [ApiModels.DatacardDesign],
    },
  });

  const submitHandler = (data: AddDataCardDesignFormType) => {
    createDatacardDesign(
      { ...data, datacard_type: "contacts" },
      {
        onSuccess: () => {
          console.log("inner success");
          queryClient.refetchQueries([
            [ApiModels.Folder, ApiModels.DatacardDesign],
          ]);
          onClose();
          reset();
        },
      }
    );
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
      <DialogTitle>Add Datacard Design</DialogTitle>
      <Scrollbar className="form-scroller">
        <DialogContent>
          <Box component="form">
            <FormField
              label="Datacard Design Name"
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
              label="Datacard Design Slug"
              error={dirtyFields.dataset_slug ? errors.dataset_slug : undefined}
            >
              <TextField
                {...register("dataset_slug")}
                margin="dense"
                id="dataset_slug"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField
              label="Datacard Design Color"
              error={dirtyFields.color ? errors.color : undefined}
            >
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <ColorPicker {...field} arrow color={field.value}>
                    <TextField fullWidth />
                  </ColorPicker>
                )}
              />
            </FormField>
            <FormField
              label="Datacard Design Icon"
              error={dirtyFields.icon ? errors.icon : undefined}
            >
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <IconPickerField {...field} icons={icons} />
                )}
              />
            </FormField>
            <FormField
              label="Datacard Design Description"
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

export default AddDataCardDesignModal;
