import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Divider, Grid, Stack, styled, TextField } from "@mui/material";
import Label from "components/Form/Label";
import { TagEditorElement } from "components/Form/TagEditor";
import FormField from "components/FormField";
import InnerPageLayout from "layouts/inner-app-layout";
import debounce from "lodash/debounce";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useUpdateItem from "queries/useUpdateItem";
import React, { useCallback, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const InnerAppLayout = styled(Box)(({ theme }) => {
  return {
    ".MuiCardContent-root": {
      marginBottom: "0",
    },

    ".heading-light": {
      fontWeight: "400",
      color: theme.palette.text.secondary,
      marginRight: "4px",
    },

    ".heading-wrap ": {
      marginBottom: "0",
    },

    ".heading-icon ": {
      width: "30px",
      height: "30px",

      svg: {
        width: "100%",
        height: "auto",
        display: "block",
      },
    },

    ".heading-title": {
      fontSize: "24px",
      lineHeight: "32px",
      fontWeight: "600",
    },
  };
});

export const StackHolder = styled(Stack)(({ theme }) => ({
  // maxWidth: "400px",
  padding: "0 0 0 10px",

  ".MuiFormLabel-root ": {
    fontSize: "14px",
    lineHeight: "20px",
    color: theme.palette.text.primary,
    margin: "0 0 8px",
  },
}));

export const LabelHolder = styled(Grid)(({ theme }) => ({
  ".MuiFormLabel-root": {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "400",
    color: theme.palette.text.primary,
  },

  [`${theme.breakpoints.down("sm")}`]: {
    marginBottom: "20px",
  },
}));
export const RDivider = styled(Divider)(({ theme }) => ({
  margin: "30px 0",

  [`${theme.breakpoints.down("sm")}`]: {
    margin: "20px 0",
  },
}));
const formSchema = z.object({
  title: z.string(),
  value: z.string(),
  //note_type: z.string(),
  tags: z
    .array(
      z.object({ label: z.string(), value: z.string(), color: z.string() })
    )
    .optional(),
});
type FormType = z.infer<typeof formSchema>;
const EditModules = ({
  noteType,
  onBackClick,
}: { noteType: string } & React.ComponentProps<typeof InnerPageLayout>) => {
  const { noteSlug: universalNoteSlug } = useParams<{ noteSlug: string }>();

  const { data: universalNote, isLoading } = useGetItem({
    modelName: ApiModels.UniversalNote,
    slug: universalNoteSlug,
    requestOptions: {
      path: noteType,
    },
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = useForm<Partial<FormType>>({
    defaultValues: universalNote,
    resolver: zodResolver(formSchema),
  });
  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);
  const { mutate: updateNote } = useUpdateItem({
    modelName: ApiModels.UniversalNote,
    requestOptions: {
      path: noteType,
    },
  });

  useEffect(() => {
    initialValueSet.current = false;
  }, [noteType]);

  useEffect(() => {
    if (universalNote && !initialValueSet.current) {
      reset(universalNote);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [reset, universalNote]);

  const submitHandler = useCallback(
    (data: Partial<FormType>) => {
      if (universalNoteSlug && allowNetworkRequest.current) {
        updateNote(
          { slug: universalNoteSlug, data },
          {
            onSuccess: () => {
              console.log("universalNote edit success");
            },
          }
        );
      }
    },
    [universalNoteSlug, updateNote]
  );

  useEffect(() => {
    const submitDeb = debounce(() => {
      handleSubmit(submitHandler)();
    }, 600);
    const subscription = watch((_) => {
      submitDeb();
    });
    return () => subscription.unsubscribe();
  }, [watch, submitHandler, handleSubmit]);

  return (
    <InnerAppLayout>
      {/* <DevTool control={control} /> */}
      <InnerPageLayout
        title={
          <>
            <span className="heading-light">Module:</span>
            {universalNote?.title || "Note"}
          </>
        }
        backIcon
        onBackClick={onBackClick}
      >
        <Box>
          <RDivider sx={{ marginTop: "15px" }} />
          <Grid container>
            <LabelHolder item xs={12} sm={5}>
              <Label label="General" />
            </LabelHolder>
            <Grid item sm={7} xs={12}>
              <StackHolder spacing={2.5}>
                <FormField label="Title" error={errors.title}>
                  <TextField
                    {...register("title")}
                    autoFocus
                    type="text"
                    hiddenLabel={true}
                    variant="filled"
                    size="small"
                    fullWidth
                  />
                </FormField>
                <FormField label="Description" error={errors.value}>
                  <TextField
                    {...register("value")}
                    type="text"
                    hiddenLabel={true}
                    variant="filled"
                    size="small"
                    fullWidth
                    multiline
                    rows={4}
                  />
                </FormField>
                <FormField error={errors.value}>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TagEditorElement
                          value={field.value}
                          onChange={field.onChange}
                        />
                      );
                    }}
                  />
                </FormField>
              </StackHolder>
            </Grid>
          </Grid>
        </Box>
      </InnerPageLayout>
    </InnerAppLayout>
  );
};

export default EditModules;
