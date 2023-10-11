import { QueryClient } from "@tanstack/react-query";
// import {acorn} from "acorn";
import { SYSTEM_NODE_APP } from "constants/Fusion";
import { MappableTagType } from "enums/Fusion";
import _, { isArray, isPlainObject } from "lodash";
import { ApiModels } from "queries/apiModelMapping";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { getIncomingOperators, getLocalStorage, isValidJson } from "utils";
import { v4 } from "uuid";
import { getSystemModuleInterfaces } from "views/app-view/flow-designer/components/ParamFields/ParamMapper";

const acorn = require("acorn");

type CallStack = {
  type: string;
  value: string;
};

type Tag = {
  type: string;
  slug: string;
};

export const parseTags = (value = ""): string => {
  // eslint-disable-next-line quotes
  const str = value.replace(/\\"/g, '"');

  const chunks = str.split(/\[\[|\]\]/).filter((v) => !!v.trim());
  // console.log("🚀 ~ file: tagsParser.ts:28 ~ parseTags ~ chunks:", chunks);
  const callStack: CallStack[] = [];
  let result = "";
  let inc = 1;
  let parsingArray = false;
  for (let index = 0; index < chunks.length; index += inc) {
    const chunk = chunks[index];
    inc = 1;
    {
      const tag = getIfTag(chunk);
      // console.log("🚀 ~ file: tagsParser.ts:33 ~ chunks.forEach ~ tag:", tag);
      if (tag == null) {
        if (callStack.length > 0) {
          splitString(chunk)
            .map((v) => v.trim())
            .filter((v) => !!v)
            .forEach((v) => {
              callStack.push({ type: "value", value: v });
            });
        } else {
          result += chunk;
        }
      } else {
        if (tag.type === "variable") {
          const splits = tag.slug.split(".");
          let lastSplit = splits.pop();
          let arrayStart = false,
            arrayEnd = false,
            prependBody = true;
          if (lastSplit?.endsWith("[")) {
            parsingArray = true;
            arrayStart = true;
            lastSplit = lastSplit?.slice(0, -1);

            if (splits[0]?.startsWith("]")) {
              prependBody = false;
              arrayEnd = true;
            }
          } else if (parsingArray && splits[0]?.startsWith("]")) {
            parsingArray = false;
            arrayEnd = true;
            prependBody = false;
          }
          const variableStr = `${prependBody ? "body" : ""}${splits
            .map((part, idx) => (idx === 0 && arrayEnd ? part : `['${part}']`))
            .join("")}['${lastSplit}']${arrayStart ? "[" : ""}`;
          if (callStack.length > 0) {
            callStack.push({ type: "variable", value: variableStr });
          } else {
            let appendToResult = `{{${variableStr}}}`;
            if (arrayStart && arrayEnd) {
              appendToResult = `${variableStr}`;
            } else if (arrayStart) {
              appendToResult = `{{${variableStr}`;
            } else if (parsingArray) {
              appendToResult = `${variableStr}`;
            } else if (arrayEnd) {
              appendToResult = `${variableStr}}}`;
            }
            result += appendToResult;
          }
        } else if (tag.type === "function") {
          callStack.push({ type: "function", value: tag.slug });
        } else if (tag.type === "closing_bracket") {
          const callParams: string[] = [];
          let callStackItem = callStack.pop();
          if (callStackItem?.type !== "function") {
            do {
              if (callStackItem?.type === "value") {
                const numberedValue = _.toNumber(callStackItem.value);
                if (
                  !_.isNaN(numberedValue) ||
                  isValidJson(callStackItem.value)
                ) {
                  callParams.unshift(callStackItem.value);
                } else {
                  let tempValue = callStackItem.value.trim();
                  while (tempValue.startsWith(",")) {
                    tempValue = tempValue.substring(1);
                  }
                  tempValue = tempValue.trim();
                  callParams.unshift(`"${tempValue}"`);
                }
              } else if (callStackItem) {
                callParams.unshift(callStackItem.value);
              }
              callStackItem = callStack.pop();
            } while (callStackItem?.type !== "function");
          }
          const functionStr = `${callStackItem.value}(${callParams.join(",")})`;
          if (callStack.length > 0) {
            callStack.push({ type: "function_call", value: functionStr });
          } else {
            result += `{{${functionStr}}}`;
          }
        }
      }
    }
  }

  // console.log({ value, result });

  return result;
};

export const getIfTag = (str: string) => {
  try {
    const tag = JSON.parse(str) as Record<string, unknown>;
    if (_.isObject(tag) && !!tag.type && !!tag.slug) {
      return tag as Tag;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const splitString = (str: string) => {
  const result: string[] = [];
  let temp = "",
    inQuote = false,
    quoteType: string | null = null;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "'" || str[i] === '"') {
      if (!inQuote) {
        inQuote = true;
        quoteType = str[i];
      } else if (inQuote && str[i] === quoteType) {
        inQuote = false;
        quoteType = null;
      }
    } else if (str[i] === "," && !inQuote) {
      result.push(temp);
      temp = "";
    } else {
      temp += str[i];
    }
  }
  if (temp) result.push(temp);
  return result;
};

export const parseTagsToExpression = (value = "") => {
  if (!value) return value;
  return parseTags(value);
};

const getSystemInterfaces = (
  selectedNode: FusionOperator,
  fusion: Record<string, any> | null
) => {
  const authData = getLocalStorage("auth") as { user: User };
  const userSlug = authData?.user?.slug;

  const queryClient = new QueryClient();
  const documents = queryClient.getQueryData<DatasetDesign[]>([
    ApiModels.DatasetDesign,
  ]);
  const webhooks = queryClient.getQueryData<FusionWebhook[]>([
    "fusion-webhooks",
    selectedNode.app === SYSTEM_NODE_APP
      ? SYSTEM_NODE_APP
      : selectedNode.app_module,
    userSlug,
  ]);

  const systemInterfaces: MappableParameter[] = getSystemModuleInterfaces(
    webhooks || [],
    fusion as any,
    documents || [],
    selectedNode
  );

  return systemInterfaces;
};

const getTagParams = (opInterfaces: Record<string, MappableParameter[]>) => {
  return Object.entries(opInterfaces).reduce<Record<string, MappableParameter>>(
    (acc, [key, value]) => {
      value.forEach((v) => {
        acc[`${key}.${v.name}`] = v;
        if (v.spec && isPlainObject(v.spec)) {
          acc = {
            ...acc,
            ...getTagParams({
              [`${key}.${v.name}`]: [v.spec as MappableParameter],
            }),
          };
        } else if (v.spec && isArray(v.spec)) {
          acc = {
            ...acc,
            ...getTagParams({
              [`${key}.${v.name}`]: v.spec as MappableParameter[],
            }),
          };
        }
      });
      return acc;
    },
    {}
  );
};

export const parseExpressionToTags = (value = "", primaryColor?: string) => {
  if (!value) return value;

  const {
    allModules,
    fusionDraft: fusion,
    selectedNode,
  } = useFusionFlowStore.getState();

  const queryClient = new QueryClient();
  const functionGroups = queryClient.getQueryData<GFMLFunctionGroup[]>([
    "gfml-function-groups",
  ]);

  const functions =
    functionGroups?.reduce<GFMLFunction[]>((acc, cur) => {
      acc.push(
        ...(cur.function_group_sub_groups?.reduce<GFMLFunction[]>(
          (subAcc, subCur) => {
            subAcc.push(...subCur.functions);
            return subAcc;
          },
          []
        ) || [])
      );
      return acc;
    }, []) || [];

  const incoming = getIncomingOperators(
    selectedNode?.data,
    fusion?.fusion_operators
  );
  if (selectedNode?.data.app_module === "chart-node") {
    const leafNodes =
      fusion?.fusion_operators?.filter(
        (op) =>
          !fusion?.fusion_operators?.find(
            (o) => o.parent_operator_slug === op.operator_slug
          )
      ) || [];
    incoming.push(...leafNodes);
  }
  // console.log("🚀 ~ file: tagsParser.ts:211 ~ incoming:", incoming);

  const systemOperators = incoming.filter((op) => op.app === SYSTEM_NODE_APP);
  const threePOperators = incoming.filter((op) => op.app !== SYSTEM_NODE_APP);

  const systemInterfaces = systemOperators.reduce<
    Record<string, MappableParameter[]>
  >((acc, cur) => {
    acc[cur.operator_slug] = getSystemInterfaces(cur, fusion);
    return acc;
  }, {});
  // console.log(
  //   "🚀 ~ file: tagsParser.ts:206 ~ systemInterfaces:",
  //   systemInterfaces
  // );

  const prevOperatorInterfaces = threePOperators.reduce<
    Record<string, MappableParameter[]>
  >((acc, cur) => {
    const m = allModules.find((m) => m.slug === cur.app_module);
    const moduleInterfaces = (m?.interface as MappableParameter[]) || [];
    acc[cur.operator_slug] = moduleInterfaces;
    return acc;
  }, systemInterfaces);
  // console.log(
  //   "🚀 ~ file: tagsParser.ts:213 ~ prevOperatorInterfaces:",
  //   prevOperatorInterfaces
  // );

  const tagParams = getTagParams(prevOperatorInterfaces);
  // console.log("🚀 ~ file: tagsParser.ts:222 ~ tagParams:", tagParams);

  const inputVars = fusion?.fusion_fields?.fields || [];

  const inputVarsInterfaces = inputVars.map((variable) => ({
    name: variable.slug!,
    type: variable.type!,
    label: variable.title!,
  }));

  let result = value;

  while (result.indexOf("{{") > -1) {
    const startIdx = result.indexOf("{{");
    const endIdx = result.indexOf("}}");

    const slug = result.substring(startIdx + 2, endIdx);
    // console.log("🚀 ~ file: tagsParser.ts:259 ~ slug:", slug);
    const [_, operatorSlug, ...restSlugChunks] = slug
      .split(/\[['"]|['"]\]/)
      .filter(Boolean);
    const restSlug = restSlugChunks.join(".");

    let tagJson: Record<string, unknown> | undefined;
    if (operatorSlug === "sessionInitVars") {
      const param = inputVarsInterfaces.find((p) => p.name === restSlug);
      if (param) {
        tagJson = {
          value: param.label || param.name,
          id: v4(),
          slug: `${operatorSlug}.${restSlug}`,
          color: primaryColor,
          draggable: true,
          type: MappableTagType.Variable,
        };
      }
    } else {
      const param = tagParams[`${operatorSlug}.${restSlug}`];
      if (param) {
        tagJson = {
          value: param.label || param.name,
          id: v4(),
          slug: `${operatorSlug}.${restSlug}`,
          color: primaryColor,
          draggable: true,
          type: MappableTagType.Variable,
        };
      } else {
        const funcCall = result.substring(startIdx + 2, endIdx);
        const ast = acorn.parse(funcCall, { ecmaVersion: 2020 });
        console.log("🚀 ~ file: tagsParser.ts:310 ~ ast:", ast);
        result = result.replace(
          result.substring(startIdx, endIdx + 2),
          `[[${result.substring(startIdx + 2, endIdx)}]]`
        );
      }
    }

    // console.log("🚀 ~ file: tagsParser.ts:291 ~ tagJson:", tagJson);
    if (tagJson) {
      result = result.replace(
        result.substring(startIdx, endIdx + 2),
        `[[${JSON.stringify(tagJson)}]]`
      );
    }
  }

  return result;
};
