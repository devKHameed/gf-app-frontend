import { useQuery } from "@tanstack/react-query";
import UserModel from "models/User";
import { Auth } from "services/Auth";
import { useStore } from "store";
import { setLocalStorage } from "utils";

export default function useAuthenticate() {
  const setAccounts = useStore.useSetAccounts();

  return useQuery(
    ["auth"],
    async () => {
      await Auth.authenticate();
      const userRes = await UserModel.getUser();
      //Data struture from api is wrong should be inside data key.
      setLocalStorage("auth", userRes);
      return userRes as unknown as typeof userRes["data"];
    },
    {
      enabled: true,

      // initialData: () => {
      //   const cacheUserData: { user: User; accounts: AppAccount[] } =
      //     getLocalStorage("auth");
      //   return cacheUserData;
      // },
      //select: (data) => data.data.user,
      retry: 1,
      onSuccess: (data) => {
        setAccounts(data.accounts);
      },

      onError: () => {
        console.log("handle error on useAuthenticate");
      },
    }
  );
}
