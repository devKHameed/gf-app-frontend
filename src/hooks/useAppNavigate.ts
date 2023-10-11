import React from "react";
import { NavigateOptions, To, useNavigate } from "react-router-dom";
import { useStore } from "store";

type PushOptions = {
  prependAccount?: boolean;
  accountSlug?: string;
};

export interface NavigateFunction {
  (to: To | number, options?: NavigateOptions & PushOptions): void;
}

const parseLocation = (
  location: To,
  options?: PushOptions,
  accountSlug?: string
) => {
  const { prependAccount = true } = options || {};
  const slug = options?.accountSlug || accountSlug;

  if (!prependAccount || !slug) {
    return location;
  }

  const pathname = typeof location === "string" ? location : location.pathname;

  if (!pathname?.startsWith("/") || pathname.startsWith(`/${slug}`)) {
    return location;
  }

  if (typeof location !== "string") {
    location.pathname = `/${slug}${location.pathname}`;
  } else {
    location = `/${slug}${location}`;
  }

  return location;
};

const useAppNavigate = () => {
  const accountSlug = useStore.useSelectedAccount?.()?.slug;
  const navigate = useNavigate();

  const gfNavigate = React.useMemo<NavigateFunction>(() => {
    return ((location, options) => {
      if (typeof location !== "number") {
        const newUrl = parseLocation(location, options, accountSlug);
        return navigate(newUrl, options);
      }
      return navigate(location as To, options);
    }) as NavigateFunction;
  }, [accountSlug, navigate]);

  return gfNavigate;
};

export default useAppNavigate;
