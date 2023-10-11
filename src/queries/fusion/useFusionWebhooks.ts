import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import FusionModel from "models/Fusion";

const fetchFusionWebhooks = async (context: QueryFunctionContext) => {
  const [, moduleSlug, userSlug] = context.queryKey;
  const res = await FusionModel.getWebhooks(
    moduleSlug as string,
    userSlug as string
  );
  return res.data;
};

const useFusionWebhooks = (moduleSlug?: string, userSlug?: string) => {
  return useQuery(
    ["fusion-webhooks", moduleSlug, userSlug],
    fetchFusionWebhooks,
    {
      enabled: !!moduleSlug && !!userSlug,
    }
  );
};

export default useFusionWebhooks;
