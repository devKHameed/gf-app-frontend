import qs from "query-string";
const parser = () => {
  const pathname = window.location.pathname;
  const search = qs.parse(window.location.search.substring(1));

  const parsePathname = (search.redirect as string) || pathname || "";
  const pathArray = parsePathname.split("/");
  const firstElement = parsePathname.startsWith("/")
    ? pathArray[1]
    : pathArray[0];

  return firstElement;
};

export default parser;
