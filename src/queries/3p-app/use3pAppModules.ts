import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import ThreePAppAction from "models/ThreePAppAction";

const fetchAppModules = async (context: QueryFunctionContext) => {
  const [_, app, appId] = context.queryKey as [string, string, string];
  const res = await ThreePAppAction.list(app as string, {
    is_global: appId.startsWith("3p:global"),
  });
  return res.data;
};

const use3pAppModules = (appSlug?: string, appId?: string) => {
  return useQuery(["3p-app-action", appSlug, appId], fetchAppModules, {
    enabled: !!appSlug,
  });
};

export default use3pAppModules;
