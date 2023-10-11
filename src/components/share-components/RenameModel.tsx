import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormField from "components/FormField";
import Scrollbar from "components/Scrollbar";
import useOpenClose from "hooks/useOpenClose";
import { ApiModelDataTypes, ApiModelMapping } from "queries/apiModelMapping";
import useUpdateItem from "queries/useUpdateItem";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useSystemLayoutBaseStore } from "store/stores/systemLayout";
import { z } from "zod";

type props<T extends keyof typeof ApiModelMapping> = {
  module: T;
  title: string;
};
const RenameModel = <T extends keyof typeof ApiModelMapping>({
  module,
  title,
}: props<T>) => {
  const [isOpen, onOpen, onClose] = useOpenClose();
  const [data, setData] = React.useState<{ name: string; slug: string }>();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<{ name: string }>({
    mode: "onBlur",
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Name is required"),
      })
    ),
    defaultValues: {},
  });

  const { mutate: updateItem, isLoading } = useUpdateItem({
    modelName: module,
  });

  const closeHandler = () => {
    onClose();
  };
  const submitHandler = (formData: { name: string }) => {
    if (data?.slug)
      updateItem(
        {
          slug: data.slug,
          data: formData as unknown as Partial<ApiModelDataTypes[T]>,
        },
        {
          onSuccess: () => {
            closeHandler();
          },
        }
      );
  };

  const onRenameHandler = (data: AppItem) => {
    setData({ name: data.title, slug: data.key });
    reset({ name: data.title });
    onOpen();
  };
  React.useEffect(() => {
    useSystemLayoutBaseStore.getState().setOnRename(onRenameHandler);
  }, []);

  return (
    <React.Fragment>
      <Dialog open={isOpen} disableEscapeKeyDown scroll="body">
        <DialogTitle>{title} Rename</DialogTitle>
        <Scrollbar className="form-scroller">
          <DialogContent>
            <Box component="form">
              <FormField
                label={`Name`}
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
            </Box>
          </DialogContent>
        </Scrollbar>
        <DialogActions>
          <Button onClick={closeHandler} disabled={isLoading}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSubmit(submitHandler)}
            variant="contained"
            type="submit"
            loading={isLoading}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default RenameModel;
