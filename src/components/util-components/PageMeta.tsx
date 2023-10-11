import React, { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { useStore } from "store";

type PageMetaProps = {};

const PageMeta: React.FC<PageMetaProps> = (props) => {
  const location = useLocation();
  const account = useStore.useSelectedAccount?.();

  const routeMeta = React.useMemo(() => {
    if (matchPath("/:accountSlug/dataset-design/*", location.pathname))
      return {
        title: `Dataset Designs | ${account?.name || ""}`,
      };

    if (matchPath("/:accountSlug/fusion-action-module/*", location.pathname))
      return {
        title: `Fusion Actions | ${account?.name || ""}`,
      };

    if (matchPath("/:accountSlug/datacard-design-module/*", location.pathname))
      return {
        title: `Datacard Designs | ${account?.name || ""}`,
      };

    if (matchPath("/:accountSlug/fusion/*", location.pathname))
      return {
        title: `Fusions | ${account?.name || ""}`,
      };

    if (
      matchPath("/:accountSlug/gui-module/:slug/dashboard/*", location.pathname)
    )
      return {
        title: `Gui Dashboard | ${account?.name || ""}`,
      };

    if (matchPath("/:accountSlug/gui-module/*", location.pathname))
      return {
        title: `GUIs | ${account?.name || ""}`,
      };

    if (matchPath("/:accountSlug/import-module/*", location.pathname))
      return {
        title: `Imports | ${account?.name || ""}`,
      };

    if (
      matchPath(
        "/:accountSlug/vector-knowledgebase-module/*",
        location.pathname
      )
    )
      return {
        title: `Vector KnowledgeBase | ${account?.name || ""}`,
      };

    if (
      matchPath(
        "/:accountSlug/finetune-knowledgebase-module/*",
        location.pathname
      )
    )
      return {
        title: `Finetune KnowledgeBase | ${account?.name || ""}`,
      };

    if (matchPath("/:accountSlug/presentation/*", location.pathname))
      return {
        title: `Presentations | ${account?.name || ""}`,
      };

    if (matchPath("/:accountSlug/portal-module/*", location.pathname))
      return {
        title: `Portals | ${account?.name || ""}`,
      };

    if (matchPath("/:accountSlug/icons/*", location.pathname))
      return {
        title: `Icons | ${account?.name || ""}`,
      };

    if (matchPath("/:accountSlug/account-user-module/*", location.pathname))
      return {
        title: `Account Users | ${account?.name || ""}`,
      };

    if (matchPath("/:accountSlug/settings/*", location.pathname))
      return {
        title: `Sylar | ${account?.name || ""}`,
      };
  }, [location.pathname, account]);

  useEffect(() => {
    document.title = routeMeta?.title || `Gui Fusion | ${account?.name || ""}`;
  }, [account?.name, routeMeta]);

  return <></>;
};

export default PageMeta;
