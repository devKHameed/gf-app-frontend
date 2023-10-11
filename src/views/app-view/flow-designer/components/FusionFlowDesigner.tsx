import AddOutlined from "@mui/icons-material/AddOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import {
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  menuClasses,
  MenuItem,
  menuItemClasses,
  rgbToHex,
  styled,
  useTheme,
} from "@mui/material";
import { FlowEdgeType, FlowNodeType } from "constants/index";
import { AnimatePresence } from "framer-motion";
import use3pApps from "queries/3p-app/use3pApps";
import useFusion from "queries/fusion/useFusion";
import useUpdateItem from "queries/useUpdateItem";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useParams } from "react-router-dom";
import ReactFlow, {
  addEdge,
  Edge,
  Node,
  NodePositionChange,
  NodeTypes,
  OnConnect,
  useEdgesState,
  useNodesState,
  useReactFlow,
  Viewport,
} from "reactflow";
import { v4 } from "uuid";
import ConnectionNode from "./ConnectionNode";
import FlowConnectionLine from "./FlowConnectionLine";
import FlowEdge from "./FlowEdge";
import FlowNode from "./FlowNode";
import NewNode, { OnAppSelect } from "./NewNode";

import { Edit } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { SYSTEM_NODE_APP } from "constants/Fusion";
import { ModuleType } from "enums/3pApp";
import { SystemModuleType } from "enums/Fusion";
import { capitalize } from "lodash";
import cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";
import ThreePAppAction from "models/ThreePAppAction";
import moment from "moment";
import { ApiModels } from "queries/apiModelMapping";
import "reactflow/dist/style.css";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { isWidgetFusion } from "utils";

const ContextMenu = styled(Menu)(({ theme }) => ({
  [`.${menuClasses.paper}`]: {
    background: "#fff",
    color: "#000",
  },

  [`.${menuClasses.list}`]: {
    padding: 0,
  },

  [`.${menuItemClasses.root}:hover`]: {
    background: theme.palette.primary.main,
    color: "#fff",
  },
}));

const edgesTypes = {
  [FlowEdgeType.flowEdge]: FlowEdge,
};

const createNode = (operator: FusionOperator) => {
  return {
    id: operator.operator_slug || operator.slug!,
    type: FlowNodeType.flowNode,
    data: operator,
    position: { x: 100, y: 100 },
  };
};

const createEdge = (source: FusionOperator, target: FusionOperator) => {
  return {
    id: `e${source?.operator_slug}-${target.operator_slug || target.slug}`,
    source: `${source?.operator_slug}`,
    target: `${target.operator_slug || target.slug}`,
    data: {
      source,
      target,
      color: source?.operator_color,
    },
    type: FlowEdgeType.flowEdge,
  };
};

type Elements = (Edge | Node)[];

export const parseFusionOperators = (operators: FusionOperator[]): Elements => {
  const elements: Elements = [];
  const { startNodeOperator, restOperators } = operators.reduce<{
    startNodeOperator?: FusionOperator;
    restOperators: FusionOperator[];
  }>(
    (acc, cur) => {
      if (cur.is_start_node) {
        acc.startNodeOperator = cur;
      } else {
        acc.restOperators.push(cur);
      }
      return acc;
    },
    { startNodeOperator: undefined, restOperators: [] }
  );

  const tempOperators = [...restOperators];

  if (startNodeOperator) {
    tempOperators.unshift(startNodeOperator);
  }

  tempOperators.forEach((op) => {
    elements.push(createNode(op));
  });

  operators.forEach((op, idx, arr) => {
    const parentOp = arr.find(
      (o) => o.operator_slug === op.parent_operator_slug
    );
    if (parentOp) {
      elements.push(createEdge(parentOp, op));
    }
  });

  return elements;
};

export type FlowDesignerRef = {
  saveFusion(): void;
};

type Props = {};

const FusionFlowDesigner = React.forwardRef<FlowDesignerRef | undefined, Props>(
  (props, ref) => {
    const { fusionSlug } = useParams<{ fusionSlug: string }>();

    const theme = useTheme();

    const nodePositionChangesRef = useRef<{
      dragging: boolean;
      changes: NodePositionChange[];
    }>({ dragging: false, changes: [] });
    const containerRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<Node<FusionOperator>[]>([]);
    const edgesRef = useRef<Edge[]>([]);
    const positionRef = useRef({ x: 0, y: 0 });
    const contextMenuRef =
      useRef<{ type: string; node?: Node<FusionOperator> }>();

    const queryClient = useQueryClient();
    const { data: fusion } = useFusion(fusionSlug);
    const { mutate: updateFusion } = useUpdateItem({
      modelName: ApiModels.Fusion,
    });
    const { data: apps } = use3pApps();

    const setEditConditionOperatorSlug =
      useFusionFlowStore.useSetEditConditionOperatorSlug();
    const updateNodePositions = useFusionFlowStore.useUpdateNodePositions();
    const selectedNode = useFusionFlowStore.useSelectedNode();
    const appendAllModules = useFusionFlowStore.useAppendAllModules();
    const fusionDraft = useFusionFlowStore.useFusionDraft();
    const setFusionDraft = useFusionFlowStore.useSetFusionDraft();
    const updateFlowNodes = useFusionFlowStore.useUpdateFlowNodes();
    const updateFlowEdges = useFusionFlowStore.useUpdateFlowEdges();
    const layoutNodes = useFusionFlowStore.useLayoutNodes();
    const layout = useFusionFlowStore.useLayout();

    const [flowKey, setFlowKey] = useState("1");

    const flowRef = useReactFlow();
    const [nodesState, setNodes, onNodesChange] = useNodesState([]);
    const [edgesState, setEdges, onEdgesChange] = useEdgesState([]);

    const [contextMenuOpen, setContextMenuOpen] = useState(false);

    const viewPortRef = useRef<Viewport | null>(null);
    // const chartNodeRef = useRef<Node<Partial<FusionOperator>> | null>(null);

    useEffect(() => {
      if (fusion) {
        setFusionDraft(fusion);
      }
    }, [fusion?.slug]);

    useEffect(() => {
      if (selectedNode) {
        viewPortRef.current = flowRef.getViewport();
        flowRef.setCenter(
          selectedNode.position.x + (selectedNode.width || 0),
          selectedNode.position.y + (selectedNode.height || 0),
          {
            zoom: 1.1,
            duration: 500,
          }
        );
      } else {
        if (viewPortRef.current) {
          flowRef.setViewport(viewPortRef.current, { duration: 500 });
        }
      }
    }, [flowRef, selectedNode]);

    useEffect(() => {
      if (layout !== "free") {
        layoutNodes();
      }
    }, [layout]);

    const onConnect: OnConnect = useCallback(
      (params) => {
        // console.log({ params, nodes: nodesRef.current });
        const source = nodesRef.current.find((n) => n.id === params.source);
        updateFlowNodes((nds) =>
          nds.map((n) =>
            n.id === params.target
              ? {
                  ...n,
                  position: {
                    x: source?.position.x || n.position.x,
                    y: source?.position.y
                      ? source.position.y + 200
                      : n.position.y,
                  },
                  data: {
                    ...n.data,
                    parent_operator_slug: source?.data.operator_slug,
                  },
                }
              : n
          )
        );
        updateFlowEdges((eds) =>
          addEdge(
            {
              ...params,
              type: FlowEdgeType.flowEdge,
              id: `e${
                nodesRef.current?.find((n) => n.id === params.source)?.data
                  ?.operator_slug
              }-${
                nodesRef.current?.find((n) => n.id === params.target)?.data
                  ?.operator_slug
              }`,
              data: {
                color:
                  apps?.find(
                    (a) =>
                      nodesRef.current?.find((n) => n.id === params.target)
                        ?.data?.app === a.slug
                  )?.app_color || theme.palette.primary.main,
              },
            },
            eds
          )
        );
        setFlowKey(`${v4()}`);
        layoutNodes();
        const viewport = flowRef.getViewport();
        setTimeout(() => {
          flowRef.setViewport(viewport);
        }, Infinity - 1);
      },
      [
        apps,
        flowRef,
        layoutNodes,
        theme.palette.primary.main,
        updateFlowEdges,
        updateFlowNodes,
      ]
    );

    const addNewNodeAt = useCallback(
      (position: { x: number; y: number }) => {
        const newNode: Node<Partial<FusionOperator>> = {
          id: v4(),
          type: FlowNodeType.newNode,
          position,
          data: {},
        };

        updateFlowNodes((nds) => {
          if (nds.length === 0) {
            newNode.data.is_start_node = true;
          }

          return nds.concat(newNode);
        });
      },
      [updateFlowNodes]
    );

    const handleAddParentNode = useCallback(() => {
      if (
        !contextMenuRef.current?.node ||
        contextMenuRef.current?.node.data.is_start_node
      ) {
        return;
      }

      const currentNode = contextMenuRef.current.node;

      const parent = nodesRef.current.find(
        (n) => n.data.operator_slug === currentNode.data.parent_operator_slug
      );

      const newNodeOpSlug = v4();
      const newNodeId = v4();

      updateFlowNodes((nds) => {
        let newNodes = nds.concat({
          id: newNodeId,
          type: FlowNodeType.newNode,
          position: currentNode.position,
          data: {
            parent_operator_slug: parent?.data.operator_slug,
            parent_fusion_id: fusionSlug,
            operator_slug: newNodeOpSlug,
            created_at: moment.utc().format(),
            in_loop: currentNode.data.in_loop,
            loop_data: currentNode.data.loop_data,
          },
          dragHandle: ".drag-handle",
          draggable: true,
        });

        newNodes = newNodes.map((n) => {
          if (n.id === currentNode.id) {
            return {
              ...n,
              position: {
                x: currentNode.position.x,
                y: currentNode.position.y + 200,
              },
              data: {
                ...n.data,
                parent_operator_slug: newNodeOpSlug,
              },
            };
          }

          return n;
        });

        return newNodes;
      });

      updateFlowEdges((eds) => {
        const newEdges = eds.map((e) => {
          if (e.source === parent?.id && e.target === currentNode.id) {
            return {
              ...e,
              target: newNodeId,
              id: `e${parent?.data.operator_slug}-${newNodeOpSlug}`,
            };
          }

          return e;
        });

        return newEdges.concat([
          {
            id: `e${newNodeOpSlug}-${currentNode.data.operator_slug}`,
            type: FlowEdgeType.flowEdge,
            source: newNodeId,
            target: currentNode.id,
            data: {
              color: rgbToHex(theme.palette.primary.main).slice(0, -2),
              source_slug: newNodeOpSlug,
              target_slug: currentNode.data.operator_slug,
            },
          },
        ]);
      });
    }, [fusionSlug]);

    const handleDeleteNode = useCallback(() => {
      if (!contextMenuRef.current?.node) {
        return;
      }

      const { node } = contextMenuRef.current;
      const parentNode = nodesRef.current.find(
        (n) => n.data.operator_slug === node.data.parent_operator_slug
      );
      updateFlowNodes((nds) => {
        const nodes = nds
          .filter((n) => n.id !== node.id)
          .map((n) =>
            n.data.parent_operator_slug === node.data.operator_slug
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    parent_operator_slug: parentNode?.data.operator_slug,
                  },
                }
              : n
          );
        return nodes;
      });
      updateFlowEdges((eds) => {
        const edges = eds
          .filter((e) => e.target !== node.id)
          .map((e) =>
            e.source === node.id ? { ...e, source: parentNode?.id || "" } : e
          );
        return edges;
      });
      layoutNodes();
    }, [layoutNodes, updateFlowEdges, updateFlowNodes]);

    const handleAddNewNode = useCallback(() => {
      if (!positionRef.current) {
        return;
      }

      const { top, left } = containerRef.current?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };

      const p = flowRef.project({
        x: positionRef.current.x - left - 50,
        y: positionRef.current.y - top - 50,
      });
      // console.log({
      //   p,
      //   prev: { x: positionRef.current.x, y: positionRef.current.y },
      // });

      addNewNodeAt(p);
    }, [addNewNodeAt, flowRef]);

    const handleEditOperatorConditions = useCallback(() => {
      if (!contextMenuRef.current?.node) {
        return;
      }

      setEditConditionOperatorSlug(
        contextMenuRef.current.node.data.operator_slug
      );
    }, []);

    const contextMenuItems = useMemo(
      () => ({
        "flow-node-menu": [
          {
            label: "Add Operator",
            icon: <AddOutlined />,
            onClick: handleAddParentNode,
          },
          {
            label: "Edit Conditions",
            icon: <Edit />,
            onClick: handleEditOperatorConditions,
          },
          {
            label: "Delete Module",
            icon: <DeleteOutline />,
            onClick: handleDeleteNode,
          },
        ],
        "pane-menu": [
          ...(layout === "free" || nodesRef.current.length === 0
            ? [
                {
                  label: "Add Module",
                  icon: <AddOutlined />,
                  onClick: handleAddNewNode,
                },
              ]
            : []),
        ],
      }),
      [handleDeleteNode, handleAddNewNode, layout]
    );

    useEffect(() => {
      if (fusionDraft?.flow) {
        // console.log(
        //   "🚀 ~ file: FusionFlowDesigner.tsx:472 ~ useEffect ~ fusionDraft:",
        //   fusionDraft
        // );
        const edges = fusionDraft.flow.edges;
        const nodes = fusionDraft.flow.nodes.map((n) => ({
          ...n,
          dragHandle: ".drag-handle",
        }));

        const nodesEdges = nodes.reduce<Record<string, Edge[]>>((acc, node) => {
          const nodeEdges = edges.filter((edge) => edge.source === node.id);
          const childNodes = nodeEdges
            .map((edge) => nodes.find((n) => n.id === edge.target))
            .filter(Boolean);
          const leftEdges = childNodes
            .filter(
              (n) => Math.round(n.position.x) < Math.round(node.position.x)
            )
            .sort((a, b) => (a.position.x > b.position.x ? 1 : -1))
            .map((n) => nodeEdges.find((e) => e.target === n.id))
            .filter(Boolean);
          const rightEdges = childNodes
            .filter(
              (n) => Math.round(n.position.x) > Math.round(node.position.x)
            )
            .sort((a, b) => (a.position.x < b.position.x ? 1 : -1))
            .map((n) => nodeEdges.find((e) => e.target === n.id))
            .filter(Boolean);
          const alignedEdges = childNodes
            .filter(
              (n) => Math.round(n.position.x) === Math.round(node.position.x)
            )
            .map((n) => nodeEdges.find((e) => e.target === n.id))
            .filter(Boolean);

          acc[node.id] = [...leftEdges, ...alignedEdges, ...rightEdges];
          return acc;
        }, {});
        const finalEdges = Object.values(nodesEdges).reduce(
          (acc, edges) => acc.concat(edges),
          []
        );

        setNodes(nodes);
        setEdges(finalEdges);
      }
    }, [fusionDraft]);

    useEffect(() => {
      nodesRef.current = nodesState || [];
    }, [nodesState]);

    useEffect(() => {
      edgesRef.current = edgesState || [];
    }, [edgesState]);

    useEffect(() => {
      if (fusion?.flow) {
        const apps = new Set(
          fusion.fusion_operators?.map((op) => op.app) || []
        );
        apps.forEach((app) => {
          if (app === SYSTEM_NODE_APP) {
            return;
          }
          queryClient
            .ensureQueryData({
              queryKey: ["3p-app-action", app],
              queryFn: async () => {
                const res = await ThreePAppAction.list(app, {
                  is_global: true,
                });
                return res.data;
              },
            })
            .then((res) => {
              appendAllModules(res);
            });
        });
        setFusionDraft({
          ...fusion,
          flow: {
            ...fusion.flow,
            nodes: fusion.flow.nodes.map((n) => ({
              ...n,
              draggable: layout === "free" ? true : false,
            })),
          },
        });
        layoutNodes();
        const viewport = { x: 300, y: 200, zoom: 1 };
        if (fusion.flow?.viewport) {
          viewport.x = fusion.flow.viewport.x;
          viewport.y = fusion.flow.viewport.y;
        }
        flowRef.setViewport(viewport);
      }
    }, [fusion?.slug]);

    const saveFusion = () => {
      const flow = flowRef.toObject();
      const flowNodes = flow.nodes.filter(
        (n) => n.type !== FlowNodeType.newNode
      );

      updateFusion({
        slug: fusionSlug!,
        data: {
          flow: {
            ...flow,
            nodes: flowNodes,
          },
          fusion_operators: flowNodes.map((n) => n.data),
        },
      });
    };

    useHotkeys("ctrl+s", (e) => {
      e.preventDefault();
      saveFusion();
    });

    useImperativeHandle(ref, () => ({
      saveFusion,
    }));

    const onDoubleClick = useCallback(
      (e: React.MouseEvent<Element, MouseEvent>) => {
        if (!containerRef.current || layout !== "free") {
          return;
        }
        const { top, left } = containerRef.current.getBoundingClientRect();
        addNewNodeAt(
          // we are removing the half of the node width (75) to center the new node
          flowRef.project({
            x: e.clientX - left - 50,
            y: e.clientY - top - 50,
          })
        );
      },
      [addNewNodeAt, flowRef, layout]
    );

    const addNode: OnAppSelect = useCallback(
      ({ app, appModule }, id) => {
        const sourceId = edgesRef.current.find((e) => e.target === id)?.source;
        const sourceNode = nodesRef.current.find((n) => n.id === sourceId);
        if (app) {
          appendAllModules([appModule]);
        }
        const aModule = (() => {
          if (fusion?.fusion_type?.startsWith("data-list-widget")) {
            const chunks = fusion.fusion_type.split("-");
            chunks.pop();
            return [...chunks, "node"].join("-");
          }

          return "chart-node";
        })();
        const {
          slug: appSlug,
          label,
          id: appId,
        } = app === null
          ? {
              slug: "system",
              label: appModule.label,
              id: "system",
            }
          : {
              slug: app.slug,
              label: appModule.label,
              id: app.id,
            };
        const slug = `${label
          ?.split(/\s|\./)
          ?.map((w) => w.toLowerCase())
          ?.join("_")}_${v4()}`;
        updateFlowNodes((nds) => {
          const operatorCount =
            nds?.filter((n) => n.data.app === appSlug).length || 0;
          const sourceChildren = nds.filter(
            (n) =>
              n.data.parent_operator_slug === sourceNode?.data.operator_slug
          );
          const chartChild = sourceChildren.find(
            (n) => n.data.app_module === aModule
          );
          const oldSlug = nds.find((n) => n.id === id)?.data.operator_slug;
          let updatedNodes = nds.map((n) =>
            n.id === id
              ? {
                  ...n,
                  type: FlowNodeType.flowNode,
                  dragHandle: ".drag-handle",
                  data: {
                    ...n.data,
                    app: appSlug,
                    app_id: appId,
                    app_module: appModule.slug,
                    operator_slug: slug,
                    operator_title: `${label} ${operatorCount + 1}`,
                    operator_subtitle: app === null ? "System" : app.app_label,
                    parent_fusion_id: fusionSlug,
                    total_credit: 1,
                    module_type: appModule.module_type,
                    ...(sourceNode
                      ? {
                          parent_operator_id: sourceNode.data.id,
                          parent_operator_slug: sourceNode.data.operator_slug,
                        }
                      : {}),
                  },
                }
              : n
          );

          const updatedNewNode = updatedNodes.find((n) => n.id === id);

          if (appModule.slug === SystemModuleType.Loop && updatedNewNode) {
            updatedNodes.push({
              id: v4(),
              type: FlowNodeType.flowNode,
              position: {
                x: updatedNewNode.position.x,
                y: updatedNewNode.position.y + 220,
              },
              dragHandle: ".drag-handle",
              draggable: true,
              data: {
                parent_operator_slug: updatedNewNode.data.operator_slug,
                parent_operator_id: updatedNewNode.data.id,
                parent_fusion_id: fusionSlug,
                operator_slug: `${slug}-end`,
                created_at: moment.utc().format(),
                app: appSlug,
                app_id: appId,
                app_module: SystemModuleType.LoopEnd,
                operator_title: `${label} ${operatorCount + 1} End`,
                operator_subtitle: app === null ? "System" : app.app_label,
                total_credit: 1,
                module_type: ModuleType.Action,
                operator_input_settings: {
                  loop_slug: updatedNewNode.data.operator_slug,
                  loop_node_id: updatedNewNode.id,
                },
              },
            });
          }
          // console.log(
          //   "🚀 ~ file: FusionFlowDesigner.tsx:733 ~ updateFlowNodes ~ updatedNewNode:",
          //   updatedNewNode
          // );

          // console.log({ updatedNodes, oldSlug });

          // if (updatedNewNode?.data.in_loop) {
          updatedNodes = updatedNodes.map((n) => {
            if (
              n.data.parent_operator_slug &&
              oldSlug &&
              n.data.parent_operator_slug === oldSlug
            ) {
              // console.log(
              //   "🚀 ~ file: FusionFlowDesigner.tsx:737 ~ updatedNodes=updatedNodes.map ~ n:",
              //   n
              // );
              if (appModule.slug === SystemModuleType.Loop) {
                return {
                  ...n,
                  data: { ...n.data, parent_operator_slug: `${slug}-end` },
                };
              }
              return {
                ...n,
                data: { ...n.data, parent_operator_slug: slug },
              };
            }

            return n;
          });
          // }

          if (isWidgetFusion(fusion?.fusion_type || "")) {
            const updatedNewNode = updatedNodes.find((n) => n.id === id);
            if (chartChild) {
              updatedNodes = updatedNodes.map((un) => {
                if (un.id === chartChild.id) {
                  return {
                    ...un,
                    data: {
                      ...un.data,
                      parent_operator_slug: updatedNewNode?.data.operator_slug,
                    },
                  };
                }

                return un;
              });
            } else {
              const chartNode = updatedNodes.find(
                (n) => n.data.app_module === aModule
              ) || {
                height: 100,
                width: 100,
                id: v4(),
                type: "flow-node",
                position: { x: 300, y: 370 },
                data: {
                  app: "system",
                  app_id: "system",
                  app_module: "chart-node",
                  operator_slug: v4(),
                  operator_subtitle: "System Module",
                  is_start_node: false,
                  parent_fusion_id: fusion?.fusion_slug,
                  parent_operator_slug: updatedNewNode?.data.operator_slug,
                  total_credit: 1,
                  operator_title: `${fusion?.fusion_type
                    ?.split("-")
                    .map((s) => capitalize(s))
                    .join(" ")} Widget`,
                },
              };
              const newChartNode = cloneDeep(chartNode);
              newChartNode.id = v4();
              newChartNode.data.operator_input_settings = {};
              newChartNode.data.operator_slug = v4();
              newChartNode.data.parent_operator_slug =
                updatedNewNode?.data.operator_slug;

              newChartNode.position.x = updatedNewNode?.position.x || 0;
              newChartNode.position.y = (updatedNewNode?.position.y || 0) + 220;
              if (newChartNode.positionAbsolute) {
                newChartNode.positionAbsolute.x =
                  updatedNewNode?.positionAbsolute?.x || 0;
                newChartNode.positionAbsolute.y =
                  (updatedNewNode?.positionAbsolute?.y || 0) + 220;
              }

              updatedNodes.push(newChartNode);
            }
          }

          return updatedNodes;
        });
        updateFlowEdges((eds, nodes) => {
          // const sourceChildren = nodes.filter(
          //   (n) => n.data.parent_operator_slug === sourceNode?.data.operator_slug
          // );
          // const chartChild = sourceChildren.find(
          //   (n) => n.data.app_module === "chart-node"
          // );
          const addedNode = nodes.find((n) => n.id === id);
          const chartNode = nodes.find(
            (n) => n.data.parent_operator_slug === addedNode?.data.operator_slug
          );

          // const inLoop = addedNode?.data.in_loop;

          let updatedEdges = eds.map((e) => {
            return e.source === sourceNode?.id && e.target === id
              ? {
                  ...e,
                  id: `e${sourceNode.data.operator_slug}-${slug}`,
                  data: {
                    ...e.data,
                    color:
                      app?.app_color ||
                      rgbToHex(theme.palette.primary.main).slice(0, -2),
                  },
                }
              : e;
          });

          if (addedNode?.data.app_module === SystemModuleType.Loop) {
            const loopEnd = nodes.find(
              (n) =>
                n.data.app_module === SystemModuleType.LoopEnd &&
                n.data.operator_input_settings?.loop_slug ===
                  addedNode?.data.operator_slug
            );

            if (loopEnd) {
              updatedEdges = eds.map((e) => {
                const target = nodes.find((n) => n.id === e.target);
                return e.source === id && target
                  ? {
                      ...e,
                      id: `e${loopEnd.data.operator_slug}-${target.data.operator_slug}`,
                      source: loopEnd.id,
                      data: {
                        ...e.data,
                        color:
                          app?.app_color ||
                          rgbToHex(theme.palette.primary.main).slice(0, -2),
                      },
                    }
                  : e;
              });
              updatedEdges.push({
                id: `e${addedNode.data.operator_slug}-${loopEnd.data.operator_slug}-loop_back_edge`,
                type: FlowEdgeType.flowEdge,
                source: addedNode.id,
                target: loopEnd.id,
                data: {
                  color: rgbToHex(theme.palette.primary.main).slice(0, -2),
                  source_slug: addedNode.data.operator_slug,
                  target_slug: loopEnd.data.operator_slug,
                },
              });
            }
          }

          if (addedNode && chartNode) {
            updatedEdges = updatedEdges.filter(
              (e) => e.target !== chartNode.id
            );
            updatedEdges.push({
              id: `e${addedNode.id}-${chartNode.id}`,
              data: {
                type: "chart-edge",
              },
              source: addedNode.id,
              target: chartNode.id,
              type: "flow-edge",
            });
          }

          return updatedEdges;
        });

        layoutNodes();

        // setTimeout(() => {
        //   layoutNodes();
        //   setKey(v4());
        // }, 1000);
      },
      [fusionSlug, updateFlowEdges, updateFlowNodes, fusion]
    );

    const isInLoop = (operator?: FusionOperator) => {
      if (!operator || operator.app_module === SystemModuleType.LoopEnd) {
        return false;
      }

      if (operator.app_module === SystemModuleType.Loop) {
        return true;
      }

      return !!operator.in_loop;
    };

    const appendNewNode = useCallback(
      (sourceNode: Node<FusionOperator>, branchOut = true) => {
        const id = v4();
        const opSlug = v4();
        const inLoop = isInLoop(sourceNode.data);
        if (inLoop) {
          const sourceChild = nodesRef.current.find(
            (op) =>
              op.data.parent_operator_slug === sourceNode.data.operator_slug
          );
          if (
            sourceChild?.data.app_module === SystemModuleType.LoopEnd ||
            !branchOut
          ) {
            updateFlowNodes((nds) => {
              const loopStartSlug =
                sourceNode.data.app_module === SystemModuleType.Loop
                  ? sourceNode.data.operator_slug
                  : sourceNode.data.loop_data?.loop_start_slug;
              const loopEndSlug = nds.find(
                (n) =>
                  n.data.app_module === SystemModuleType.LoopEnd &&
                  n.data.operator_input_settings?.loop_slug === loopStartSlug
              )?.data.operator_slug;
              let newNodes = nds.map((n) => {
                if (
                  n.data.parent_operator_slug === sourceNode.data.operator_slug
                ) {
                  return {
                    ...n,
                    data: { ...n.data, parent_operator_slug: opSlug },
                  };
                }

                return n;
              });
              newNodes = newNodes.concat({
                id,
                type: FlowNodeType.newNode,
                position: {
                  ...sourceNode.position,
                  y: sourceNode.position.y + 220,
                },
                data: {
                  parent_operator_slug: sourceNode.data.operator_slug,
                  parent_fusion_id: fusionSlug,
                  operator_slug: opSlug,
                  created_at: moment.utc().format(),
                  in_loop: true,
                  loop_data: {
                    loop_end_slug: loopEndSlug!,
                    loop_start_slug: loopStartSlug!,
                  },
                },
                dragHandle: ".drag-handle",
                draggable: true,
              });

              return newNodes;
            });

            updateFlowEdges((eds) => {
              let newEdges = eds.map((e) => {
                if (e.source === sourceNode.id) {
                  return {
                    ...e,
                    source: id,
                    id: `e${opSlug}-${e.data.target_slug}`,
                  };
                }

                return e;
              });
              newEdges = newEdges.concat([
                {
                  id: `e${sourceNode.data.operator_slug}-${opSlug}`,
                  type: FlowEdgeType.flowEdge,
                  source: sourceNode.id,
                  target: id,
                  data: {
                    color: rgbToHex(theme.palette.primary.main).slice(0, -2),
                    source_slug: sourceNode.data.operator_slug,
                    target_slug: opSlug,
                  },
                },
              ]);

              return newEdges;
            });
          } else {
            updateFlowNodes((nds) => {
              const loopStartSlug =
                sourceNode.data.app_module === SystemModuleType.Loop
                  ? sourceNode.data.operator_slug
                  : sourceNode.data.loop_data?.loop_start_slug;
              const loopEndSlug = nds.find(
                (n) =>
                  n.data.app_module === SystemModuleType.LoopEnd &&
                  n.data.operator_input_settings?.loop_slug === loopStartSlug
              )?.data.operator_slug;
              return nds.concat({
                id,
                type: FlowNodeType.newNode,
                position: {
                  ...sourceNode.position,
                  y: sourceNode.position.y + 220,
                },
                data: {
                  parent_operator_slug: sourceNode.data.operator_slug,
                  parent_fusion_id: fusionSlug,
                  operator_slug: opSlug,
                  created_at: moment.utc().format(),
                  in_loop: true,
                  loop_data: {
                    loop_end_slug: loopEndSlug as string,
                    loop_start_slug: loopStartSlug as string,
                  },
                },
                dragHandle: ".drag-handle",
                draggable: true,
              });
            });

            updateFlowEdges((eds) =>
              eds.concat([
                {
                  id: `e${sourceNode.data.operator_slug}-${opSlug}`,
                  type: FlowEdgeType.flowEdge,
                  source: sourceNode.id,
                  target: id,
                  data: {
                    color: rgbToHex(theme.palette.primary.main).slice(0, -2),
                    source_slug: sourceNode.data.operator_slug,
                    target_slug: opSlug,
                  },
                },
              ])
            );
          }
        } else {
          if (branchOut) {
            updateFlowNodes((nds) => {
              return nds.concat({
                id,
                type: FlowNodeType.newNode,
                position: {
                  ...sourceNode.position,
                  y: sourceNode.position.y + 220,
                },
                data: {
                  parent_operator_slug: sourceNode.data.operator_slug,
                  parent_fusion_id: fusionSlug,
                  operator_slug: opSlug,
                  created_at: moment.utc().format(),
                },
                dragHandle: ".drag-handle",
                draggable: true,
              });
            });

            updateFlowEdges((eds) =>
              eds.concat([
                {
                  id: `e${sourceNode.data.operator_slug}-${opSlug}`,
                  type: FlowEdgeType.flowEdge,
                  source: sourceNode.id,
                  target: id,
                  data: {
                    color: rgbToHex(theme.palette.primary.main).slice(0, -2),
                    source_slug: sourceNode.data.operator_slug,
                    target_slug: opSlug,
                  },
                },
              ])
            );
          } else {
            updateFlowNodes((nds) => {
              let newNodes = nds.map((n) => {
                if (
                  n.data.parent_operator_slug === sourceNode.data.operator_slug
                ) {
                  return {
                    ...n,
                    data: { ...n.data, parent_operator_slug: opSlug },
                  };
                }

                return n;
              });
              newNodes = newNodes.concat({
                id,
                type: FlowNodeType.newNode,
                position: {
                  ...sourceNode.position,
                  y: sourceNode.position.y + 220,
                },
                data: {
                  parent_operator_slug: sourceNode.data.operator_slug,
                  parent_fusion_id: fusionSlug,
                  operator_slug: opSlug,
                  created_at: moment.utc().format(),
                },
                dragHandle: ".drag-handle",
                draggable: true,
              });

              return newNodes;
            });

            updateFlowEdges((eds) => {
              let newEdges = eds.map((e) => {
                if (e.source === sourceNode.id) {
                  return {
                    ...e,
                    source: id,
                    id: `e${opSlug}-${e.data.target_slug}`,
                  };
                }

                return e;
              });
              newEdges = newEdges.concat([
                {
                  id: `e${sourceNode.data.operator_slug}-${opSlug}`,
                  type: FlowEdgeType.flowEdge,
                  source: sourceNode.id,
                  target: id,
                  data: {
                    color: rgbToHex(theme.palette.primary.main).slice(0, -2),
                    source_slug: sourceNode.data.operator_slug,
                    target_slug: opSlug,
                  },
                },
              ]);

              return newEdges;
            });
          }
        }
        layoutNodes();
      },
      [updateFlowEdges, updateFlowNodes]
    );

    const nodeTypes: NodeTypes = useMemo(
      () => ({
        [FlowNodeType.flowNode]: (props) => (
          <FlowNode {...props} onAddClick={appendNewNode} />
        ),
        [FlowNodeType.connectionNode]: ConnectionNode,
        [FlowNodeType.newNode]: (props) => (
          <NewNode {...props} onAppSelect={addNode} />
        ),
      }),
      [addNode, appendNewNode]
    );

    const handleCloseContextMenu = () => {
      setContextMenuOpen(false);
    };

    const addHoveringNodes = useFusionFlowStore.useAddHoveringNode();
    const removeHoveringNodes = useFusionFlowStore.useRemoveHoveringNode();

    const [panEnabled, setPanEnabled] = useState(false);

    const keyDown = debounce((e) => {
      console.log("space down");
      !panEnabled && setPanEnabled(true);
    }, 100);

    const keyUp = debounce((e) => {
      console.log("space up");
      panEnabled && setPanEnabled(false);
    }, 100);

    useHotkeys("space", keyDown, { keydown: true });

    useHotkeys("space", keyUp, { keyup: true });

    return (
      <Box
        ref={containerRef}
        sx={{
          height: "100%",
          ".react-flow__node": { zIndex: "10000 !important" },
        }}
        component="div"
      >
        <ContextMenu
          open={contextMenuOpen}
          onClose={handleCloseContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={{
            top: positionRef.current.y,
            left: positionRef.current.x,
          }}
        >
          {contextMenuItems[
            `${contextMenuRef.current?.type}` as keyof typeof contextMenuItems
          ]?.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                item.onClick();
                handleCloseContextMenu();
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </MenuItem>
          ))}
        </ContextMenu>
        <AnimatePresence>
          <StyledReactFlow
            // key={layout}
            nodes={nodesState}
            edges={edgesState}
            onNodesChange={(changes) => {
              // console.log(changes);
              onNodesChange(changes);
              const change = changes[0];
              if (change.type === "position") {
                if (!!change.dragging) {
                  nodePositionChangesRef.current = {
                    dragging: true,
                    changes: [change] as NodePositionChange[],
                  };
                } else {
                  if (nodePositionChangesRef.current.dragging) {
                    updateNodePositions(nodePositionChangesRef.current.changes);
                  }
                }
              }
            }}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            // onDoubleClick={onDoubleClick}
            onPaneClick={(e) => e.detail === 2 && onDoubleClick(e)}
            onNodeContextMenu={(e, node) => {
              // console.log("node", e, node);
              const popoverContainer = document.getElementById("flow-popover");
              if (popoverContainer?.contains(e.target as any)) {
                return;
              }
              e.preventDefault();
              positionRef.current = { x: e.clientX, y: e.clientY };
              contextMenuRef.current = { type: "flow-node-menu", node };
              setContextMenuOpen(true);
            }}
            onPaneContextMenu={(e) => {
              e.preventDefault();
              // console.log("pane", e);
              positionRef.current = { x: e.clientX, y: e.clientY };
              contextMenuRef.current = { type: "pane-menu" };
              setContextMenuOpen(true);
            }}
            onError={
              ((id: string, message: string) => {
                console.log("error", id, message);
              }) as any
            }
            onNodeMouseEnter={(_, node) => {
              setPanEnabled(true);
              addHoveringNodes(node.id);
            }}
            onNodeMouseLeave={(_, node) => {
              setPanEnabled(false);
              removeHoveringNodes(node.id);
            }}
            maxZoom={1.5}
            minZoom={0.1}
            nodeTypes={nodeTypes}
            edgeTypes={edgesTypes}
            connectionLineComponent={FlowConnectionLine}
            // onNodeDragStart={() => console.log("onNodeDragStart")}
            onNodeDragStop={(_, node) => {
              if (node.type === "connectionNode") {
                updateFlowNodes((nds) =>
                  nds.map((n) =>
                    n.id === "4" ? { ...n, position: { x: 445, y: 150 } } : n
                  )
                );
              }
            }}
            panOnDrag={panEnabled}
            zoomOnDoubleClick={false}
            className={classNames({
              "pan-enabled": panEnabled,
              "node-selected": !!selectedNode?.id,
            })}
            // onEdgeClick={(e, edge) => {
            //   console.log("edge", e, edge);
            //   setSelectedEdge(edge);
            //   // edgePopoverRef.current?.open(e.target as Element);
            // }}
          />
        </AnimatePresence>
        {/* <FlowPopover
        content={<Typography>ABC</Typography>}
        ref={edgePopoverRef}
        containerProps={{ title: "Edge Options" }}
        anchorReference="anchorPosition"
      /> */}
      </Box>
    );
  }
);

const StyledReactFlow = styled(ReactFlow)({
  ".react-flow__pane, .react-flow__edge": {
    cursor: "default",
  },
  "&.pan-enabled .react-flow__pane": {
    cursor: "grab",

    "&.dragging": {
      cursor: "grab",
    },
  },

  ".react-flow__node": {
    cursor: "default",

    ".drag-handle, .connector-node": {
      cursor: "pointer",
    },
  },

  "&.node-selected .react-flow__edges": {
    ".react-flow__edge > g": {
      opacity: 0.4,
      "&.selected-node-edge": {
        opacity: 1,
      },
    },
  },
});

export default FusionFlowDesigner;
