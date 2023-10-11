import { useMutation } from "@tanstack/react-query";
import UserModel from "models/User";
import { useNavigate } from "react-router-dom";
import { Auth } from "services/Auth";
import { queryClient } from "../";

export default function useSignIn() {
  const navigate = useNavigate();
  return useMutation(
    async (data: { email: string; password: string }) => {
      await Auth.signIn(data.email, data.password);
      const userRes = await UserModel.getUser();
      //dispatch(setUser(userRes));
      return userRes;
    },
    {
      // Always refetch after error or success:
      onSettled: () => queryClient.invalidateQueries(["auth"]),
      onSuccess: () => {
        navigate("/");
      },
    }
  );
}
