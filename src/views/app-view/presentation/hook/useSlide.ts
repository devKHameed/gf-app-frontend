import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import useDeleteItem from "queries/useDeleteItem";
import { StageDataListItem } from "store/stores/presentation/StageDataList";
import useLocalStorage from "./useLocalStorage";
import useSelection from "./useSelection";
import useStageDataList from "./useStageDataList";
import useTransformer from "./useTransformer";

export const TAB_ID = "tabId";

const useSlide = (transformer: ReturnType<typeof useTransformer>) => {
  const [slideList, setSlideList] = useState<any[]>([]);
  const { slug } = useParams();

  const {
    createFileData,
    removeFileData,
    changeStageData,
    stageDataList,
    setActiveSlide,
    activeSlide,
    onCreateOrUpdateSlidePreview,
    initializeFileDataList,
  } = useStageDataList();
  const { mutate: createSlide } = useCreateItem({
    modelName: ApiModels.PresentationSlide,
    requestOptions: {
      query: {
        presentation_id: slug,
      },
    },
  });
  const { mutate: deleteSlide } = useDeleteItem({
    modelName: ApiModels.PresentationSlide,
    requestOptions: {
      query: {
        presentation_id: slug,
      },
    },
  });
  const { clearSelection } = useSelection(transformer);
  const { setValue } = useLocalStorage();

  const onClickSlide = (slideId: string) => {
    clearSelection();

    changeStageData(activeSlide!, slideId!);
    setActiveSlide(slideId);
  };

  const moveSlide = (tabId: string, fileItem?: StageDataListItem) => {
    const prevFileId = slideList.find((tab) => tab.active)?.id;
    clearSelection();

    changeStageData(prevFileId!, tabId!, fileItem?.slide_design ?? undefined);
    setSlideList((prev) =>
      prev.map((file) => ({
        id: file.id,
        active: tabId === file.id,
      }))
    );
    setValue(TAB_ID, { id: tabId });
  };

  const onCreateSlide = (
    e?: React.SyntheticEvent,
    fileItem?: StageDataListItem
  ) => {
    const length = stageDataList?.stageIds?.length || 0;
    const id = stageDataList?.stageIds?.[length - 1]?.id || "";
    createSlide(
      {
        sort_number: (stageDataList?.stageList[id]?.sort_number || 0) + 1,
        title: `new Slide ${
          (stageDataList?.stageList[id]?.sort_number || 0) + 1
        }`,
      },
      {
        onSuccess(data, variables, context) {
          console.log({ data });
          clearSelection();
          createFileData(
            fileItem ?? {
              ...data,
              // id: data.slug,
              slide_design: [],
              thumbnail: transformer.transformerRef?.current
                ?.getStage()
                ?.toDataURL(),
            }
          );
          setActiveSlide(data.slug);
          // changeStageData(prevTabId ?? newTabId, newTabId);
          changeStageData(activeSlide, data.slug);
        },
      }
    );
  };

  const onDeleteSlide = (tabId: string) => {
    if (stageDataList?.stageIds?.length <= 1) {
      return;
    }
    const activeSlideIds = [...(stageDataList?.stageIds || [])];
    const currentTab = stageDataList?.activeSlide;
    const tabIndex = activeSlideIds.findIndex((tab) => tab.id === tabId);
    const nextTabId =
      activeSlideIds[tabIndex].id === currentTab
        ? activeSlideIds[tabIndex === 0 ? tabIndex + 1 : tabIndex - 1].id
        : currentTab;
    deleteSlide(
      {
        slug: currentTab as string,
      },
      {}
    );
    clearSelection();
    removeFileData(tabId);
    // changeStageData(nextTabId, nextTabId);
    setActiveSlide(nextTabId);
  };
  const slidePreview = (id: string) => {
    onCreateOrUpdateSlidePreview({
      slug: id,
      thumbnail: transformer.transformerRef?.current?.getStage()?.toDataURL(),
    });
  };
  return {
    slideList,
    onClickSlide,
    onCreateSlide,
    onDeleteSlide,
    moveSlide,
    activeSlide,
    slidePreview,
    initializeFileDataList,
  };
};

export default useSlide;
