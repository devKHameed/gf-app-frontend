import { useState } from "react";
import { useParams } from "react-router-dom";

import { StageDataListItem } from "store/stores/presentation/StageDataList";
import { v4 } from "uuid";
import transcript from "../data/Transcript.json";
import useStageDataList from "./useStageDataList";
export const TAB_ID = "tabId";

const useSlide = () => {
  const [slideList, setSlideList] = useState<any[]>([]);
  const { slug } = useParams();

  const { createFileData, setActiveSlide, initializeFileDataList } =
    useStageDataList();

  const onClickSlide = (slideId: string) => {
    setActiveSlide(slideId);
  };

  const onCreateSlide = (fileItem?: StageDataListItem) => {
    const accountId = v4() || "";
    createFileData([accountId]);
  };
  const onInitializeSlide = (fileItem?: StageDataListItem[]) => {
    // const id = v4() || "";
    initializeFileDataList([transcript as unknown as TranscriptionsData]);
  };

  return {
    slideList,
    onClickSlide,
    onInitializeSlide,
    onCreateSlide,
  };
};

export default useSlide;
