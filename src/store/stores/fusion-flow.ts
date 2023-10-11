import { createSelectorHooks } from "auto-zustand-selectors-hook";
import {
  NODE_HEIGHT as nodeHeight,
  NODE_WIDTH as nodeWidth,
  RANK_SEP as ranksep,
} from "constants/Fusion";
import { FlowNodeType } from "constants/index";
import dagre from "dagrejs";
import { cloneDeep } from "lodash";
import moment from "moment";
import {
  Edge,
  Node,
  NodePositionChange,
  Position,
  Viewport,
  isEdge,
  isNode,
} from "reactflow";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Elements = (Edge | Node)[];

const EMPTY_FLOW = { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } };

const getNodeOrder = (elements: Node[], root?: Node): string[] => {
  if (!root) {
    return [];
  }
  let order: string[] = [root.id];
  const children = elements.filter(
    (el) => el.data?.parent_operator_slug === root?.data?.operator_slug
  );

  const sortedChildren = children.sort((a, b) =>
    moment(a.data?.created_at).isAfter(moment(b.data?.created_at)) ? 1 : -1
  );

  sortedChildren.forEach((child) => {
    order.push(...getNodeOrder(elements, child));
  });

  return order;
};

const getLayoutedElements = (
  elementsArg: Elements,
  direction: "TB" | "LR" = "TB"
) => {
  const elements = cloneDeep(elementsArg);
  const isHorizontal = direction === "LR";
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    ranker: "network-simplex",
    ranksep,
    nodesep: 200,
  });
  // network-simplex, tight-tree or longest-path

  const startNode = elements.find((el) => !!el.data?.is_start_node) as Node;

  const nodeOrder = getNodeOrder(
    elements.filter(
      (el) => isNode(el) && el.type !== FlowNodeType.newNode
    ) as Node[],
    startNode
  );

  const restElms = elements
    .filter((el) => isNode(el) && !nodeOrder.includes(el.id))
    .map((el) => el.id);

  [...nodeOrder, ...restElms].forEach((id) => {
    dagreGraph.setNode(id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph, {
    edgeLabelSpace: false,
    keepNodeOrder: true,
    nodeOrder,
  });

  return elements.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = isHorizontal ? Position.Left : Position.Top;
      el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
      if (!nodeWithPosition) {
        return el;
      }

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });
};

type DataFieldDraft = Partial<Omit<DataField, "id">> & Pick<DataField, "id">;
export type FusionDraft = Partial<
  Omit<
    Fusion<Node<Partial<FusionOperator>>, Edge, Viewport>,
    "fusion_fields"
  > & {
    fusion_fields?: { fields?: Partial<DataField>[] };
  }
>;

export type DraftsKey =
  | "fusionFieldDrafts"
  | "skillUserFieldDrafts"
  | "skillSessionFieldDrafts"
  | "skillUserTableFieldDrafts"
  | "skillUserTableSidebarDrafts";

type State = {
  activeParamMapper: string | null;
  fusionDraft: FusionDraft | null;
  layout: "free" | "horizontal" | "vertical";
  allModules: ThreePAppAction[];
  selectedNode: Node<FusionOperator> | null;
  selectedEdge: Edge | null;
  hoveringNodes: string[];
  hoveringAddNode: string | null;
  connectingTo: string | null;
  editConditionOperatorSlug: string | null;

  // * fusion field drafts
  fusionFieldDrafts: Partial<DataField>[];
  skillUserFieldDrafts: Partial<DataField>[];
  skillSessionFieldDrafts: Partial<DataField>[];
  skillUserTableFieldDrafts: Partial<DataField>[];
  skillUserTableSidebarDrafts: Partial<DataField>[];
};

type Actions = {
  setActiveParamMapper(name: string | null): void;
  setFusionDraft(fusion: FusionDraft | null): void;
  updateNodeOperatorInputSettings(
    id: string,
    data: Record<string, unknown>
  ): void;
  updateFlowNodes(
    nodes:
      | Node<Partial<FusionOperator>>[]
      | ((
          nodes: Node<Partial<FusionOperator>>[],
          edges: Edge[]
        ) => Node<Partial<FusionOperator>>[])
  ): void;
  updateFlowEdges(
    edges:
      | Edge[]
      | ((edges: Edge[], nodes: Node<Partial<FusionOperator>>[]) => Edge[])
  ): void;
  updateLayout(layout: "free" | "horizontal" | "vertical"): void;
  appendAllModules(modules: ThreePAppAction[]): void;
  setSelectedNode(node: Node<FusionOperator> | null): void;
  setSelectedEdge(edge: Edge | null): void;
  layoutNodes(): void;
  addHoveringNode(node: string): void;
  removeHoveringNode(node: string): void;
  setHoveringAddNode(node: string | null): void;
  setConnectingTo(node: string | null): void;
  updateEdgeSettings(settings: FusionOperator["edge_data"]): void;
  updateOperatorConditions(data: {
    operatorSlug: string;
    settings: FusionOperator["operator_conditions"];
  }): void;
  updateNodePositions(changes: NodePositionChange[]): void;
  setEditConditionOperatorSlug(slug: string | null): void;

  // * field draft functions
  pushFieldDraft(fieldDraft: DataFieldDraft, draftsKey?: DraftsKey): void;
  popFieldDraft(draftsKey?: DraftsKey): void;
  updateDataFieldDraft: (
    index: number,
    draft: Partial<DataField>,
    draftsKey?: DraftsKey
  ) => void;
  emptyDataFieldDrafts(draftsKey?: DraftsKey): void;
  mergeDataFieldDraftTail: (
    data: Partial<DataField>,
    draftsKey?: DraftsKey
  ) => void;
  setFusionFields(fields: BaseFields, draftsKey?: DraftsKey): void;
};

const useFusionFlowStoreBase = create<State & Actions>()(
  devtools((set) => ({
    activeParamMapper: null,
    fusionDraft: null,
    layout: "vertical",
    allModules: [],
    selectedNode: null,
    hoveringNodes: [],
    hoveringAddNode: null,
    connectingTo: null,
    selectedEdge: null,
    fusionFieldDrafts: [],
    skillUserFieldDrafts: [],
    skillSessionFieldDrafts: [],
    skillUserTableFieldDrafts: [],
    skillUserTableSidebarDrafts: [],
    editConditionOperatorSlug: null,
    setEditConditionOperatorSlug(slug) {
      set((state) => {
        return {
          ...state,
          editConditionOperatorSlug: slug,
        };
      });
    },
    updateEdgeSettings: (settings) => {
      set((state) => {
        const edge = state.selectedEdge;
        const node = state.fusionDraft?.flow?.nodes.find(
          (n) => n.id === edge?.target
        );
        if (!edge || !node) {
          return {};
        }
        const draft = cloneDeep(state.fusionDraft) || { fusion_operators: [] };

        if (!draft.flow) {
          draft.flow = EMPTY_FLOW;
        }

        draft.flow.nodes = draft.flow.nodes.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, edge_data: settings } }
            : n
        );

        draft.fusion_operators = draft.fusion_operators?.map((n) =>
          n.operator_slug === node.data.operator_slug
            ? { ...n, edge_data: settings }
            : n
        );

        return { fusionDraft: draft };
      });
    },
    updateOperatorConditions({ operatorSlug, settings }) {
      set((state) => {
        const node = state.fusionDraft?.flow?.nodes.find(
          (n) => n.data.operator_slug === operatorSlug
        );
        if (!node) {
          return {};
        }
        const draft = cloneDeep(state.fusionDraft) || { fusion_operators: [] };

        if (!draft.flow) {
          draft.flow = EMPTY_FLOW;
        }

        draft.flow.nodes = draft.flow.nodes.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, operator_conditions: settings } }
            : n
        );

        draft.fusion_operators = draft.fusion_operators?.map((n) =>
          n.operator_slug === node.data.operator_slug
            ? { ...n, operator_conditions: settings }
            : n
        );

        return { fusionDraft: draft };
      });
    },
    setSelectedEdge: (edge: Edge | null) => set(() => ({ selectedEdge: edge })),
    setConnectingTo: (node) => {
      set(() => ({ connectingTo: node }));
    },
    setHoveringAddNode: (node) => {
      set(() => ({ hoveringAddNode: node }));
    },
    addHoveringNode: (node) => {
      set((state) => {
        return {
          hoveringNodes: [...(state.hoveringNodes || []), node],
        };
      });
    },
    removeHoveringNode: (node) => {
      set((state) => {
        return {
          hoveringNodes: state.hoveringNodes.filter((n) => n !== node),
        };
      });
    },
    setActiveParamMapper: (name) => {
      set(() => {
        return { activeParamMapper: name };
      });
    },
    setFusionDraft: (fusion) => {
      set(() => {
        // console.log({ fusion });
        return { fusionDraft: fusion };
      });
    },
    updateNodeOperatorInputSettings: (id, data) => {
      set((state) => {
        const draft = cloneDeep(state.fusionDraft) || {};
        if (draft?.flow) {
          draft.flow.nodes = draft.flow.nodes.map((node) =>
            node.id === id
              ? {
                  ...node,
                  data: { ...node.data, operator_input_settings: data },
                }
              : node
          );
        }

        return { fusionDraft: draft };
      });
    },
    updateFlowNodes: (nodes) => {
      set((state) => {
        const draft = cloneDeep(state.fusionDraft) || {};
        if (!draft.flow) {
          draft.flow = EMPTY_FLOW;
        }
        if (typeof nodes === "function") {
          draft.flow.nodes = nodes(draft.flow.nodes, draft.flow.edges);
        } else {
          draft.flow.nodes = nodes;
        }

        draft.fusion_operators = draft.flow.nodes.map(
          (node) => node.data
        ) as any;

        return { fusionDraft: draft };
      });
    },
    updateFlowEdges: (edges) => {
      set((state) => {
        const draft = cloneDeep(state.fusionDraft) || {};
        if (!draft.flow) {
          draft.flow = EMPTY_FLOW;
        }
        if (typeof edges === "function") {
          draft.flow.edges = edges(draft.flow.edges, draft.flow.nodes);
        } else {
          draft.flow.edges = edges;
        }

        return { fusionDraft: draft };
      });
    },
    updateLayout(layout) {
      set((state) => {
        const draft = cloneDeep(state.fusionDraft) || {};
        if (draft.flow?.nodes) {
          if (layout === "free") {
            draft.flow.nodes = draft.flow.nodes.map((n) => ({
              ...n,
              draggable: true,
            }));
          } else {
            const elements = getLayoutedElements(
              [...draft.flow.nodes, ...draft.flow.edges],
              layout === "horizontal" ? "LR" : "TB"
            );
            draft.flow.nodes = (
              elements.filter((el) => isNode(el)) as Node[]
            ).map((n) => ({
              ...n,
              draggable: false,
            }));
            draft.flow.edges = elements.filter((e) => isEdge(e)) as Edge[];
          }
        }

        return { layout, fusionDraft: draft };
      });
    },
    appendAllModules(modules) {
      set((state) => {
        return { allModules: [...state.allModules, ...modules] };
      });
    },
    setSelectedNode(node) {
      set((state) => {
        return { selectedNode: node };
      });
    },
    layoutNodes() {
      set((state) => {
        const draft = cloneDeep(state.fusionDraft) || {};
        if (draft.flow?.nodes) {
          if (state.layout === "free") {
            draft.flow.nodes = draft.flow.nodes.map((n) => ({
              ...n,
              draggable: true,
            }));
          } else {
            // const chartNode = draft.flow?.nodes.find(
            //   (n) => n.data.app_module === "chart-node"
            // );
            const elements = getLayoutedElements(
              [
                ...draft.flow.nodes,
                // .filter(
                //   (n) => n.data.app_module !== "chart-node"
                // ),
                ...draft.flow.edges,
                // .filter((e) => e.target !== chartNode?.id),
              ],
              state.layout === "horizontal" ? "LR" : "TB"
            );

            const ns = elements.filter((el) => isNode(el)) as Node<
              Partial<FusionOperator>
            >[];
            // if (chartNode) {
            //   const startNode = ns.find((n) => n.data.is_start_node);
            //   chartNode.position.x =
            //     startNode?.position.x ?? chartNode.position.x;
            //   let highestNode = ns[0].position.y;
            //   ns.forEach((n) => {
            //     if (n.position.y > highestNode) {
            //       highestNode = n.position.y;
            //     }
            //   });

            //   chartNode.position.y = highestNode + 220;
            //   ns.push(chartNode);
            // }
            draft.flow.nodes = ns.map((n) => ({
              ...n,
              draggable: false,
            }));
            draft.flow.edges = elements.filter((e) => isEdge(e)) as Edge[];
          }
        }

        return { fusionDraft: draft };
      });
    },
    updateNodePositions(changes) {
      set((state) => {
        const draft = cloneDeep(state.fusionDraft) || {};

        if (!draft.flow) {
          draft.flow = EMPTY_FLOW;
        }

        for (const change of changes) {
          const node = draft.flow.nodes.find((n) => n.id === change.id);

          if (!node) {
            continue;
          }

          if (change.position) {
            node.position = change.position;
          }

          if (node.positionAbsolute) {
            node.positionAbsolute = change.positionAbsolute;
          }
        }

        return { fusionDraft: draft };
      });
    },

    // * fusion field draft functions
    setFusionFields(fields, draftsKey = "fusionFieldDrafts") {
      set((state) => {
        const draft = cloneDeep(state.fusionDraft) || { fusion_operators: [] };
        switch (draftsKey) {
          case "skillSessionFieldDrafts":
            draft.skill_session_fields = fields;
            break;
          case "skillUserFieldDrafts":
            draft.skill_user_fields = fields;
            break;
          default:
            draft.fusion_fields = fields;
            break;
        }
        return { fusionDraft: draft };
      });
    },
    pushFieldDraft(fieldDraft, draftsKey = "fusionFieldDrafts") {
      set((state) => {
        const drafts = cloneDeep(state[draftsKey]) || [];
        drafts.push(fieldDraft);
        return { [draftsKey]: drafts };
      });
    },
    popFieldDraft(draftsKey = "fusionFieldDrafts") {
      set((state) => {
        const drafts = cloneDeep(state[draftsKey]) || [];
        drafts.pop();
        return { [draftsKey]: drafts };
      });
    },
    updateDataFieldDraft(index, fieldDraft, draftsKey = "fusionFieldDrafts") {
      set((state) => {
        const drafts = cloneDeep(state[draftsKey]) || [];
        drafts[index] = fieldDraft;

        return { [draftsKey]: drafts };
      });
    },
    emptyDataFieldDrafts(draftsKey = "fusionFieldDrafts") {
      set(() => {
        return { [draftsKey]: [] };
      });
    },
    mergeDataFieldDraftTail(data, draftsKey = "fusionFieldDrafts") {
      set((state) => {
        const drafts = cloneDeep(state[draftsKey]) || [];
        const dataFieldDraft = drafts.pop();
        const mergeIntoField = drafts.pop();
        if (dataFieldDraft && mergeIntoField) {
          if (mergeIntoField.fields) {
            const fieldIndex = mergeIntoField.fields.findIndex(
              (f) => f.id === dataFieldDraft.id
            );
            if (fieldIndex > -1) {
              mergeIntoField.fields[fieldIndex] = {
                ...mergeIntoField.fields[fieldIndex],
                ...dataFieldDraft,
                ...data,
              };
            } else {
              mergeIntoField.fields.push({
                ...dataFieldDraft,
                ...data,
              } as DataField);
            }
          } else {
            mergeIntoField.fields = [
              { ...dataFieldDraft, ...data } as DataField,
            ];
          }

          drafts.push(mergeIntoField);

          return { [draftsKey]: drafts };
        }

        return {};
      });
    },
    // * END: fusion field draft functions
  }))
);

export const useFusionFlowStore = createSelectorHooks(useFusionFlowStoreBase);
