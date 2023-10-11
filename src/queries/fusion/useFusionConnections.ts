import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import FusionModel from "models/Fusion";

const fetchFusionConnections = async (context: QueryFunctionContext) => {
  const [, fusionSlug, appSlug] = context.queryKey;
  const res = await FusionModel.getConnections(
    fusionSlug as string,
    appSlug as string
  );
  return res.data;
};

const useFusionConnections = (fusionSlug?: string, appSlug?: string) => {
  return useQuery(
    ["fusion-connections", fusionSlug, appSlug],
    fetchFusionConnections,
    {
      enabled: !!fusionSlug && !!appSlug,
    }
  );
};

export default useFusionConnections;
