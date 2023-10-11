import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Auth } from "services/Auth";
import { removeLocalStorage } from "utils";
import { queryClient } from "..";

export default function useSignOut() {
  const navigate = useNavigate();
  return useMutation(
    async () => {
      await Auth.signOut();
      return;
    },
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries();
      },
      onSuccess: () => {
        removeLocalStorage("auth");

        navigate("/login");
      },
    }
  );
}
