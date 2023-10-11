import { useMutation } from "@tanstack/react-query";
import isArray from "lodash/isArray";
import { queryClient } from "queries";
import {
  ApiModelDataTypes,
  ThreePAppSubModelMapping,
} from "queries/apiModelMapping";
const useCreate3pAppConnection = <
  T extends keyof typeof ThreePAppSubModelMapping
>(
  modelName: T,
  options: { app: string; query?: Record<string, string> }
) => {
  return useMutation({
    mutationFn: async (data: Partial<ApiModelDataTypes[T]>) => {
      const res = await ThreePAppSubModelMapping[modelName].model.create(
        options.app,
        data
      );
      return res.data as unknown as ApiModelDataTypes[T][];
    },
    onSuccess: (data) => {
      queryClient.setQueriesData([modelName, options.app], (oldData) => {
        if (isArray(oldData)) {
          return [...oldData, data];
        }
        return oldData;
      });
    },
  });
};

export default useCreate3pAppConnection;
