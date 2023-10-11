import { useQuery } from "@tanstack/react-query";
import GFMLFunctionModel from "models/GFMLFunction";

const fetchGFMLFunctionGroups = async () => {
  const res = await GFMLFunctionModel.getGlobalFunctionGroups({
    include: "global",
  });
  return res.data;
};

const useGFMLFunctionGroups = () => {
  return useQuery(["gfml-function-groups"], fetchGFMLFunctionGroups);
};

export default useGFMLFunctionGroups;
