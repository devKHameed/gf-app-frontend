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
import Scrollbar from "components/Scrollbar";
import Uploader from "components/Uploader";
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
  app_name: z.string().min(1, "Name is required"),
  app_label: z.string().optional(),
  app_description: z.string().optional(),
  app_color: z.string().optional(),
  app_logo_image: z.any().optional(),
});

type ThreePApp = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: Partial<ThreePApp>) => void;
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const AddThreePAppModal: React.FC<Props> = (props) => {
  const { onClose, onSubmit, ...dialogProps } = props;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
  } = useForm<Partial<ThreePApp>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      app_color: "#0A8CA4",
    },
  });

  const { mutate: createThreePApp, isLoading } = useCreateItem({
    modelName: ApiModels.ThreePApp,
  });

  const submitHandler = (data: Partial<ThreePApp>) => {
    createThreePApp(data, {
      onSuccess: () => {
        console.log("inner success");
        queryClient.refetchQueries([[ApiModels.Folder, ApiModels.ThreePApp]]);
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
      <DialogTitle>Add Fusion Action</DialogTitle>
      <Scrollbar className="form-scroller">
        <DialogContent>
          <Box component="form">
            <FormField label="Name" error={errors.app_name}>
              <TextField
                {...register("app_name")}
                autoFocus
                margin="dense"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField label="Label" error={errors.app_label}>
              <TextField
                {...register("app_label")}
                margin="dense"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField label="Color" error={errors.app_color}>
              <Controller
                name="app_color"
                control={control}
                render={({ field }) => (
                  <ColorPicker {...field} arrow color={field.value} />
                )}
              />
            </FormField>
            <FormField
              label="Icon"
              error={errors.app_logo_image as unknown as any}
            >
              <Controller
                name="app_logo_image"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Uploader
                    single={true}
                    files={value!}
                    onChange={onChange}
                    accept={{
                      "image/*": [],
                    }}
                    multiple={false}
                    maxFiles={1}
                    maxSize={2 * 1024 * 1024} //Mb to bytes
                  />
                )}
              />
            </FormField>
            <FormField label="Description" error={errors.app_description}>
              <TextField
                {...register("app_description")}
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

export default AddThreePAppModal;
