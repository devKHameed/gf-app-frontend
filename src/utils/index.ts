import { SystemModuleType } from "enums/Fusion";
import { isArray, isObject, isString, mapValues } from "lodash";
import cloneDeep from "lodash/cloneDeep";
import _omit from "lodash/omit";
import qs from "query-string";
import React from "react";

export const getUser = () => {
  return (
    getLocalStorage("auth") as {
      user: User;
    }
  ).user;
};

export const getLocalStorage = (name: string, parse = true) => {
  try {
    if (parse) {
      return JSON.parse(localStorage.getItem(name) || "");
    } else {
      return localStorage.getItem(name);
    }
  } catch (e) {
    return undefined;
  }
};
export const setLocalStorage = (name: string, value: any, stringify = true) => {
  if (stringify) {
    return localStorage.setItem(name, JSON.stringify(value));
  } else {
    return localStorage.setItem(name, value);
  }
};
export const removeLocalStorage = (name: string) => {
  localStorage.removeItem(name);
};

export const cloneElement = (element: React.ReactNode, props?: any) => {
  if (!element || !React.isValidElement(element)) return null;

  return React.cloneElement(element, props);
};

export const parseQuery = <T = any>(search: string): T => {
  return qs.parse(search.substring(1)) as unknown as T;
};

/**
 * Get first character from first & last sentences of a username
 * @param {String} name - Username
 * @return {String} 2 characters string
 */
export const getNameInitial = (name: string) => {
  const initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
};

export const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

export const setSearchParams = (
  params:
    | Record<string, string>
    | ((prev: Record<string, string>) => Record<string, string>)
) => {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  if (typeof params === "function") {
    params = params(Object.fromEntries(searchParams.entries()));
  }

  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  window.history.pushState(null, "", url.toString());
};

export const getSearchParams = () => {
  const url = new URL(window.location.href);
  return url.searchParams;
};

export const getModulesInPath = (
  operator: FusionOperator,
  operatorList: FusionOperator[],
  appModule: SystemModuleType,
  stopSlug?: string
): FusionOperator[] => {
  if (!operator || operator.operator_slug === stopSlug) {
    return [];
  }

  let parentOperator = operatorList.find(
    (item) => item.operator_slug === operator.parent_operator_slug
  );

  while (parentOperator && parentOperator.app_module !== appModule) {
    parentOperator = operatorList.find(
      // eslint-disable-next-line no-loop-func
      (item) => item.operator_slug === parentOperator?.parent_operator_slug
    );
  }

  if (!parentOperator) {
    return [];
  }

  return [
    parentOperator,
    ...getModulesInPath(parentOperator, operatorList, appModule, stopSlug),
  ];
};

export const getOpenIteratorOptions = (
  operator: FusionOperator,
  operatorList: FusionOperator[]
) => {
  if (!operator) {
    return [];
  }
  const iteratorsInPath = getModulesInPath(
    operator,
    operatorList,
    SystemModuleType.ArrayIterator
  );
  const aggregatorsInPath = getModulesInPath(
    operator,
    operatorList,
    SystemModuleType.ArrayAggregator
  );
  let openIterators = cloneDeep(iteratorsInPath);
  aggregatorsInPath.forEach((ag) => {
    if (ag.operator_input_settings?.iterator_slug) {
      const iterator = openIterators.find(
        (it) => it.operator_slug === ag.operator_input_settings?.iterator_slug
      );
      if (iterator) {
        const inBetweenIterators = getModulesInPath(
          ag,
          operatorList,
          SystemModuleType.ArrayIterator,
          iterator.operator_slug
        );
        openIterators = openIterators.filter(
          (it) =>
            !inBetweenIterators.find(
              (iit) => it.operator_slug === iit.operator_slug
            )
        );
      }
    }
  });

  return openIterators.map((oit) => ({
    label: oit.operator_title,
    value: oit.operator_slug,
  }));
};

const urlPattern = new RegExp(
  "^(https?:\\/\\/)?" + // validate protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
    "(\\#[-a-z\\d_]*)?$",
  "i"
); // validate fragment locator

export const isValidUrl = (urlString: string) => {
  return !!urlPattern.test(urlString);
};

export const getIncomingOperators = (
  node?: Partial<FusionOperator>,
  operators: FusionOperator[] = []
): FusionOperator[] => {
  if (!node) {
    return operators;
  }

  if (node.is_start_node) {
    return [];
  }

  const parentSlug = node.parent_operator_slug;
  if (!parentSlug) {
    return [];
  }

  const parentOperator = operators.find(
    (operator) => operator.operator_slug === parentSlug
  );
  if (!parentOperator) {
    return [];
  }

  return [parentOperator, ...getIncomingOperators(parentOperator, operators)];
};

export const normalizeObjectForAPI = <T>(
  object: T,
  omit: (keyof T)[] = [],
  ignore: (keyof T)[] = []
): Partial<T> => {
  return _omit(
    object as any,
    ["created_at", "slug", "updated_at", "id", "is_deleted", ...omit].filter(
      (item) => !ignore.includes(item as keyof T)
    )
  ) as Partial<T>;
};

export const isValidJson = (json: string) => {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
};

type ReturnValue<D, R> = D extends string
  ? R
  : D extends unknown[]
  ? R[]
  : D extends object
  ? { [P in keyof D]: R }
  : D;

export const applyToValues = <D, F extends (...args: any[]) => any>(
  data: D,
  func: F,
  ...funcArgs: unknown[]
): ReturnValue<D, ReturnType<typeof func>> => {
  if (isArray(data)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data.map((d) => applyToValues(d, func, ...funcArgs)) as ReturnValue<
      D,
      ReturnType<typeof func>
    >;
  }

  if (isObject(data)) {
    return mapValues(data, (value) =>
      applyToValues(value, func, ...funcArgs)
    ) as ReturnValue<D, ReturnType<typeof func>>;
  }

  if (isString(data)) {
    return func(data, ...funcArgs) as ReturnValue<D, ReturnType<typeof func>>;
  }

  return data as ReturnValue<D, ReturnType<typeof func>>;
};

export const isWidgetFusion = (type: string) => {
  if (type.startsWith("data-list-widget")) {
    return true;
  }

  return ["stat", "line", "pie", "bar", "data-list"].includes(type);
};
export function isPlaying($video: HTMLMediaElement | any) {
  if (!$video) return;
  return !!(
    $video?.currentTime > 0 &&
    !$video?.paused &&
    !$video?.ended &&
    $video?.readyState > 2
  );
}

export function getPathAfterFirstSlash(url: string) {
  const firstSlashIndex = url.indexOf("/", 1);
  if (firstSlashIndex === -1) {
    return null; // If no slash is found in the URL
  }

  return url.substring(firstSlashIndex);
}
