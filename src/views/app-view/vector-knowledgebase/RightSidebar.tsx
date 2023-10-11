import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowBackOutlined,
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";
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
import FormField from "components/FormField";
import SidebarSection from "components/RightSidebar";
import AnimationLayout, { Config } from "layouts/AnimationLayout";
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

type VectorKnowledgebaseSettingsProps = {
  onDeleteClick: (item: VectorKnowledgebaseTopic) => void;
  onItemClick: (item: VectorKnowledgebaseTopic) => void;
  onAddClick: () => void;
  odEditSettingsClick: () => void;
  vectorKnowledgebase: VectorKnowledgebase;
};

const VectorKnowledgebaseSettings: React.FC<VectorKnowledgebaseSettingsProps> =
  (props) => {
    const {
      onAddClick,
      onItemClick,
      onDeleteClick,
      vectorKnowledgebase,
      odEditSettingsClick,
    } = props;
    const { slug } = useParams<{ slug: string }>();

    const theme = useTheme();

    const { data: topics } = useListItems({
      modelName: ApiModels.VectorKnowledgebaseTopic,
      requestOptions: { query: { vector_knowledgebase_id: slug } },
      queryOptions: { enabled: !!slug },
    });

    return (
      <SidebarContainer>
        <SidebarSectionWrap
          title="Vector Knowledgebase Topics"
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
            description={vectorKnowledgebase.description}
            headerRightIcon={
              <Box>
                <EditOutlined
                  onClick={() => odEditSettingsClick?.()}
                  sx={{ color: "grey.500" }}
                />
              </Box>
            }
            title={vectorKnowledgebase.name}
            sx={{
              "&:hover": {
                background: theme.palette.background.GFRightNavForeground,
              },
            }}
          />
        </SidebarSectionWrap>
      </SidebarContainer>
    );
  };

type AddVectorKnowledgebaseTopicProps = {
  topic?: VectorKnowledgebaseTopic;
  onBackClick: () => void;
  onSubmitClick: (values: AddTopicFormType) => void;
};

const addTopicFormSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
});

type AddTopicFormType = z.infer<typeof addTopicFormSchema>;

const AddVectorKnowledgebaseTopic: React.FC<AddVectorKnowledgebaseTopicProps> =
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
          title="Add Vector Knowledgebase Topic"
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
              label="Value"
              error={!!dirtyFields.value ? errors.value : undefined}
            >
              <TextField
                {...register("value")}
                autoFocus
                margin="dense"
                id="value"
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

type VectorKnowledgebaseSettingsFormProps = {
  vectorKnowledgebase?: VectorKnowledgebase;
  onBackClick: () => void;
  onSubmitClick: (values: VKFormType) => void;
};

const vkFormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

type VKFormType = z.infer<typeof vkFormSchema>;

const VectorKnowledgebaseSettingsForm: React.FC<VectorKnowledgebaseSettingsFormProps> =
  (props) => {
    const { vectorKnowledgebase, onBackClick, onSubmitClick } = props;

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
      if (vectorKnowledgebase) {
        reset(vectorKnowledgebase);
      }
    }, [vectorKnowledgebase]);

    const onSubmit = (value: VKFormType) => {
      onSubmitClick(value);
    };

    return (
      <SidebarWrap>
        <SidebarSection
          title="Add Vector Knowledgebase Topic"
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
  vectorKnowledgebase: VectorKnowledgebase;
};

const RightSidebar: React.FC<RightSidebarProps> = (props) => {
  const { vectorKnowledgebase } = props;

  const { slug } = useParams<{ slug: string }>();

  const [selectedTopic, setSelectedTopic] =
    useState<VectorKnowledgebaseTopic>();

  const { mutate: updateTopic } = useUpdateItem({
    modelName: ApiModels.VectorKnowledgebaseTopic,
    requestOptions: { query: { vector_knowledgebase_id: slug } },
  });

  const { mutate: createTopic } = useCreateItem({
    modelName: ApiModels.VectorKnowledgebaseTopic,
    requestOptions: { query: { vector_knowledgebase_id: slug } },
  });

  const { mutate: deleteTopic } = useDeleteItem({
    modelName: ApiModels.VectorKnowledgebaseTopic,
    requestOptions: { query: { vector_knowledgebase_id: slug } },
  });

  const { mutate: updateVectorKnowledgebase } = useUpdateItem({
    modelName: ApiModels.VectorKnowledgebase,
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
    (topic: VectorKnowledgebaseTopic) => {
      deleteTopic({ slug: topic.slug });
    },
    []
  );

  const handleSettingsSubmit = React.useCallback(
    (values: VKFormType, goBack: () => void) => {
      updateVectorKnowledgebase({
        slug: vectorKnowledgebase.slug,
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
          <VectorKnowledgebaseSettings
            onAddClick={() =>
              gotoComponent({ id: "add-topic", name: "add-topic" })
            }
            onItemClick={(topic) => {
              setSelectedTopic(topic);
              gotoComponent({ id: topic.slug, name: "add-topic" });
            }}
            onDeleteClick={handleDeleteTopic}
            vectorKnowledgebase={vectorKnowledgebase}
            odEditSettingsClick={() => {
              gotoComponent({ id: "settings-form", name: "settings-form" });
            }}
          />
        ),
        "add-topic": (
          <AddVectorKnowledgebaseTopic
            onBackClick={() => {
              goBack();
              setSelectedTopic(undefined);
            }}
            onSubmitClick={(values) => handleSubmit(values, goBack)}
            topic={selectedTopic}
          />
        ),
        "settings-form": (
          <VectorKnowledgebaseSettingsForm
            vectorKnowledgebase={vectorKnowledgebase}
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
      vectorKnowledgebase,
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
