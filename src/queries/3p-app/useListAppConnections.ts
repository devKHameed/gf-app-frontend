import { useQuery } from "@tanstack/react-query";
import { SYSTEM_NODE_APP } from "constants/Fusion";
import ThreePAppConnection from "models/ThreePAppConnection";

const useListAppConnections = (app: string, query?: Record<string, string>) => {
  return useQuery({
    queryKey: ["connections", app],
    queryFn: async () => {
      const res = await ThreePAppConnection.list(app, query);
      return res.data;
    },
    enabled: !!app && app !== SYSTEM_NODE_APP,
  });
};

export default useListAppConnections;
