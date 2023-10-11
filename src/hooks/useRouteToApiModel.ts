import { ApiModels } from "queries/apiModelMapping";
import React from "react";
import { matchPath, useLocation } from "react-router-dom";

const useRouteToApiModel = () => {
  const location = useLocation();

  const model = React.useMemo(() => {
    if (matchPath("/:accountSlug/dataset-design/*", location.pathname))
      return ApiModels.DatasetDesign;

    if (matchPath("/:accountSlug/fusion-action-module/*", location.pathname))
      return ApiModels.ThreePApp;

    if (matchPath("/:accountSlug/datacard-design-module/*", location.pathname))
      return ApiModels.DatacardDesign;

    if (
      matchPath("/:accountSlug/gui-module/:slug/dashboard/*", location.pathname)
    )
      return ApiModels.GuiDashboard;

    if (matchPath("/:accountSlug/gui-module/*", location.pathname))
      return ApiModels.Gui;

    if (matchPath("/:accountSlug/account-user-module/*", location.pathname))
      return ApiModels.AccountUser;

    if (matchPath("/:accountSlug/fusion/*", location.pathname))
      return ApiModels.Fusion;

    if (matchPath("/:accountSlug/skill-design-module/*", location.pathname))
      return ApiModels.Fusion;

    if (matchPath("/:accountSlug/portal-module/*", location.pathname))
      return ApiModels.Portal;

    if (
      matchPath(
        "/:accountSlug/vector-knowledgebase-module/*",
        location.pathname
      )
    )
      return ApiModels.VectorKnowledgebase;

    if (
      matchPath(
        "/:accountSlug/finetune-knowledgebase-module/*",
        location.pathname
      )
    )
      return ApiModels.FinetuneKnowledgebase;
    if (matchPath("/:accountSlug/import-module/*", location.pathname))
      return ApiModels.UploadDesign;
  }, [location.pathname]);

  return model;
};

export default useRouteToApiModel;
