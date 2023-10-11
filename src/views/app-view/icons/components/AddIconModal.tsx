import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormField from "components/FormField";
import TagsField from "components/TagsField";
import UploadField from "components/UploadField";
import IconModel from "models/Icon";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  onSubmit: (data: any) => void;
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const ICON_TYPES = ["s", "n", "c"] as const;

const formSchema = z.object({
  icon_type: z.enum(ICON_TYPES),
  title: z.string().min(1, { message: "Title is required" }),
  category_name: z.string().min(1, { message: "Category name is required" }),
  native_ref: z.string().optional(),
  svg: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
// .refine((data) => data.icon_type === "n" && data.native_ref, {
//   message: "Icon name is required",
//   path: ["native_ref"],
// })
// .refine(
//   (data) => {
//     if (["s", "c"].includes(data.icon_type) && data.svg) {
//       return true;
//     }
//   },
//   {
//     message: "SVG is required",
//     path: ["svg"],
//   }
// );

type AddIconFormType = z.infer<typeof formSchema>;

const AddIconModal: React.FC<Props> = (props) => {
  const { onClose, onSubmit, ...dialogProps } = props;
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, dirtyFields },
  } = useForm<AddIconFormType>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon_type: "s",
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation<Icon, unknown, AddIconFormType>({
    mutationFn: async (icon) => {
      const res = await IconModel.create(icon);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueriesData(["icons"], (icons: Icon[] = []) => {
        return [...icons, data];
      });
    },
  });

  const watchIconType = watch("icon_type");

  const submitHandler = (data: AddIconFormType) => {
    console.log({ data });
    mutation.mutate(data);
    onClose();
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
      <DialogTitle>Add Icon</DialogTitle>
      <DialogContent>
        <Box component="form">
          <FormField
            label="Icon Type"
            error={!!dirtyFields.icon_type ? errors.icon_type : undefined}
          >
            <Controller
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    margin="dense"
                    id="icon_type"
                    fullWidth
                    select
                  >
                    <MenuItem value="s">System</MenuItem>
                    <MenuItem value="n">Native</MenuItem>
                    <MenuItem value="c">Custom</MenuItem>
                  </TextField>
                );
              }}
              control={control}
              name="icon_type"
            />
          </FormField>
          <FormField
            label="Title"
            error={!!dirtyFields.title ? errors.title : undefined}
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
          {watchIconType === "n" ? (
            <FormField
              label="Icon Name"
              error={!!dirtyFields.native_ref ? errors.native_ref : undefined}
            >
              <TextField
                {...register("native_ref")}
                autoFocus
                margin="dense"
                id="icon_name"
                type="text"
                fullWidth
              />
            </FormField>
          ) : (
            <FormField
              label="SVG"
              error={!!dirtyFields.svg ? errors.svg : undefined}
            >
              <Controller
                render={({ field }) => <UploadField {...field} />}
                name="svg"
                control={control}
              />
            </FormField>
          )}
          <FormField label="Tags">
            <Controller
              name="tags"
              control={control}
              render={({ field }) => {
                return (
                  <TagsField {...field} fieldProps={{ fullWidth: true }} />
                );
              }}
            />
          </FormField>
          <FormField
            label="Category"
            error={
              !!dirtyFields.category_name ? errors.category_name : undefined
            }
          >
            <TextField
              {...register("category_name")}
              margin="dense"
              id="category_name"
              type="text"
              fullWidth
            />
          </FormField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(submitHandler)}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIconModal;
