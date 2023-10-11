import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowBackOutlined,
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  CardActions,
  IconButton,
  Stack,
  TextField,
  styled,
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import FormField from "components/FormField";
import SidebarSection from "components/RightSidebar";
import AnimationLayout, { Config } from "layouts/AnimationLayout";
import FinetuneKnowledgebaseTopicModel from "models/FinetuneKnowledgebaseTopic";
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import useDeleteItem from "queries/useDeleteItem";
import useListItems from "queries/useListItems";
import useUpdateItem from "queries/useUpdateItem";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import InfoList from "stories/CompoundComponent/AccountInfoCard/AccountInfoCard/AccountInfoCard";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
import { getSearchParams } from "utils";
import { z } from "zod";

const SidebarWrap = styled(Box)(({ theme }) => {
  return {
    padding: "0 20px 20px 20px",

    [`${theme.breakpoints.down("sm")}`]: {
      padding: "0 0 20px",
    },
  };
});

const SidebarContainer = styled(Box)(({ theme }) => {
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
  };
});

const SidebarSectionWrap = styled(SidebarSection)(({ theme }) => {
  return {
    ".MuiCard-root:hover": {
      background: `${theme.palette.background.GFRightNavForeground} !important`,

      ".edit-icon": {
        opacity: "1",
        visibility: "visible",
      },
    },

    ".record-item": {
      transition: "all 0.4s ease",

      "&:hover ": {
        background: theme.palette.background.GF20,

        ".edit-icon": {
          opacity: "1",
          visibility: "visible",
        },
      },
    },

    ".edit-icon": {
      width: "16px",
      height: "16px",
      color: theme.palette.background.GF60,
      transition: "all 0.4s ease",
      opacity: "0",
      visibility: "hidden",
      cursor: "pointer",

      "&:hover": {
        color: theme.palette.text.primary,
      },

      svg: {
        width: "100%",
        height: "auto",
        display: "block",
        color: "currentColor",
      },
    },
  };
});

const InfoListWrap = styled(InfoList)(({ theme }) => {
  return {
    ".MuiList-root": {
      padding: "12px 0 8px",
    },
  };
});

const ButtonContainer = styled(Box)(({ theme }) => {
  return {
    padding: "30px",
    textAlign: "center",
  };
});

type FinetuneKnowledgebaseSettingsProps = {
  onDeleteClick: (item: FinetuneKnowledgebaseTopic) => void;
  onItemClick: (item: FinetuneKnowledgebaseTopic) => void;
  onAddClick: () => void;
  odEditSettingsClick: () => void;
  finetuneKnowledgebase: FinetuneKnowledgebase;
};

const FinetuneKnowledgebaseSettings: React.FC<FinetuneKnowledgebaseSettingsProps> =
  (props) => {
    const {
      onAddClick,
      onItemClick,
      onDeleteClick,
      finetuneKnowledgebase,
      odEditSettingsClick,
    } = props;
    const { slug } = useParams<{ slug: string }>();

    const theme = useTheme();

    const { data: topics } = useListItems({
      modelName: ApiModels.FinetuneKnowledgebaseTopic,
      requestOptions: { query: { finetune_knowledgebase_id: slug } },
      queryOptions: { enabled: !!slug },
    });

    const { mutate: publish, isLoading } = useMutation({
      mutationFn: async ({ slug }: any) => {
        await FinetuneKnowledgebaseTopicModel.publish(slug);
      },
      onSuccess: (_) => {
        console.log("success");
      },
    });

    const publicHanlder = async () => {
      await publish({ slug });
    };
    return (
      <SidebarContainer>
        <SidebarSectionWrap
          title="Finetune Knowledgebase Topics"
          onRightIconClick={() => onAddClick()}
        >
          {topics?.map((topic) => {
            return (
              <ProfileCard
                options={{
                  draggable: false,
                  switcher: false,
                }}
                rightIcon={
                  <Stack direction="row" gap={0.75}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick(topic);
                      }}
                    >
                      <EditOutlined
                        sx={{
                          height: "auto",
                        }}
                      />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(topic);
                      }}
                    >
                      <DeleteOutline
                        sx={{
                          height: "auto",
                        }}
                      />
                    </IconButton>
                  </Stack>
                }
                title={topic.name}
                subTitle={topic.value}
                sx={{
                  background: theme.palette.background.GFRightNavForeground,
                  height: 48,
                  ".MuiTypography-subtitle1": {
                    margin: "0 0 2px",
                  },
                  ".DragHandle": {
                    lineHeight: "1",
                    width: "20px",
                    height: "20px",
                    margin: "0 6px 0 -6px",
                    color: theme.palette.background.GF20,

                    "&:hover": {
                      color: theme.palette.background.GF50,

                      path: {
                        fill: theme.palette.background.GF50,
                      },
                    },

                    path: {
                      fill: theme.palette.background.GF20,
                      transition: "all 0.4s ease",
                    },

                    svg: {
                      width: "100%",
                      height: "auto",
                      display: "block",
                    },
                  },

                  ".card-inner-content": {
                    gap: "2px",
                  },
                }}
                onClick={() => onItemClick(topic)}
              />
            );
          })}
        </SidebarSectionWrap>
        <SidebarSectionWrap title="General Settings" rightIcon={false}>
          <InfoListWrap
            description={finetuneKnowledgebase.description}
            headerRightIcon={
              <Box>
                <EditOutlined
                  onClick={() => odEditSettingsClick?.()}
                  sx={{ color: "grey.500" }}
                />
              </Box>
            }
            title={finetuneKnowledgebase.name}
            sx={{
              "&:hover": {
                background: theme.palette.background.GFRightNavForeground,
              },
            }}
          />
        </SidebarSectionWrap>
        <ButtonContainer>
          <LoadingButton
            variant="contained"
            onClick={publicHanlder}
            loading={isLoading}
          >
            Publish
          </LoadingButton>
        </ButtonContainer>
      </SidebarContainer>
    );
  };

type AddFinetuneKnowledgebaseTopicProps = {
  topic?: FinetuneKnowledgebaseTopic;
  onBackClick: () => void;
  onSubmitClick: (values: AddTopicFormType) => void;
};

const addTopicFormSchema = z.object({
  name: z.string(),
  value: z.string(),
  question: z.string(),
  answer: z.string(),
  description: z.string().optional(),
});

type AddTopicFormType = z.infer<typeof addTopicFormSchema>;

const AddFinetuneKnowledgebaseTopic: React.FC<AddFinetuneKnowledgebaseTopicProps> =
  (props) => {
    const { topic, onBackClick, onSubmitClick } = props;

    const {
      register,
      handleSubmit,
      formState: { errors, dirtyFields },
      reset,
    } = useForm<AddTopicFormType>({
      defaultValues: {
        name: "",
        value: "",
        description: "",
      },
      resolver: zodResolver(addTopicFormSchema),
    });

    useEffect(() => {
      if (topic) {
        reset(topic);
      }
    }, [topic]);

    const onSubmit = (values: AddTopicFormType) => {
      onSubmitClick(values);
    };

    return (
      <SidebarWrap>
        <SidebarSection
          title="Add Finetune Knowledgebase Topic"
          leftIcon={<ArrowBackOutlined />}
          onLeftIconClick={() => onBackClick?.()}
          rightIcon={false}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Name"
              error={!!dirtyFields.name ? errors.name : undefined}
            >
              <TextField
                {...register("name")}
                autoFocus
                margin="dense"
                id="name"
                type="text"
                hiddenLabel
                size="small"
                variant="filled"
                fullWidth
              />
            </FormField>

            <FormField
              label="Question"
              error={!!dirtyFields.question ? errors.question : undefined}
            >
              <TextField
                {...register("question")}
                margin="dense"
                id="question"
                type="text"
                hiddenLabel
                size="small"
                variant="filled"
                fullWidth
                multiline
                rows={3}
              />
            </FormField>
            <FormField
              label="Answer"
              error={!!dirtyFields.answer ? errors.answer : undefined}
            >
              <TextField
                {...register("answer")}
                margin="dense"
                id="answer"
                type="text"
                hiddenLabel
                size="small"
                variant="filled"
                fullWidth
                multiline
                rows={3}
              />
            </FormField>
            <FormField
              label="Description"
              error={!!dirtyFields.description ? errors.description : undefined}
            >
              <TextField
                {...register("description")}
                autoFocus
                margin="dense"
                id="description"
                type="text"
                hiddenLabel
                size="small"
                variant="filled"
                fullWidth
                multiline
                rows={3}
              />
            </FormField>
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
                type="submit"
              >
                Save
              </Button>
            </CardActions>
          </form>
        </SidebarSection>
      </SidebarWrap>
    );
  };

type FinetuneKnowledgebaseSettingsFormProps = {
  finetuneKnowledgebase?: FinetuneKnowledgebase;
  onBackClick: () => void;
  onSubmitClick: (values: VKFormType) => void;
};

const vkFormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

type VKFormType = z.infer<typeof vkFormSchema>;

const FinetuneKnowledgebaseSettingsForm: React.FC<FinetuneKnowledgebaseSettingsFormProps> =
  (props) => {
    const { finetuneKnowledgebase, onBackClick, onSubmitClick } = props;

    const {
      register,
      handleSubmit,
      formState: { errors, dirtyFields },
      reset,
    } = useForm<VKFormType>({
      defaultValues: {
        name: "",
        description: "",
      },
      resolver: zodResolver(vkFormSchema),
    });

    useEffect(() => {
      if (finetuneKnowledgebase) {
        reset(finetuneKnowledgebase);
      }
    }, [finetuneKnowledgebase]);

    const onSubmit = (value: VKFormType) => {
      onSubmitClick(value);
    };

    return (
      <SidebarWrap>
        <SidebarSection
          title="Add Finetune Knowledgebase Topic"
          leftIcon={<ArrowBackOutlined />}
          onLeftIconClick={() => onBackClick?.()}
          rightIcon={false}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Name"
              error={!!dirtyFields.name ? errors.name : undefined}
            >
              <TextField
                {...register("name")}
                autoFocus
                margin="dense"
                id="name"
                type="text"
                hiddenLabel
                size="small"
                variant="filled"
                fullWidth
              />
            </FormField>
            <FormField
              label="Description"
              error={!!dirtyFields.description ? errors.description : undefined}
            >
              <TextField
                {...register("description")}
                autoFocus
                margin="dense"
                id="description"
                type="text"
                hiddenLabel
                size="small"
                variant="filled"
                fullWidth
                multiline
                rows={3}
              />
            </FormField>
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
                type="submit"
              >
                Save
              </Button>
            </CardActions>
          </form>
        </SidebarSection>
      </SidebarWrap>
    );
  };

type RightSidebarProps = {
  finetuneKnowledgebase: FinetuneKnowledgebase;
};

const RightSidebar: React.FC<RightSidebarProps> = (props) => {
  const { finetuneKnowledgebase } = props;

  const { slug } = useParams<{ slug: string }>();

  const [selectedTopic, setSelectedTopic] =
    useState<FinetuneKnowledgebaseTopic>();

  const { mutate: updateTopic } = useUpdateItem({
    modelName: ApiModels.FinetuneKnowledgebaseTopic,
    requestOptions: { query: { finetune_knowledgebase_id: slug } },
  });

  const { mutate: createTopic } = useCreateItem({
    modelName: ApiModels.FinetuneKnowledgebaseTopic,
    requestOptions: { query: { finetune_knowledgebase_id: slug } },
  });

  const { mutate: deleteTopic } = useDeleteItem({
    modelName: ApiModels.FinetuneKnowledgebaseTopic,
    requestOptions: { query: { finetune_knowledgebase_id: slug } },
  });

  const { mutate: updateFinetuneKnowledgebase } = useUpdateItem({
    modelName: ApiModels.FinetuneKnowledgebase,
  });

  const handleSubmit = React.useCallback(
    (topic: AddTopicFormType, goBack: () => void) => {
      if (selectedTopic) {
        updateTopic({ slug: selectedTopic.slug, data: topic });
        goBack();
        setSelectedTopic(undefined);
      } else {
        createTopic(topic);
        goBack();
      }
    },
    [selectedTopic, slug]
  );

  const handleDeleteTopic = React.useCallback(
    (topic: FinetuneKnowledgebaseTopic) => {
      deleteTopic({ slug: topic.slug });
    },
    []
  );

  const handleSettingsSubmit = React.useCallback(
    (values: VKFormType, goBack: () => void) => {
      updateFinetuneKnowledgebase({
        slug: finetuneKnowledgebase.slug,
        data: values,
      });

      goBack();
    },
    []
  );

  const getComponents: Config["getComponents"] = React.useCallback(
    (gotoComponent, goBack) => {
      return {
        main: (
          <FinetuneKnowledgebaseSettings
            onAddClick={() =>
              gotoComponent({ id: "add-topic", name: "add-topic" })
            }
            onItemClick={(topic) => {
              setSelectedTopic(topic);
              gotoComponent({ id: topic.slug, name: "add-topic" });
            }}
            onDeleteClick={handleDeleteTopic}
            finetuneKnowledgebase={finetuneKnowledgebase}
            odEditSettingsClick={() => {
              gotoComponent({ id: "settings-form", name: "settings-form" });
            }}
          />
        ),
        "add-topic": (
          <AddFinetuneKnowledgebaseTopic
            onBackClick={() => {
              goBack();
              setSelectedTopic(undefined);
            }}
            onSubmitClick={(values) => handleSubmit(values, goBack)}
            topic={selectedTopic}
          />
        ),
        "settings-form": (
          <FinetuneKnowledgebaseSettingsForm
            finetuneKnowledgebase={finetuneKnowledgebase}
            onBackClick={goBack}
            onSubmitClick={(values) => handleSettingsSubmit(values, goBack)}
          />
        ),
      };
    },
    [
      handleDeleteTopic,
      handleSettingsSubmit,
      handleSubmit,
      selectedTopic,
      finetuneKnowledgebase,
    ]
  );

  return (
    <AnimationLayout
      config={{
        getComponents,
        initialComponent: getSearchParams().get("s_name") || "main",
      }}
      urlQueryKey="s"
    />
  );
};

export default RightSidebar;
