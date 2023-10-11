import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  ApiModelDataTypes,
  RequestOptions,
  ThreePAppSubModelMapping,
} from "../apiModelMapping";

type GetQueryParams<T extends keyof typeof ThreePAppSubModelMapping> = {
  modelName: T;
  slug?: string;
  requestOptions?: RequestOptions;
  queryOptions?: Pick<UseQueryOptions, "enabled">;
  app?: string;
};

export default function useGet3pSubmoduleItem<
  T extends keyof typeof ThreePAppSubModelMapping
>({
  modelName,
  slug,
  requestOptions = {},
  queryOptions = {},
  app,
}: GetQueryParams<T>) {
  return useQuery({
    queryKey: [modelName, app, slug],
    queryFn: async () => {
      if (slug) {
        const res = await ThreePAppSubModelMapping[modelName].model.get(slug);
        return res.data as unknown as ApiModelDataTypes[T];
      }
    },
    enabled: !!slug,
    ...queryOptions,
  });
}
