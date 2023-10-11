import { useQuery } from "@tanstack/react-query";

import AccountTypesModel from "models/AccountTypes";
import KeyNames from "../keyNames";
/*This function won't send an http request if not necessary.
 * So we can use this function to sync states in different components
 * */
export default function useFetchExamples() {
  return useQuery([KeyNames.accountType], () => AccountTypesModel.list());
}
