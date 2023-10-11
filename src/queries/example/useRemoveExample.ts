import { useMutation } from "@tanstack/react-query";

import AccountTypesModel from "models/AccountTypes";
import { queryClient } from "../";
import { keys } from "../keyNames";

export default function useRemove() {
  return useMutation((slug: string) => AccountTypesModel.delete(slug), {
    onMutate: async (slug: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries([keys.accountType]);

      // Snapshot the previous value
      const backup = queryClient.getQueryData<{ data: AccountType[] }>([
        keys.accountType,
      ]);

      // Optimistically update by removing the value
      if (backup)
        queryClient.setQueryData<{ data: AccountType[] }>([keys.accountType], {
          data: [...backup.data.filter((h) => h.slug !== slug)],
        });

      return { backup };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.backup)
        queryClient.setQueryData<AccountType[]>(
          [keys.accountType],
          context.backup.data
        );
    },
    // Always refetch after error or success:
    onSettled: () => queryClient.invalidateQueries([keys.accountType]),
  });
}
