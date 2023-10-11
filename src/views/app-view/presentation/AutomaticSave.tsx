import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import usePresentation from "hooks/usePresentation";
import { ApiModels } from "queries/apiModelMapping";
import useUpdateItem from "queries/useUpdateItem";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStageStore } from "store/stores/presentation/StageDataList";
import useSlide from "./hook/useSlide";

type Props = {};
const useStgStore = createSelectorFunctions(useStageStore);
const AutomaticSave = (props: Props) => {
  const transformer = usePresentation().transformer;
  const { activeSlide } = useSlide(transformer);
  const { slug } = useParams();
  const { mutate: updateSlide, isLoading } = useUpdateItem({
    modelName: ApiModels.PresentationSlide,
    queryKey: [activeSlide],
    mutationOptions: {
      onSuccess: (_, { slug, data }) => {},
    },
    requestOptions: {
      query: {
        presentation_id: slug,
      },
    },
  });
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const stageStore = useStgStore();
  const handleDataMapping = () => {
    const stageActiveSlideData =
      stageStore.stageList?.[activeSlide]?.slide_design;
    const slideData: Partial<PresentationSlide> = {
      ...stageStore.stageList?.[activeSlide],
    };
    const slideDataa: any = [];
    stageActiveSlideData.forEach((d) => {
      const { attrs, ...rest } = d;
      const { image, filters, ...restattrs } = attrs;

      slideDataa.push({
        attrs: restattrs,
        ...rest,
      });
    });
    return { ...slideData, slide_design: slideDataa, sort_order: activeIndex };
  };
  useEffect(() => {
    if (activeSlide && slug) {
      const index = stageStore.stageIds.findIndex(
        (ac) => ac.id === activeSlide
      );
      if (index >= -1) {
        setActiveIndex(index);
      }
    }
    return () => {};
  }, [activeSlide, stageStore?.stageIds, slug]);

  useEffect(() => {
    const isExist = stageStore.stageList?.[activeSlide]?.slide_design;
    if (isExist && slug) {
      const slideData = handleDataMapping();
      const { id, slug, ...rest } = slideData;
      updateSlide({
        data: rest,
        slug: slug as string,
      });
    }
  }, [stageStore.stageList?.[activeSlide]?.slide_design, slug]);

  return null;
};

export default AutomaticSave;
