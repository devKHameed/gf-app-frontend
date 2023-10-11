import { useStore } from "store";

const useAccountSlug = () => {
  const accountSlug = useStore.useSelectedAccount?.()?.slug;
  return accountSlug;
};

export default useAccountSlug;
