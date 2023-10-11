import { Box, Stack, styled, Typography, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { DynamicFieldProps } from "components/Form/DynamicEditFields";
import DynamicEditForm, {
  FormRefAttribute,
} from "components/Form/DynamicEditForm";
import Scrollbar from "components/Scrollbar";
import { DocumentElementType } from "enums/Form";
import { FusionType } from "enums/Fusion";
import useAppNavigate from "hooks/useAppNavigate";
import InnerPageLayout from "layouts/inner-app-layout";
import { isEmpty } from "lodash";
import { ApiModels } from "queries/apiModelMapping";
import useFusion from "queries/fusion/useFusion";
import useListItems from "queries/useListItems";
import useUpdateItem from "queries/useUpdateItem";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { useSystemLayoutStore } from "store/stores/systemLayout";
import AddFusionModal from "./AddFusionModal";
import FusionRightBar from "./FusionRightBar";

const FusionEditFields: DynamicFieldProps[] = [
  {
    label: "Basic Settings",
    name: "label",
    type: DocumentElementType.Label,
  },
  {
    label: "Fusion Title",
    name: "fusion_title",
    type: DocumentElementType.TextField,
    required: true,
  },
  {
    label: "Fusion Slug",
    name: "fusion_slug",
    type: DocumentElementType.TextField,
    required: true,
  },
  {
    label: "Fusion Description",
    name: "fusion_description",
    type: DocumentElementType.TextArea,
  },
  {
    label: "Fusion Icon",
    name: "fusion_icon",
    type: "icon",
    compact: true,
  },
];

const CenterBox = styled(Box)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minWidth: "0",
  height: "calc(100vh - 60px)",
}));

const RightSideBox = styled(Box)(({ theme }) => ({
  width: "420px",
  height: "calc(100vh - 60px)",
}));

const TabStyle = ({ title }: { title: string }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1}>
      <Typography className="tab-text" sx={{ color: "#fff" }}>
        {title}
      </Typography>
      <Typography
        sx={{ color: theme.palette.background.GF40 }}
        className="counter"
      >
        4
      </Typography>
    </Stack>
  );
};

type Props = {
  type?: "skill_design" | "fusion";
};

const AddModal: React.FC<Props> = (props) => {
  const { type } = props;

  const [addModalOpen, setAddModalOpen] = useState(false);
  useSystemLayoutStore.useSetButtonProps()({
    onClick: () => setAddModalOpen(true),
  });

  return (
    <AddFusionModal
      open={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      type={type}
    />
  );
};

const Fusions: React.FC<Props> = (props) => {
  const { type = "fusion" } = props;

  const { fusionSlug } = useParams<{ fusionSlug: string }>();
  const { data: fusions = [] } = useListItems({
    modelName: ApiModels.Fusion,
    requestOptions: { query: { type } },
    queryKey: [ApiModels.Fusion, type],
  });
  const { data: fusion } = useFusion(fusionSlug);
  const { mutate: updateFusion } = useUpdateItem({
    modelName: ApiModels.Fusion,
  });

  const setMenu = useSystemLayoutStore.useSetMenu();
  const menuItemProps = useSystemLayoutStore.useSetItemProps();
  const setFusionDraft = useFusionFlowStore.useSetFusionDraft();
  const fusionDraft = useFusionFlowStore.useFusionDraft();

  const formRef = useRef<FormRefAttribute | undefined>();

  const queryClient = useQueryClient();
  const appNavigate = useAppNavigate();
  const [searchParams] = useSearchParams();

  const [value, setValue] = useState(Number(searchParams.get("t")) || 0);

  useEffect(() => {
    if (fusions) {
      setMenu(
        fusions.map((fusion) => ({
          title: fusion.fusion_title,
          key: fusion.fusion_slug,
          icon: fusion.fusion_icon,
        }))
      );
    }
  }, [fusions]);

  useEffect(() => {
    menuItemProps({
      onClick: (item) => {
        const data = queryClient.getQueryData<Fusion[]>([
          ApiModels.Fusion,
          type,
        ]);
        const fusionItem = data?.find((d) => d.fusion_slug === item.key);
        if (fusionItem) {
          queryClient.setQueryData([ApiModels.Fusion, item.key], fusionItem);

          appNavigate(
            `/${type === "fusion" ? "fusion" : "skill-design-module"}/${
              fusionItem.slug
            }?t=0`
          );
        }
      },
      isActive: (item) => item.key === fusionSlug,
    });
  }, [fusionSlug, type]);

  useEffect(() => {
    if (!isEmpty(fusion)) {
      formRef.current?.reset({
        fusion_slug: fusion.fusion_slug,
        fusion_title: fusion.fusion_title,
        fusion_description: fusion.fusion_description,
        fusion_icon: fusion.fusion_icon,
      });
      setFusionDraft(fusion);
    }
  }, [fusion]);

  const tabList = useMemo(() => {
    const tabs = [
      {
        label: <TabStyle title="Fusions" />,
      },
    ];
    return tabs;
  }, []);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    setValue(newValue);
  };

  const editFields = useMemo(() => {
    if (fusionDraft?.fusion_type === FusionType.Skills) {
      return [
        ...FusionEditFields,
        {
          label: "Skill Description",
          name: "skill_description",
          type: DocumentElementType.TextArea,
          required: true,
        },
      ];
    }

    return FusionEditFields;
  }, [fusionDraft?.fusion_type]);

  return (
    <Box>
      {fusionDraft && (
        <Stack direction="row">
          <CenterBox>
            <Scrollbar>
              <Box>
                <InnerPageLayout
                  title={fusionDraft?.fusion_title}
                  subtitle={
                    fusionDraft?.fusion_description ? (
                      <Typography variant="body1" color="text.secondary">
                        Description:{" "}
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color="text.primary"
                        >
                          <>{fusionDraft?.fusion_description}</>
                        </Typography>
                      </Typography>
                    ) : (
                      <></>
                    )
                  }
                  tabList={tabList}
                  onChange={handleChange}
                  value={value}
                >
                  {value === 0 && (
                    <>
                      <DynamicEditForm
                        name="fields"
                        fields={editFields}
                        ref={formRef}
                        defaultValues={fusionDraft}
                        onSubmit={(data) => {
                          if (fusion) {
                            updateFusion({
                              data: {
                                ...data,
                                fusion_icon: data.fusion_icon ?? null,
                              },
                              slug: fusionSlug!,
                            });
                          }
                        }}
                      />
                    </>
                  )}
                </InnerPageLayout>
              </Box>
            </Scrollbar>
          </CenterBox>
          <RightSideBox
            sx={{
              background: (theme) =>
                theme.palette.background.GFRightNavBackground,
            }}
          >
            <FusionRightBar />
          </RightSideBox>
        </Stack>
      )}
      <AddModal type={type} />
    </Box>
  );
};

export default Fusions;
