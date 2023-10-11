import { useQuery } from "@tanstack/react-query";
import { SYSTEM_NODE_APP } from "constants/Fusion";
import ThreePAppWebhook from "models/ThreePAppWebhook";

const useListAppWebhooks = (app: string, query?: Record<string, string>) => {
  return useQuery({
    queryKey: ["webhooks", app],
    queryFn: async () => {
      const res = await ThreePAppWebhook.list(app, query);
      return res.data;
    },
    enabled: !!app && app !== SYSTEM_NODE_APP,
  });
};

export default useListAppWebhooks;
