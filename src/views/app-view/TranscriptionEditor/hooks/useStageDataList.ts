import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import { useStageStore } from "store/stores/transcription/StageDataList";

export const STAGE_DATA_LIST_KEY = "koditorStageDataList";
const useStageS = createSelectorFunctions(useStageStore);
const useStageDataList = () => {
  const stageDataList = useStageS();

  const initializeFileDataList = (dataList: TranscriptionsData[]) => {
    stageDataList.initialize(dataList);
  };
  const createFileData = (newFile: string[]) => {
    stageDataList.addItem(newFile);
  };

  const updateFileData = (fileItem: string | string[]) => {
    stageDataList.updateItem(fileItem);
  };

  const removeFileData = (targetFileId: string) => {
    stageDataList.removeItem(targetFileId as string);
  };
  const setActiveSlide = (slideId: string) => {
    stageDataList.setActiveSlide(slideId);
  };
  const resetStageData = () => {
    stageDataList.clearItems();
  };

  return {
    createFileData,
    updateFileData,
    removeFileData,
    setActiveSlide,
    resetStageData,
    initializeFileDataList,
  };
};

export default useStageDataList;
