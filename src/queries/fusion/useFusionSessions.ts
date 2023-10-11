import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import FusionModel from "models/Fusion";

const fetchFusionSessions = async (context: QueryFunctionContext) => {
  const [, fusionSlug] = context.queryKey;
  const res = await FusionModel.getSessions(fusionSlug as string);
  return res.data;
};

const useFusionSessions = (fusionSlug?: string) => {
  return useQuery(["fusion-sessions", fusionSlug], fetchFusionSessions, {
    enabled: !!fusionSlug,
  });
};

export default useFusionSessions;
