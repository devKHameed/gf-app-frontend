import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";

const useFusion = (fusionSlug?: string) => {
  return useGetItem({
    modelName: ApiModels.Fusion,
    slug: fusionSlug,
  });
};

export default useFusion;
