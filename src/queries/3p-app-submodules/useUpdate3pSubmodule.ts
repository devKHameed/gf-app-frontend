import { useMutation } from "@tanstack/react-query";
import isArray from "lodash/isArray";
import { queryClient } from "queries";
import {
  ApiModelDataTypes,
  ThreePAppSubModelMapping,
} from "queries/apiModelMapping";
const useUpdate3pAppConnection = <
  T extends keyof typeof ThreePAppSubModelMapping
>(
  modelName: T,
  options: { app: string; query?: Record<string, string> }
) => {
  return useMutation<
    void,
    unknown,
    { slug: string; data: Partial<ApiModelDataTypes[T]> }
  >({
    mutationFn: async ({ slug, data }) => {
      await ThreePAppSubModelMapping[modelName].model.update(slug, data);
    },
    onSuccess: (_, { slug, data }) => {
      const defaultQueryKey = [modelName, options.app, slug];
      queryClient.setQueriesData(
        defaultQueryKey,
        (oldData?: ApiModelDataTypes[T]) => {
          if (oldData) {
            const mewData = {
              ...oldData,
              ...data,
            };
            return mewData;
          }

          return oldData;
        }
      );
      queryClient.setQueriesData(
        [modelName, options.app],
        (oldData: ApiModelDataTypes[T][] = []) => {
          if (isArray(oldData)) {
            return oldData.map((item) =>
              item.slug === slug ? { ...item, ...data } : item
            );
          }

          return oldData;
        }
      );
    },
  });
};

export default useUpdate3pAppConnection;
