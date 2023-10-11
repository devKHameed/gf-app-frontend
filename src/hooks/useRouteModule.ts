import React from "react";
import { matchPath, useLocation } from "react-router-dom";

const useRouteModule = () => {
  const location = useLocation();

  const routeModule = React.useMemo(() => {
    if (matchPath("/:accountSlug/dataset-design/*", location.pathname))
      return "dataset-design-module";

    if (
      matchPath(
        "/:accountSlug/vector-knowledgebase-module/*",
        location.pathname
      )
    )
      return "vector-knowledgebase-module";

    if (
      matchPath(
        "/:accountSlug/finetune-knowledgebase-module/*",
        location.pathname
      )
    )
      return "finetune-knowledgebase-module";

    if (matchPath("/:accountSlug/import-module/*", location.pathname))
      return "import-module";

    if (
      matchPath("/:accountSlug/gui-module/:slug/dashboard/*", location.pathname)
    )
      return "gui-dashboard-module";

    if (matchPath("/:accountSlug/gui-module/*", location.pathname))
      return "gui-module";

    if (matchPath("/:accountSlug/fusion/*", location.pathname))
      return "fusion-module";

    if (matchPath("/:accountSlug/skill-design-module/*", location.pathname))
      return "fusion-module";

    if (matchPath("/:accountSlug/datacard-design-module/*", location.pathname))
      return "datacard-design-module";

    if (matchPath("/:accountSlug/presentation/*", location.pathname))
      return "presentation-module";

    if (matchPath("/:accountSlug/portal-module/*", location.pathname))
      return "portal-module";

    if (matchPath("/:accountSlug/icons/*", location.pathname))
      return "icon-module";

    if (matchPath("/:accountSlug/fusion-action-module/*", location.pathname))
      return "fusion-action-module";

    if (matchPath("/:accountSlug/account-user-module/*", location.pathname))
      return "account-user-module";

    if (matchPath("/:accountSlug/user-type-module/*", location.pathname))
      return "user-type-module";

    if (matchPath("/:accountSlug/skills/*", location.pathname)) {
      return "skill-module";
    }

    if (
      matchPath("/:accountSlug/settings/*", location.pathname) ||
      matchPath("/:accountSlug/chat/*", location.pathname)
    )
      return "sylar-module";
  }, [location.pathname]);

  return routeModule;
};

export default useRouteModule;
