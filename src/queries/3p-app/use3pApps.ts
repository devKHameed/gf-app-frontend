import useListItems from "queries/useListItems";

const use3pApps = () => {
  return useListItems({
    modelName: "3p-app",
    requestOptions: { query: { include: "global" } },
  });
};

export default use3pApps;
