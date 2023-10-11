//import moment from 'moment';
import qs, { ParseOptions } from "query-string";
import React from "react";
import { useLocation } from "react-router";

function useQuery<T = any>(
  opts?: Partial<ParseOptions> & { parseDateIntoMoment?: boolean }
) {
  const { parseDateIntoMoment, ...options } = opts || {};

  const { search } = useLocation();

  return React.useMemo<T>(() => {
    const values: T | { [key: string]: any } = qs.parse(search.substring(1), {
      parseBooleans: true,
      parseNumbers: true,
      ...options,
    });

    // if (parseDateIntoMoment)
    //   for (const key in values) {
    //     const date = moment(values[key], 'MM/DD/YYYY', true);
    //     if (date.isValid()) {
    //       values[key as keyof typeof values] = date;
    //     }
    //   }
    return values as T;
  }, [search]);
}

export default useQuery;
