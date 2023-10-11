import { useQuery } from "@tanstack/react-query";
import {
  ApiModelDataTypes,
  ThreePAppSubModelMapping,
} from "queries/apiModelMapping";

const useList3pSubmodule = <T extends keyof typeof ThreePAppSubModelMapping>(
  modelName: T,
  options: { app: string; query?: Record<string, string> }
) => {
  return useQuery({
    queryKey: [modelName, options.app],
    queryFn: async () => {
      const res = await ThreePAppSubModelMapping[modelName].model.list(
        options.app,
        options.query
      );
      return res.data as unknown as ApiModelDataTypes[T][];
    },
    enabled: !!options.app,
  });
};

export default useList3pSubmodule;
