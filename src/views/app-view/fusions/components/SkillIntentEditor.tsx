import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBackOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CardActions,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import FormField from "components/FormField";
import SidebarSection from "components/RightSidebar";
import useQuery from "hooks/useQuery";
import { queryClient } from "queries";
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import useGetItem from "queries/useGetItem";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const SkillUserTableEditorContainer = styled(Box)(({ theme }) => {
  return {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    height: "100%",
    // width: "420px",

    [`${theme.breakpoints.down("sm")}`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },

    ".MuiFormLabel-root": {
      fontSize: "12px",
      lineHeight: "1",
      fontWeight: "600",
      color: theme.palette.background.GF80,
      marginBottom: "8px",
      textTransform: "uppercase",
    },

    ".MuiFormControl-root": {
      ".MuiFormControl-root": {
        marginBottom: "0",
        marginTop: "0",
      },
    },

    ".MuiListItem-root , .MuiBox-root": {
      paddingLeft: "0",
      paddingRight: "0",
    },
  };
});
const SkillIntentEditor: React.FC<{
  skillIntent?: Partial<SkillIntent> | null;
  onBackClick?(): void;
  onSaveClick(_?: Partial<SkillIntent>): void;
}> = (props) => {
  const { onBackClick, onSaveClick } = props;

  const { fusionSlug } = useParams<{ fusionSlug: string }>();
  const { skillIntentSlug } = useQuery<{ skillIntentSlug: string }>();

  const cacheSkillIntent = useMemo(() => {
    const intents = queryClient.getQueryData<SkillIntent[]>([
      ApiModels.SkillIntent,
      fusionSlug,
    ]);
    return intents?.find((ski) => ski.slug === skillIntentSlug);
  }, []);
  const { data: skillIntent } =
    useGetItem({
      modelName: ApiModels.SkillIntent,
      slug: skillIntentSlug,
    }) || cacheSkillIntent;

  const { mutate: createSkillIntent } = useCreateItem({
    modelName: ApiModels.SkillIntent,
    queryKey: [ApiModels.SkillIntent, fusionSlug],
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<Pick<SkillIntent, "intent" | "id">>({
    mode: "onBlur",
    resolver: zodResolver(
      z.object({
        id: z.string().optional(),
        intent: z.string(),
      })
    ),
  });

  useEffect(() => {
    if (skillIntent) {
      reset(skillIntent);
    }
  }, [skillIntent]);

  const onSaveHandler = async (e: Pick<SkillIntent, "intent" | "id">) => {
    if (!editMode) {
      await createSkillIntent({ ...e, skill_id: fusionSlug });
    }
    onSaveClick();
  };

  const editMode = !!skillIntentSlug;
  return (
    <SkillUserTableEditorContainer>
      <SidebarSection
        title="Add New Intent"
        rightIcon={false}
        leftIcon={<ArrowBackOutlined />}
        onLeftIconClick={() => onBackClick?.()}
      >
        <Stack spacing={2.5}>
          <FormField
            label="Intent"
            error={!!dirtyFields.intent ? errors.intent : undefined}
          >
            <TextField
              {...register("intent")}
              autoFocus
              margin="dense"
              id="name"
              type="text"
              hiddenLabel
              size="small"
              variant="filled"
              fullWidth
              disabled={editMode}
            />
          </FormField>
        </Stack>
      </SidebarSection>

      <CardActions
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => onBackClick?.()}
        >
          Back
        </Button>
        <Button
          color="inherit"
          sx={{
            bgcolor: (theme) => theme.palette.primary.main,
          }}
          onClick={handleSubmit(onSaveHandler, (e) => {
            console.error(e);
          })}
        >
          Save
        </Button>
      </CardActions>
    </SkillUserTableEditorContainer>
  );
};

export default SkillIntentEditor;
