import { getLocalStorage, setLocalStorage } from "utils";
import parseURLForAccountSlug from "utils/parseURLForAccountSlug";
import { StoreApi } from "zustand";

export interface IGlobal {
  accounts?: AppAccount[];
  selectedAccount?: AppAccount;
  isLoading: boolean;
  setSelectedAccount: (slug: string) => void;
  setAccounts: (accts: AppAccount[]) => void;
}

const createGlobalSlice = (
  set: StoreApi<IGlobal>["setState"],
  get: StoreApi<IGlobal>["getState"]
  //   api: StoreApi<IGlobal>
): IGlobal => ({
  isLoading: false,
  accounts: [],
  selectedAccount: undefined,
  setSelectedAccount: async (slug) => {
    set((state) => {
      const findAccount = state.accounts?.find(
        (appAct) => appAct.slug === slug
      );
      if (findAccount?.slug) {
        state.selectedAccount = findAccount;
      }
      setLocalStorage("account-id", state.selectedAccount?.slug, false);
      return state;
    });
  },

  setAccounts: async (accts) => {
    const accountFromLocalStorage = getLocalStorage(
      "account-id",
      false
    ) as string;
    const accountFromUrl = parseURLForAccountSlug();
    const existStorageOneInList = accts?.find(
      (act: AppAccount) => act.slug === accountFromLocalStorage
    );

    const existLinkedOneInList = accts?.find(
      (act: AppAccount) => act.slug === accountFromUrl
    );

    set((state) => {
      state.accounts = accts;
      if (existLinkedOneInList) {
        state.selectedAccount = existLinkedOneInList;
      } else {
        state.selectedAccount = existStorageOneInList?.slug
          ? existStorageOneInList
          : accts?.[0]; // Rollback to first one
      }

      setLocalStorage("account-id", state.selectedAccount?.slug, false);
      return state;
    });
  },
});

export default createGlobalSlice;
