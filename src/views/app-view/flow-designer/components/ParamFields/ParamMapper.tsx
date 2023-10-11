import {
  ArrowDropDown,
  CloseOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import Scrollbar from "components/Scrollbar";
import { SYSTEM_NODE_APP, WIDGET_START_NODE_MODULE } from "constants/Fusion";
import { ParameterType } from "enums/3pApp";
import { DocumentElementType } from "enums/Form";
import { FusionType, MappableTagType, SystemModuleType } from "enums/Fusion";
import { isArray } from "lodash";
import { ApiModels } from "queries/apiModelMapping";
import useAuthenticate from "queries/auth/useAuthenticate";
import useFusionWebhooks from "queries/fusion/useFusionWebhooks";
import useGFMLFunctionGroups from "queries/fusion/useGFMLFunctionGroups";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import React, { useEffect, useState } from "react";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { getIncomingOperators, isWidgetFusion } from "utils";

const colors = ["#ABB5C0", "#4496BF", "#E9E9EB", "#79B837"];

const StyledTab = styled(Tabs)(({ theme }) => ({
  minHeight: "30px",
  padding: "10px 0",

  ".MuiTabScrollButton-root": {
    marginTop: "-4px",
  },

  ".MuiTab-root": {
    padding: "0 0 5px",
    minHeight: "27px",
    marginRight: "20px",
    minWidth: "inherit",
    fontSize: "16px",
    lineHeight: "20px",
    fontFamily: "Source Sans Pro, sans-serif",

    "&.Mui-selected": {
      color: theme.palette.text.primary,
    },
  },
}));

const ModalHeader = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.GF7,
}));

const FunctionPanel: React.FC<{
  groups: GFMLFunctionSubGroups[];
  onTagClick: (func: GFMLFunction) => void;
}> = (props) => {
  const { groups, onTagClick } = props;
  return (
    <Stack gap={1} className="popover-tags-wrap">
      {groups?.map((group, idx) => {
        const color = colors[idx % colors.length];
        return group.function_sub_group_name ? (
          <Stack gap={0.75}>
            <Typography variant="body2">
              {group.function_sub_group_name}
            </Typography>
            <div className="popover-tags">
              {group.functions.map((func) => {
                return (
                  <Chip
                    component="div"
                    draggable={true}
                    sx={{
                      backgroundColor: color,
                      borderRadius: 0,
                      height: "24px",
                      mr: 1,
                      mb: 1,
                      ".MuiChip-label": { py: "4px" },
                    }}
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        "text/plain",
                        JSON.stringify({
                          type: MappableTagType.Function,
                          data: { ...func, function_color: color },
                        })
                      );
                    }}
                    onClick={() =>
                      onTagClick({ ...func, function_color: color })
                    }
                    label={func.function_button_title || func.function_title}
                    size="small"
                  />
                );
              })}
            </div>
          </Stack>
        ) : null;
      })}
    </Stack>
  );
};

const OperatorPanel: React.FC<{
  interfaceParams: MappableParameter[];
  depth?: number;
  slugPrefix?: string;
  operatorStack?: MappableParameter[];
  onTagClick?(param: Record<string, any>): void;
}> = (props) => {
  const theme = useTheme();

  const {
    interfaceParams = [],
    depth = 0,
    slugPrefix,
    operatorStack = [],
    onTagClick,
  } = props;
  const [showChild, setShowChild] = useState<string[]>(
    interfaceParams.map((param) => `${param.name}`)
  );

  return (
    <>
      {interfaceParams?.map((param) => {
        const collapsed = !showChild.includes(`${param.name}`);
        return (
          <div style={{ paddingLeft: 5 * depth }}>
            <Stack spacing={1} direction="row">
              <Chip
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "text/plain",
                    JSON.stringify({
                      type: MappableTagType.Variable,
                      data: {
                        ...param,
                        color: theme.palette.primary.main,
                        slug: `${slugPrefix}.${param.name}`,
                      },
                    })
                  );
                }}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 0,
                  height: "24px",
                  ".MuiChip-label": { py: "4px" },
                }}
                onClick={() =>
                  onTagClick?.({
                    ...param,
                    color: theme.palette.primary.main,
                    slug: `${slugPrefix}.${param.name}`,
                    operatorStack: [...operatorStack, param],
                  })
                }
                label={`${param.label || param.name}${
                  param.type === ParameterType.Array ? " [ ] " : ""
                }`}
              />
              {[ParameterType.Collection, ParameterType.Array].includes(
                param.type as ParameterType
              ) && param.spec?.length > 0 ? (
                <ArrowDropDown
                  onClick={() => {
                    if (!collapsed) {
                      setShowChild(
                        showChild.filter((name) => name !== param.name)
                      );
                    } else {
                      setShowChild([...showChild, `${param.name}`]);
                    }
                  }}
                  rotate={!collapsed ? 180 : 0}
                />
              ) : null}
            </Stack>
            {!collapsed &&
            [ParameterType.Collection, ParameterType.Array].includes(
              param.type as ParameterType
            ) ? (
              <OperatorPanel
                interfaceParams={(isArray(param.spec)
                  ? param.spec
                  : [param.spec]
                ).filter(Boolean)}
                depth={depth + 1}
                slugPrefix={`${slugPrefix}.${param.name}${
                  param.type === ParameterType.Array ? "[]" : ""
                }`}
                onTagClick={onTagClick}
                operatorStack={[...operatorStack, param]}
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
};

export const getCollectionSpecs = (
  interfaces: MappableParameter[],
  field: string
) => {
  let result = [...interfaces];

  if (field.indexOf(".") < 0) {
    result.push({
      name: field,
      type: ParameterType.Text,
      label: `${field.charAt(0).toUpperCase()}${field.slice(1)}`,
    });

    return result;
  }

  const [root, ...rest] = field.split(".");
  const remainingKeys = rest.join(".");
  let rootIdx = result.findIndex((r) => r.name === root);

  if (rootIdx < 0) {
    result.push({
      name: root,
      type: ParameterType.Text,
      label: `${root.charAt(0).toUpperCase()}${root.slice(1)}`,
    });
    rootIdx = result.length - 1;
  }
  const rootValue = result[rootIdx];
  rootValue.type = ParameterType.Collection;
  rootValue.spec = getCollectionSpecs(
    (rootValue.spec || []) as MappableParameter[],
    remainingKeys
  );

  return result;
};

export const getCollectionSpec = (field: DataField) => {
  if (field.type === DocumentElementType.Location) {
    return {
      name: field?.slug,
      label: field?.title,
      type: ParameterType.Collection,
      spec: [
        {
          name: "lat",
          type: ParameterType.Number,
          label: "Latitude",
        },
        {
          name: "lng",
          type: ParameterType.Number,
          label: "Longitude",
        },
      ],
    };
  }
  if (field.type === DocumentElementType.Image) {
    return {
      name: field?.slug,
      label: field?.title,
      type: ParameterType.Array,
    };
  }
  return {
    name: field?.slug,
    label: field?.title,
    ...(field.children && field.children.length > 0
      ? {
          type: ParameterType.Collection,
          spec: mapDocumentFieldsToInterface(field.children),
        }
      : {
          type: ParameterType.Text,
        }),
  };
};

export const mapDocumentFieldsToInterface = (fields: DataField[] = []) => {
  let interfaces: MappableParameter[] = [];
  fields.forEach((field) => {
    interfaces.push(getCollectionSpec(field));
  });
  return interfaces;
};

export const mapFieldsToInterface = (fields: string[]) => {
  let interfaces: MappableParameter[] = [];
  fields.forEach((field) => {
    interfaces = getCollectionSpecs(interfaces, field);
  });
  return interfaces;
};

export const getSystemModuleInterfaces = (
  webhooks: FusionWebhook[] = [],
  fusion: Fusion,
  documents: DatasetDesign[],
  operator?: Partial<FusionOperator>
) => {
  switch (operator?.app_module) {
    case SystemModuleType.AskQuestion:
      return [
        {
          name: "user_input",
          type: ParameterType.Text,
          label: "User Response",
        },
      ];
    case SystemModuleType.UpdateDisplay: {
      if (operator.operator_input_settings?.execution_type === "sync") {
        if (operator.operator_input_settings?.display_type === "fusion") {
          if (operator.operator_input_settings?.fusion_type === "open_fusion") {
            return [
              {
                name: "automation_flow",
                type: ParameterType.Collection,
                label: "Automation Flow",
                spec: [
                  {
                    name: "steps",
                    type: ParameterType.Array,
                    label: "Steps",
                    spec: [
                      {
                        name: "step_id",
                        type: ParameterType.Text,
                        label: "Step ID",
                      },
                      {
                        name: "operator_name",
                        type: ParameterType.Text,
                        label: "Operator Name",
                      },
                      {
                        name: "operator_type",
                        type: ParameterType.Text,
                        label: "Operator Type",
                      },
                      {
                        name: "parent_step",
                        type: ParameterType.Text,
                        label: "Parent Step",
                      },
                      {
                        name: "conditions",
                        type: ParameterType.Array,
                        label: "Conditions",
                        spec: [
                          {
                            name: "rule_name",
                            type: ParameterType.Text,
                            label: "Rule Name",
                          },
                          {
                            name: "condition_sets",
                            type: ParameterType.Array,
                            label: "Condition Sets",
                            spec: [
                              {
                                name: "lhs",
                                type: ParameterType.Text,
                                label: "LHS",
                              },
                              {
                                name: "rhs",
                                type: ParameterType.Text,
                                label: "RHS",
                              },
                              {
                                name: "comparison_type",
                                type: ParameterType.Text,
                                label: "Comparison Type",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: "input_slots",
                        type: ParameterType.Collection,
                        label: "Input Slots",
                      },
                    ],
                  },
                ],
              },
            ];
          } else if (
            operator.operator_input_settings?.fusion_type === "create_fusion"
          ) {
            return [
              {
                name: "fusion_slug",
                type: ParameterType.Text,
                label: "Fusion Slug",
              },
            ];
          }
        }

        return [
          {
            name: "html",
            type: ParameterType.Text,
            label: "HTML",
          },
          {
            name: "css",
            type: ParameterType.Text,
            label: "CSS",
          },
          {
            name: "js",
            type: ParameterType.Text,
            label: "JS",
          },
        ];
      }

      return [];
    }
    case SystemModuleType.CreateJob:
      return [
        {
          name: "job_id",
          type: ParameterType.Text,
          label: "Job ID",
        },
        {
          name: "title",
          type: ParameterType.Text,
          label: "Job Title",
        },
        {
          name: "note",
          type: ParameterType.Text,
          label: "Note",
        },
        {
          name: "html",
          type: ParameterType.Text,
          label: "HTML",
        },
        {
          name: "css",
          type: ParameterType.Text,
          label: "CSS",
        },
        {
          name: "js",
          type: ParameterType.Text,
          label: "JS",
        },
      ];
    case SystemModuleType.TranscriptionJobTrigger:
      return [
        {
          name: "jobName",
          type: ParameterType.Text,
          label: "Job Name",
        },
        {
          name: "accountId",
          type: ParameterType.Text,
          label: "Account Id",
        },
        {
          name: "results",
          type: ParameterType.Collection,
          label: "Results",
          spec: [
            {
              name: "transcripts",
              type: ParameterType.Array,
              label: "Transcripts",
              spec: [
                {
                  name: "transcript",
                  type: ParameterType.Text,
                  label: "Transcript",
                },
              ],
            },
            {
              name: "speaker_labels",
              type: ParameterType.Collection,
              label: "Speaker Labels",
              spec: [
                {
                  name: "channel_label",
                  type: ParameterType.Text,
                  label: "Channel Label",
                },
                {
                  name: "speakers",
                  type: ParameterType.UInteger,
                  label: "Speakers",
                },
                {
                  name: "segments",
                  type: ParameterType.Array,
                  label: "Segments",
                  spec: [
                    {
                      name: "start_time",
                      type: ParameterType.Text,
                      label: "Start Time",
                    },
                    {
                      name: "speaker_label",
                      type: ParameterType.Text,
                      label: "Speaker Label",
                    },
                    {
                      name: "end_time",
                      type: ParameterType.Text,
                      label: "End Time",
                    },
                    {
                      name: "items",
                      type: ParameterType.Array,
                      label: "Items",
                      spec: [
                        {
                          name: "start_time",
                          type: ParameterType.Text,
                          label: "Start Time",
                        },
                        {
                          name: "speaker_label",
                          type: ParameterType.Text,
                          label: "Speaker Label",
                        },
                        {
                          name: "end_time",
                          type: ParameterType.Text,
                          label: "End Time",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "items",
              type: ParameterType.Array,
              label: "Items",
              spec: [
                {
                  name: "start_time",
                  type: ParameterType.Text,
                  label: "Start Time",
                },
                {
                  name: "speaker_label",
                  type: ParameterType.Text,
                  label: "Speaker Label",
                },
                {
                  name: "end_time",
                  type: ParameterType.Text,
                  label: "End Time",
                },
                {
                  name: "alternatives",
                  type: ParameterType.Array,
                  label: "Alternatives",
                  spec: [
                    {
                      name: "confidence",
                      type: ParameterType.Text,
                      label: "Confidence",
                    },
                    {
                      name: "content",
                      type: ParameterType.Text,
                      label: "Content",
                    },
                  ],
                },
                {
                  name: "type",
                  type: ParameterType.Text,
                  label: "Type",
                },
              ],
            },
          ],
        },
        {
          name: "status",
          type: ParameterType.Text,
          label: "Status",
        },
      ];
    case SystemModuleType.CreateTranscriptionJob:
      return [
        {
          name: "transcriptionJobName",
          type: ParameterType.Text,
          label: "Transcription Job Name",
        },
        {
          name: "transcriptionJobStatus",
          type: ParameterType.Select,
          label: "Transcription Job Status",
        },
      ];
    case SystemModuleType.SplitAudio:
      return [
        {
          name: "job_id",
          type: ParameterType.Text,
          label: "Job ID",
        },
        {
          name: "job_status",
          type: ParameterType.Text,
          label: "Status",
        },
      ];
    case SystemModuleType.GetTemporaryS3Link:
      return [
        {
          name: "url",
          type: ParameterType.Text,
          label: "S3 Link",
        },
      ];
    case SystemModuleType.CollectSlots:
      return (
        operator.operator_input_settings?.slots?.map(
          (slot: { name: string; slug: string }) => ({
            name: slot.slug,
            type: ParameterType.Text,
            label: slot.name,
          })
        ) || []
      );
    case SystemModuleType.Search3PList:
      return [
        {
          name: "data",
          type: ParameterType.Array,
          label: "Data",
        },
      ];
    case SystemModuleType.DocumentCreate:
    case SystemModuleType.DocumentDelete:
    case SystemModuleType.DocumentEdit:
      const documentKey = `${
        SystemModuleType.DocumentCreate.split("_")[1]
      }_automation` as keyof DocumentDesign;
      const connectedDocument = documents.find(
        (document) =>
          (document[documentKey] as unknown as DocumentFusion)?.fusion_slug ===
          fusion.slug
      );
      return [
        {
          name: "data",
          type: ParameterType.Collection,
          label: "Data",
          spec: [
            {
              name: "slug",
              type: ParameterType.Text,
              label: "ID",
            },
            ...mapDocumentFieldsToInterface(connectedDocument?.fields.fields),
          ],
        },
      ];
    case SystemModuleType.Import:
    case SystemModuleType.Event:
      const inputVars = fusion?.input_vars || [];
      return [
        {
          name: "data",
          type: ParameterType.Collection,
          label: "Data",
          spec: inputVars.map((v) => ({
            name: v.slug,
            type: ParameterType.Text,
            label: v.name,
          })),
        },
      ];
    case SystemModuleType.Read:
      return [
        {
          name: "data",
          type: ParameterType.Array,
          label: "Items",
        },
        {
          name: "total_records",
          type: ParameterType.Integer,
          label: "Records Count",
        },
      ];
    case SystemModuleType.SocialMediaAutomation:
      return [
        {
          name: "data",
          type: ParameterType.Array,
          label: "Data",
        },
        {
          name: "total_records",
          type: ParameterType.Integer,
          label: "Records Count",
        },
      ];
    case SystemModuleType.Create:
    case SystemModuleType.Update:
      return [
        {
          name: "data",
          type: ParameterType.Collection,
          label: "Data",
          spec: [
            {
              name: "slug",
              type: ParameterType.Text,
              label: "ID",
            },
          ],
        },
      ];
    case SystemModuleType.AddTag:
      return [
        {
          name: "data",
          type: ParameterType.Collection,
          label: "Data",
          spec: [
            {
              name: "slug",
              type: ParameterType.Text,
              label: "ID",
            },
            {
              name: "tag_value",
              type: ParameterType.Text,
              label: "Tag",
            },
          ],
        },
      ];
    case SystemModuleType.ReadOne:
      return [
        {
          name: "data",
          type: ParameterType.Collection,
          label: "Data",
          spec: [
            {
              name: "slug",
              type: ParameterType.Text,
              label: "ID",
            },
            ...mapFieldsToInterface(
              operator.operator_input_settings?.fields || []
            ),
          ],
        },
      ];
    case SystemModuleType.Webhook:
      let moduleInterfaces: MappableParameter[] = [];
      const webhook = webhooks.find(
        (w) => w.slug === operator.operator_input_settings?.webhook_slug
      );
      moduleInterfaces = [
        {
          name: "data",
          type: ParameterType.Collection,
          label: "Data",
          spec: !!webhook?.json_passthrough
            ? undefined
            : webhook?.data_structure?.specifications,
        },
      ];
      if (webhook?.get_request_headers) {
        moduleInterfaces.push({
          name: "request_headers",
          type: ParameterType.Array,
          label: "Request Headers",
        });
      }
      if (webhook?.get_request_http_method) {
        moduleInterfaces.push({
          name: "request_method",
          type: ParameterType.Text,
          label: "Request Method",
        });
      }
      return moduleInterfaces;
    case SystemModuleType.RestClient:
      return [
        {
          name: "data",
          type: ParameterType.Collection,
          label: "Response Data",
        },
      ];
    case SystemModuleType.GetVariable:
      return operator.operator_input_settings?.name
        ? [
            {
              name: operator.operator_input_settings?.name,
              type: ParameterType.Text,
              label: operator.operator_input_settings?.name,
            },
          ]
        : [];
    case SystemModuleType.GetMultipleVariables:
      return (
        operator.operator_input_settings?.variables.map(
          (v: { value: string }) => ({
            name: v.value,
            type: ParameterType.Text,
            label: v.value,
          })
        ) || []
      );
    case SystemModuleType.SetVariable:
      return operator.operator_input_settings?.name
        ? [
            {
              name: operator.operator_input_settings?.name,
              type: ParameterType.Text,
              label: operator.operator_input_settings?.name,
            },
          ]
        : [];
    case SystemModuleType.SetMultipleVariables:
      return (
        operator.operator_input_settings?.variables?.map(
          (v: { name: string }) => ({
            name: v.name,
            type: ParameterType.Text,
            label: v.name,
          })
        ) || []
      );
    case SystemModuleType.ArrayIterator:
      return [
        {
          name: "value",
          type: ParameterType.Text,
          label: "Value",
        },
        {
          name: "index",
          type: ParameterType.Text,
          label: "Item Index",
        },
        {
          name: "array_size",
          type: ParameterType.Text,
          label: "Items Count",
        },
      ];
    case SystemModuleType.Loop:
      return [
        {
          name: "item",
          type: ParameterType.Text,
          label: "Item",
        },
        {
          name: "index",
          type: ParameterType.Text,
          label: "Item Index",
        },
        {
          name: "total_records",
          type: ParameterType.Text,
          label: "Array Size",
        },
        {
          name: "data",
          type: ParameterType.Array,
          label: "Array",
        },
      ];
    case SystemModuleType.MapChartData:
      return [
        {
          name: "labels",
          type: ParameterType.Array,
          label: "Labels",
        },
        {
          name: "data",
          type: ParameterType.Collection,
          label: "Data",
          spec:
            operator.operator_input_settings?.keys.map((v: string) => ({
              name: v,
              type: ParameterType.Text,
              label: v,
            })) || [],
        },
      ];
    case SystemModuleType.ArrayAggregator:
      return [
        {
          name: "array",
          type: ParameterType.Array,
          label: "Array",
        },
      ];
    case SystemModuleType.GetNextTask:
      return [
        {
          name: "data",
          type: ParameterType.Array,
          label: "Data",
        },
      ];
    default:
      return [];
  }
};

const OperatorModule: React.FC<{
  operator: FusionOperator;
  onTagClick?(param: Record<string, any>): void;
}> = (props) => {
  const { operator, onTagClick } = props;

  const allModules = useFusionFlowStore.useAllModules();
  const { data: authData } = useAuthenticate();
  const { data: webhooks } = useFusionWebhooks(
    operator.app === SYSTEM_NODE_APP ? SYSTEM_NODE_APP : operator.app_module,
    authData?.user?.slug
  );
  const fusion = useFusionFlowStore.useFusionDraft();
  const { data: documents } = useListItems({ modelName: "dataset-design" });

  const [interfaces, setInterfaces] = useState<MappableParameter[]>([]);

  useEffect(() => {
    if (
      operator.app === SYSTEM_NODE_APP &&
      operator.app_module !== WIDGET_START_NODE_MODULE
    ) {
      setInterfaces(
        getSystemModuleInterfaces(
          webhooks,
          fusion as any,
          documents || [],
          fusion?.flow?.nodes?.find(
            (op) => op.data.operator_slug === operator.operator_slug
          )?.data
        )
      );
    } else {
      const m = allModules?.find(
        (module) => module.slug === operator.app_module
      );
      setInterfaces((m?.interface || []) as MappableParameter[]);
    }
  }, [allModules, documents, fusion, fusion?.flow?.nodes, operator, webhooks]);

  return interfaces?.length > 0 ? (
    <>
      <Typography variant="body2">{operator.operator_title}</Typography>
      <OperatorPanel
        interfaceParams={interfaces}
        slugPrefix={operator.operator_slug}
        onTagClick={onTagClick}
      />
    </>
  ) : null;
};

const isWidgetActionPopulateFusion = (type: string) => {
  return [
    "data-list-widget-create-action-form-submit",
    "data-list-widget-edit-action-form-submit",
    "data-list-widget-create-action-form-populate",
    "data-list-widget-edit-action-form-populate",
  ].includes(type);
};

type WidgetActionFusionFieldsProps = {
  fusion: Partial<Fusion>;
  onTagClick?(param: Record<string, any>): void;
};

const WidgetActionFusionFields: React.FC<WidgetActionFusionFieldsProps> = (
  props
) => {
  const { fusion, onTagClick } = props;

  const { data: widget } = useGetItem({
    modelName: ApiModels.GuiDashboardWidget,
    slug: fusion.widget_action_form_data?.widget_slug,
  });

  const actionForms = React.useMemo(() => {
    if (fusion.fusion_type?.startsWith("data-list-widget-create")) {
      return widget?.create_forms || [];
    }

    if (fusion.fusion_type?.startsWith("data-list-widget-edit")) {
      return widget?.edit_forms || [];
    }

    return [];
  }, [widget, fusion]);

  const fields = React.useMemo(() => {
    return (
      actionForms.find((f) => f.id === fusion.widget_action_form_data?.form_id)
        ?.form_fields?.fields || []
    );
  }, [actionForms, fusion]);

  const interfaces = React.useMemo(() => {
    return fields.map((f) => ({
      name: f.slug,
      label: f.title,
      type: ParameterType.Text,
    }));
  }, [fields]);

  return (
    <>
      <Typography variant="body2">Variable Popup</Typography>
      <OperatorPanel
        interfaceParams={interfaces}
        slugPrefix="chart_inputs"
        onTagClick={onTagClick}
      />
    </>
  );
};

type ImportFusionFieldsProps = {
  fusion: Partial<Fusion>;
  onTagClick?(param: Record<string, any>): void;
};

const ImportFusionFields: React.FC<ImportFusionFieldsProps> = (props) => {
  const { fusion, onTagClick } = props;

  const [interfaces, setInterfaces] = useState<MappableParameter[]>([]);

  useEffect(() => {
    const fusionMeta = fusion?.meta_data || {};
    if (fusionMeta.import_type === "image") {
      setInterfaces([
        {
          label: "Image URL",
          name: "image_url",
          type: ParameterType.Text,
        },
        {
          label: "Image Name",
          name: "image_filename",
          type: ParameterType.Text,
        },
        {
          label: "Image Data",
          name: "image_file",
          type: ParameterType.Text,
        },
      ]);
    } else if (fusionMeta.import_type === "word_doc") {
      setInterfaces([
        {
          label: "Doc URL",
          name: "doc_url",
          type: ParameterType.Text,
        },
        {
          label: "Doc Name",
          name: "doc_filename",
          type: ParameterType.Text,
        },
        {
          label: "Doc Data",
          name: "doc_file",
          type: ParameterType.Text,
        },
      ]);
    } else if (fusionMeta.import_type === "csv") {
      setInterfaces([
        {
          name: "data",
          label: "Data",
          type: ParameterType.Collection,
          spec:
            (fusionMeta.record_keys as string[]).map((key) => ({
              label: key,
              name: key,
              type: ParameterType.Text,
            })) || [],
        },
      ]);
    } else if (fusionMeta.import_type === "audio") {
      setInterfaces([
        {
          label: "Audio URL",
          name: "audio_url",
          type: ParameterType.Text,
        },
        {
          label: "Audio Name",
          name: "audio_filename",
          type: ParameterType.Text,
        },
        {
          label: "Audio Data",
          name: "audio_file",
          type: ParameterType.Text,
        },
      ]);
    } else if (fusionMeta.import_type === "video") {
      setInterfaces([
        {
          label: "Video URL",
          name: "video_url",
          type: ParameterType.Text,
        },
        {
          label: "Video Name",
          name: "video_filename",
          type: ParameterType.Text,
        },
        {
          label: "Video Data",
          name: "video_file",
          type: ParameterType.Text,
        },
      ]);
    }
  }, [fusion]);

  return (
    <>
      <Typography variant="body2">Popup Variables</Typography>
      <OperatorPanel
        interfaceParams={interfaces}
        slugPrefix="popup_variables"
        onTagClick={onTagClick}
      />
    </>
  );
};

type SkillFusionFieldsProps = {
  fusion: Partial<Fusion>;
  onTagClick?(param: Record<string, any>): void;
};

const SkillFusionFields: React.FC<SkillFusionFieldsProps> = (props) => {
  const { fusion, onTagClick } = props;

  const skillUserVars = fusion?.skill_user_fields?.fields || [];

  const skillUserVarsInterfaces = skillUserVars.map((variable) => ({
    name: variable.slug!,
    type: variable.type!,
    label: variable.title!,
  }));

  const skillSessionVars = fusion?.skill_session_fields?.fields || [];

  const skillSessionVarsInterfaces = skillSessionVars.map((variable) => ({
    name: variable.slug!,
    type: variable.type!,
    label: variable.title!,
  }));

  return (
    <>
      <Typography variant="body2">Popup Variables</Typography>
      <OperatorPanel
        interfaceParams={[
          {
            name: "skill_id",
            type: ParameterType.Text,
            label: "Skill ID",
          },
          {
            name: "skill_session_id",
            type: ParameterType.Text,
            label: "Skill Session ID",
          },
        ]}
        slugPrefix="popup_variables"
        onTagClick={onTagClick}
      />
      <Typography variant="body2">Skill User Fields</Typography>
      <OperatorPanel
        interfaceParams={skillUserVarsInterfaces}
        slugPrefix="skill_user_variables"
        onTagClick={onTagClick}
      />
      <Typography variant="body2">Skill Session Fields</Typography>
      <OperatorPanel
        interfaceParams={skillSessionVarsInterfaces}
        slugPrefix="skill_session_variables"
        onTagClick={onTagClick}
      />
    </>
  );
};

const OperatorsTab: React.FC<{
  onTagClick?(param: Record<string, any>): void;
  prevOperators: FusionOperator[];
}> = (props) => {
  const { onTagClick, prevOperators } = props;
  const fusion = useFusionFlowStore.useFusionDraft();

  const inputVars = fusion?.fusion_fields?.fields || [];

  const inputVarsInterfaces = inputVars.map((variable) => ({
    name: variable.slug!,
    type: variable.type!,
    label: variable.title!,
  }));

  return (
    <div className="operators-container">
      {isWidgetFusion(fusion?.fusion_type || "") ? (
        <>
          <Typography variant="body2">Widget Filters</Typography>
          <OperatorPanel
            interfaceParams={[
              {
                name: "selected_tab",
                label: "Selected Tab",
                type: ParameterType.Text,
              },
            ]}
            slugPrefix="chart_inputs"
            onTagClick={onTagClick}
          />
        </>
      ) : null}
      {isWidgetActionPopulateFusion(fusion?.fusion_type || "") ? (
        <WidgetActionFusionFields
          fusion={fusion as Fusion}
          onTagClick={onTagClick}
        />
      ) : null}
      {fusion?.fusion_type === "import" ? (
        <ImportFusionFields fusion={fusion as Fusion} onTagClick={onTagClick} />
      ) : null}
      {fusion?.fusion_type === FusionType.Skills ? (
        <SkillFusionFields fusion={fusion as Fusion} onTagClick={onTagClick} />
      ) : null}
      {inputVars.length > 0 ? (
        <>
          <Typography variant="body2">Fusion Input Variables</Typography>
          <OperatorPanel
            interfaceParams={inputVarsInterfaces}
            slugPrefix="sessionInitVars"
            onTagClick={onTagClick}
          />
        </>
      ) : null}
      {prevOperators?.map((operator) => {
        return <OperatorModule operator={operator} onTagClick={onTagClick} />;
      })}
    </div>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ParamMapper: React.FC<{
  onClose?(): void;
  onTagClick: (func: GFMLFunction) => void;
  onOperatorClick?(param: Record<string, any>): void;
}> = (props) => {
  const { onClose, onTagClick, onOperatorClick } = props;

  const { data: functionGroups } = useGFMLFunctionGroups();
  // const selectedNode = useAppSelector((state) => state.fusionOperator.selected);
  // const selectedEdge = useAppSelector(
  //   (state) => state.fusionOperator.selectedEdge
  // );
  const selectedNode = useFusionFlowStore.useSelectedNode();
  const selectedEdge = useFusionFlowStore.useSelectedEdge();
  const fusionDraft = useFusionFlowStore.useFusionDraft();
  const [prevOperators, setPrevOperators] = useState<FusionOperator[]>([]);
  const [value, setValue] = useState(1);

  useEffect(() => {
    let operator: Partial<FusionOperator> | undefined;
    if (selectedNode) {
      operator = selectedNode?.data;
    } else if (selectedEdge) {
      operator = fusionDraft?.flow?.nodes?.find(
        (n) => n.id === selectedEdge.target
      )?.data;
    }
    const incoming = getIncomingOperators(
      operator,
      fusionDraft?.fusion_operators
    );
    if (selectedNode?.data.app_module === "chart-node") {
      const leafNodes =
        fusionDraft?.fusion_operators?.filter(
          (op) =>
            !fusionDraft?.fusion_operators?.find(
              (o) => o.parent_operator_slug === op.operator_slug
            )
        ) || [];
      incoming.push(...leafNodes);
    }
    setPrevOperators(incoming);
  }, [selectedNode, selectedEdge, fusionDraft]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <ModalHeader
        direction="row"
        justifyContent="space-between"
        px={2.5}
        alignItems="center"
      >
        <StyledTab value={value} onChange={handleChange}>
          <Tab label="Operators" value={1} disableRipple />
          <Tab label="Functions" value={2} disableRipple />
        </StyledTab>
        <IconButton size="small" onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </ModalHeader>

      {/* <TabPanel value={value} index={1}>
        <Scrollbar>
          <OperatorsTab
            prevOperators={prevOperators}
            onTagClick={onOperatorClick}
          />
        </Scrollbar>
      </TabPanel> */}
      {/* <TabPanel value={value} index={2}> */}
      {/* </TabPanel> */}
      <Scrollbar autoHeight autoHeightMax={400}>
        <Box sx={{ minHeight: "300px" }}>
          {value === 2 && (
            <Stack p={2.5} gap={2.5}>
              {functionGroups?.map((group) => {
                return group.function_group_name ? (
                  <Stack gap={1}>
                    <Stack direction="row" gap={1.25} alignItems="center">
                      <SettingsOutlined />
                      <Typography variant="body2">
                        {group.function_group_name}
                      </Typography>{" "}
                      {/**<CaretDownOutlined /> */}
                    </Stack>
                    <FunctionPanel
                      groups={group.function_group_sub_groups}
                      onTagClick={onTagClick}
                    />
                  </Stack>
                ) : null;
              })}
            </Stack>
          )}
          {value === 1 && (
            <Stack p={2.5} gap={2.5}>
              <OperatorsTab
                prevOperators={prevOperators}
                onTagClick={onOperatorClick}
              />
            </Stack>
          )}
        </Box>
      </Scrollbar>
    </Box>
  );
};

export default ParamMapper;
