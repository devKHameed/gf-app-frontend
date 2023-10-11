// provider === component
import { ApiModels } from "queries/apiModelMapping";
import useListItems from "queries/useListItems";
import { createContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { StageDataListItem } from "store/stores/presentation/StageDataList";
import useSlide from "views/app-view/presentation/hook/useSlide";
import useStage from "views/app-view/presentation/hook/useStage";
import useStageDataList from "views/app-view/presentation/hook/useStageDataList";
import useTransformer from "views/app-view/presentation/hook/useTransformer";
export type PresentationContextType = {
  stage: ReturnType<typeof useStage>;
  transformer: ReturnType<typeof useTransformer>;
  slug: string;
};

const PresentationContext = createContext<Partial<PresentationContextType>>({});

const PresentationProvider = ({ children }: any) => {
  const stage = useStage();
  const transformer = useTransformer();

  const { slug } = useParams();

  const { onCreateSlide, initializeFileDataList } = useSlide(transformer);
  const { resetStageData } = useStageDataList();

  const {
    data: slides,
    error,
    isLoading,
  } = useListItems({
    modelName: ApiModels.PresentationSlide,
    queryKey: [slug],
    queryOptions: {
      cacheTime: 0,
    },
    requestOptions: {
      query: {
        presentation_id: slug,
      },
    },
  });

  useEffect(() => {
    if (!isLoading && !slides?.length) {
      onCreateSlide(undefined, undefined as any);
    } else if (!isLoading && slides?.length) {
      initializeFileDataList(slides as StageDataListItem[]);
    }
  }, [isLoading]);
  if (isLoading) {
    return <>Loading...</>;
  }
  if (!!error) {
    return <>Error Fetching Slide Data!</>;
  }

  return (
    <PresentationContext.Provider
      value={{
        stage: stage,
        transformer: transformer,
        slug,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
};

export { PresentationContext };

export default PresentationProvider;
