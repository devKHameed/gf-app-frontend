import { useCallback, useEffect } from "react";

import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import {
  StageDataItem,
  useStageStore,
} from "store/stores/presentation/StageDataList";
import { useWorkHistoryStore } from "store/stores/presentation/workhistory";
import useItem from "./useItem";
const useStageStoree = createSelectorFunctions(useStageStore);
const useStore = createSelectorFunctions(useWorkHistoryStore);
const useWorkHistory = () =>
  // past: StageDataItem[][],
  // future: StageDataItem[][],
  // setPast: React.Dispatch<React.SetStateAction<StageDataItem[][]>>,
  // setFuture: React.Dispatch<React.SetStateAction<StageDataItem[][]>>
  {
    const { alterCanvasItems } = useItem();
    // const [current, setCurrent] = useState<StageDataItem[] | null>(null);
    const store = useStore();
    const updateCanvasItemsFutrueHistory = store.updateCanvasItemsFutrueHistory;
    const stagStore = useStageStoree();
    const clearActiveSlideHistory = store.clearActiveSlideHistory;
    const setCurrent = store.addCurrent;
    const updateCanvasItemsPastHistory = store.updateCanvasItemsPastHistory;
    const setAllowWorkHistory = store.setAllowWorkHistory;
    const activeSlide = stagStore.activeSlide;
    const future = store.history?.[activeSlide]?.future || [];
    const pastSteps = store.history?.[activeSlide]?.past || [];
    const current = store.current;
    const currentSlideId = store.slideId;
    const allowWorkhistory = store.allowPastHistory;
    useEffect(() => {
      if (activeSlide !== currentSlideId) {
        store.setSlideId(activeSlide);
      }
    }, [activeSlide]);
    const goToPast = useCallback(() => {
      if (pastSteps.length > 0 && current) {
        setAllowWorkHistory(false);
        const newFuture = [...current];
        const newStageData = [...(pastSteps[pastSteps.length - 1] || [])];
        updateCanvasItemsPastHistory([
          ...pastSteps.slice(0, pastSteps.length - 1),
        ]);
        const items = [...future, newFuture];

        updateCanvasItemsFutrueHistory(items);

        setCurrent(newStageData);
        setAllowWorkHistory(true);
        alterCanvasItems(newStageData);
      }
    }, [pastSteps, current, alterCanvasItems, currentSlideId]);
    const goToFuture = useCallback(() => {
      if (future.length > 0 && current) {
        setAllowWorkHistory(false);
        const newPast = [...current];
        const newStageData = future[future.length - 1];
        updateCanvasItemsPastHistory([...(pastSteps || []), newPast]);
        updateCanvasItemsFutrueHistory([
          ...(future.slice(0, future.length - 1) || []),
        ]);
        // setCurrent(newStageData);
        setAllowWorkHistory(true);
        setCurrent(newStageData);
        alterCanvasItems(newStageData);
      }
    }, [future, current, alterCanvasItems, currentSlideId]);

    const recordPast = useCallback(
      (newCurrent: StageDataItem[]) => {
        if (allowWorkhistory && activeSlide === currentSlideId) {
          if (newCurrent.length !== 0 && current !== null) {
            if (
              // current === null &&
              JSON.stringify(newCurrent) !== JSON.stringify(current)
            ) {
              updateCanvasItemsPastHistory([...(pastSteps || []), current]);
            }
          }
          if (newCurrent.length !== 0) {
            setCurrent(newCurrent);
          }
        }
      },
      [pastSteps, current, currentSlideId]
    );

    const clearHistory = () => {
      clearActiveSlideHistory();
    };

    return {
      goToPast,
      goToFuture,
      recordPast,
      clearHistory,

      current,
    };
  };

export default useWorkHistory;
