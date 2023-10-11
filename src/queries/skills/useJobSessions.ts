import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import JobSessionModel from "models/JobSession";

const fetchJobSessions = async (context: QueryFunctionContext) => {
  const [, skillDesignSlug] = context.queryKey;
  const res = await JobSessionModel.list({
    query: { skill_design_slug: skillDesignSlug },
  });
  return res.data;
};

const useJobSessions = (skillDesignSlug?: string) => {
  return useQuery(["job-sessions", skillDesignSlug], fetchJobSessions, {
    enabled: !!skillDesignSlug,
  });
};

export default useJobSessions;
