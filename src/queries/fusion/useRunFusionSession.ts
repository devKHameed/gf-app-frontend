import { useMutation } from "@tanstack/react-query";
import FusionModel from "models/Fusion";
import { FusionDraft } from "store/stores/fusion-flow";

const runFusionSession = async (data: {
  fusion: FusionDraft;
  userSlug: string;
}) => {
  const { fusion, userSlug } = data;
  const res = await FusionModel.runTest(fusion as Fusion, userSlug);
  return res.data;
};

const useRunFusionSession = () => {
  return useMutation(["run-fusion-sessions"], runFusionSession);
};

export default useRunFusionSession;
