import Konva from "konva";

import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import {
  StageDataItem,
  StageDataListItem,
  useStageStore,
} from "store/stores/presentation/StageDataList";

export type TAB_CONTEXT = {
  selectedFileId: Konva.Node[];
  onCreate: (newFile: StageDataListItem) => void;
  onDelete: (targetFileId: StageDataListItem["id"]) => void;
  onUpdate: (StageDataListItem: StageDataListItem) => void;
};

export const STAGE_DATA_LIST_KEY = "koditorStageDataList";
const useStageS = createSelectorFunctions(useStageStore);
const useStageDataList = () => {
  const stageDataList = useStageS();

  const initializeFileDataList = (dataList: StageDataListItem[]) => {
    stageDataList.initialize(dataList);
    const lastFile = dataList[dataList.length - 1] ?? null;
    if (lastFile) {
      // changeStageData(lastFile.id, lastFile.id, lastFile.data);
    }
  };

  const createFileData = (newFile: StageDataListItem) => {
    stageDataList.addItem(newFile);
  };

  const updateFileData = (fileItem: StageDataListItem) => {
    stageDataList.updateItem(fileItem);
  };

  const removeFileData = (targetFileId: StageDataListItem["id"]) => {
    stageDataList.removeItem(targetFileId as string);
  };
  const onCreateOrUpdateSlidePreview = (
    targetData: Pick<StageDataListItem, "slug" | "thumbnail">
  ) => {
    stageDataList.updateOrCreatePreview(targetData);
  };
  const setActiveSlide = (slideId: string) => {
    stageDataList.setActiveSlide(slideId);
  };
  const resetStageData = () => {
    stageDataList.clearItems();
  };

  const changeStageData = (
    prevFileId: string,
    nextFileId: string,
    targetStageData?: StageDataItem[]
  ) => {
    if (prevFileId && prevFileId !== nextFileId) {
      updateFileData({
        slug: prevFileId,
        slide_design:
          stageDataList.stageList?.[stageDataList.activeSlide]?.slide_design ||
          [],
      });
    }
    // clearCanvasItems();

    // const newStageData = stageDataList.stageList[nextFileId]?.data;
    // if (targetStageData || newStageData) {
    //   alterCanvasItems((targetStageData ?? newStageData)!);
    // }
  };

  return {
    stageDataList,
    initializeFileDataList,
    createFileData,
    updateFileData,
    removeFileData,
    changeStageData,
    setActiveSlide,
    activeSlide: stageDataList.activeSlide,
    onCreateOrUpdateSlidePreview,
    resetStageData,
  };
};

export default useStageDataList;
