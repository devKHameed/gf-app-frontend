import AddIcon from "@mui/icons-material/Add";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Stack,
  styled,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { GfLogo } from "assets/icons";
import FlowClock from "assets/icons/FlowClock";
import classNames from "classnames";
import { SystemModuleType } from "enums/Fusion";
import { motion, MotionProps, useAnimationControls } from "framer-motion";
import use3pApps from "queries/3p-app/use3pApps";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Handle, Node, NodeProps, Position, useStore } from "reactflow";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import EdgeEditorFields from "./EdgeEditorFields";
import FlowPopover, { FlowPopoverRef } from "./FlowPopover";
import NodeEditorFields from "./NodeEditorFields";
import ScheduleFusionFields from "./ScheduleFusionFields";

type Props = {
  onAddClick?(sourceNode: Node<FusionOperator>, branchOut?: boolean): void;
};

type FlowNodeProps = NodeProps<FusionOperator> & Props;

export const NodeBox = styled(Box)(({ theme }) => ({
  width: "160px",
  height: "130px",
  borderRadius: "100%",
  background: "transparent",
  position: "absolute",
  left: "-30px",
  zIndex: -6,
  top: 0,

  // "&:before": {
  //   left: "-30px",
  //   top: "-30px",
  //   bottom: "-30px",
  //   right: "-30px",
  //   border: `30px solid transparent`,
  //   content: `""`,
  //   position: "absolute",
  //   borderRadius: "100%",
  // },
}));

const NodeContainer = styled(motion.div)({
  "&.node-selected": {
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      zIndex: 1,
      background: "#000",
      opacity: 0.4,
    },

    ".text-container": {
      opacity: 0.4,
    },
  },
});

// const isChartFusion = (type: string) => {
//   return ["bar", "line", "pie", "stat"].includes(type);
// };

const FlowNode: React.FC<FlowNodeProps & { viewOnly?: boolean }> = (props) => {
  if (props.viewOnly) {
    return <FlowNodeViewOnly {...props} />;
  }

  return <FlowNodeComp {...props} />;
};

const FlowNodeViewOnly: React.FC<FlowNodeProps> = (props) => {
  const { onAddClick, ...node } = props;
  const { data } = node;
  const isLoopEndOperator = data.app_module === SystemModuleType.LoopEnd;
  const sourceLoopOperator = data.operator_input_settings?.loop_slug;

  const sourceNode = useStore(
    useCallback(
      (store) => store.nodeInternals.get(node.id) as Node<FusionOperator>,
      [node.id]
    )
  );

  const connectionNodeId = useStore((store) => store.connectionNodeId);

  const childNodes = useStore(
    useCallback(
      (store) => {
        let length = 0;
        store.nodeInternals.forEach((n) => {
          if (n.data.parent_operator_slug === data.operator_slug) {
            length += 1;
          }
        });

        return length;
      },
      [data.operator_slug]
    )
  );

  const theme = useTheme();

  const { data: apps } = use3pApps();

  const app = apps?.find((app) => app.slug === data.app);
  const color = app?.app_color || theme.palette.primary.main;

  return (
    <Box key={data.parent_operator_slug}>
      <Stack direction="column">
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: "#555",
            width: "20px",
            height: "20px",
            opacity: 0,
          }}
          isConnectable={false}
          id="a"
        />
        <Stack
          direction="row"
          gap={2.5}
          alignItems="center"
          sx={{ position: "relative" }}
        >
          <Box
            sx={{
              width: "100px",
              height: "100px",
              borderRadius: "100%",
              border: `1px solid ${color}`,
              padding: "14px",
              background: "white",
            }}
            className="drag-handle"
          >
            <Avatar
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "#fff",
              }}
              variant="circular"
              src={app?.app_color_logo}
            >
              {data.app_module === SystemModuleType.Loop ? (
                "Loop"
              ) : data.app_module === SystemModuleType.LoopEnd ? (
                "?"
              ) : (
                <GfLogo sx={{ fontSize: "64px" }} />
              )}
            </Avatar>
          </Box>

          {!isLoopEndOperator || (isLoopEndOperator && !sourceLoopOperator) ? (
            <Tooltip title={data.operator_title}>
              <Box
                sx={{
                  width: 100,
                  pointerEvents: "none",
                  // background: "red",
                  position: "absolute",
                  marginLeft: "20px",
                  left: "100%",
                }}
                className="text-container"
              >
                <Typography
                  component="div"
                  variant="subtitle1"
                  color="text.primary"
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {data.operator_title}
                </Typography>

                <Typography
                  component="div"
                  variant="body2"
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {data.operator_subtitle}
                </Typography>
              </Box>
            </Tooltip>
          ) : (
            <LoopConnector
              sourceLoopNodeId={data.operator_input_settings?.loop_node_id}
              yPos={node.yPos}
              xPos={node.xPos}
              isLoopEndOperator={isLoopEndOperator}
              operatorSlug={data.operator_slug}
              nodeId={node.id}
              color={color}
            />
          )}
        </Stack>
        {data?.in_loop && data?.loop_data?.loop_end_slug && (
          <LeafNodeLoopConnector
            color={color}
            yPos={node.yPos}
            operatorSlug={data.operator_slug}
            loopEndSlug={data.loop_data.loop_end_slug}
            inLoop={data.in_loop}
          />
        )}
        <Connector
          nodeId={node.id}
          color={color}
          onAddClick={(branchOut) => {
            console.log("add click");
            if (sourceNode) {
              onAddClick?.(sourceNode, branchOut);
            }
          }}
          childCount={childNodes}
          connectionNodeId={connectionNodeId}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={
            childNodes > 0
              ? {
                  width: "1px",
                  height: "1px",
                  opacity: 0,
                  bottom: "-65px",
                }
              : {
                  // background: "#555",
                  width: "1px",
                  height: "1px",
                  opacity: 0,
                  bottom: "-40px",
                }
          }
          isConnectable={false}
          key={connectionNodeId}
          id="b"
        />
      </Stack>
    </Box>
  );
};

const FlowNodeComp: React.FC<FlowNodeProps> = (props) => {
  const { onAddClick, ...node } = props;
  const { data } = node;
  const isLoopEndOperator = data.app_module === SystemModuleType.LoopEnd;
  const sourceLoopOperator = data.operator_input_settings?.loop_slug;

  const anchorRef = useRef<SVGGElement | null>(null);
  const conditionPopoverRef = useRef<FlowPopoverRef>();
  const popoverRef = useRef<FlowPopoverRef>();
  const scheduleEditorPopoverRef = useRef<FlowPopoverRef>();
  const hoveringNodes = useFusionFlowStore.useHoveringNodes();
  const hovering = hoveringNodes.includes(node.id);
  const setSelectedNode = useFusionFlowStore.useSetSelectedNode();
  const selectedNode = useFusionFlowStore.useSelectedNode();
  const layout = useFusionFlowStore.useLayout();
  const editConditionOperatorSlug =
    useFusionFlowStore.useEditConditionOperatorSlug();
  const setEditConditionOperatorSlug =
    useFusionFlowStore.useSetEditConditionOperatorSlug();

  const sourceNode = useStore(
    useCallback(
      (store) => store.nodeInternals.get(node.id) as Node<FusionOperator>,
      [node.id]
    )
  );

  const connectionNodeId = useStore((store) => store.connectionNodeId);

  const childNodes = useStore(
    useCallback(
      (store) => {
        let length = 0;
        store.nodeInternals.forEach((n) => {
          if (n.data.parent_operator_slug === data.operator_slug) {
            length += 1;
          }
        });

        return length;
      },
      [data.operator_slug]
    )
  );

  const parentNode = sourceNode?.data.parent_operator_slug;

  const theme = useTheme();

  const { data: apps } = use3pApps();

  const { is_start_node } = data || {};
  const app = apps?.find((app) => app.slug === data.app);
  const color = app?.app_color || theme.palette.primary.main;

  const layoutStyles =
    layout === "horizontal" ? { transform: "rotate(270deg)" } : {};

  const containerProps: MotionProps =
    layout === "free" && !node.dragging
      ? {
          layout: true,
          transition: {
            type: "spring",
            stiffness: 50,
            damping: 10,
            duration: 0.1,
          },
        }
      : {};

  useEffect(() => {
    if (
      anchorRef.current &&
      editConditionOperatorSlug &&
      editConditionOperatorSlug === data.operator_slug
    ) {
      conditionPopoverRef.current?.open(anchorRef.current);
    }
  }, [data.operator_slug, editConditionOperatorSlug]);

  return (
    <NodeContainer
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 1000,
        damping: 20,
      }}
      {...containerProps}
      style={{ position: "relative" }}
      className={classNames({
        "node-selected": !!selectedNode?.id && selectedNode.id !== node.id,
      })}
    >
      <Box sx={{ ...layoutStyles }} key={data.parent_operator_slug}>
        {is_start_node && (
          <FlowPopover
            ref={scheduleEditorPopoverRef}
            content={
              <ScheduleFusionFields
                onClose={() => scheduleEditorPopoverRef.current?.close()}
              />
            }
            containerProps={{
              title: "Schedule setting",
              hideFooter: true,
              disableScroll: true,
            }}
            anchorOrigin={{
              vertical: "center",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: -25,
            }}
          >
            <Box sx={{ position: "absolute", left: -5, top: -10 }}>
              <FlowClock
                sx={{ color: app?.app_color || theme.palette.primary.main }}
              />
            </Box>
          </FlowPopover>
        )}
        <Stack direction="column">
          {!parentNode &&
          !is_start_node &&
          node.data.app_module !== "chart-node" ? (
            <>
              {connectionNodeId !== node.id && (
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ position: "absolute", top: -30, left: 0 }}
                >
                  <Box
                    sx={{
                      background: "#fff",
                      border: `3px solid ${color}`,
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      marginBottom: "-3px",
                    }}
                  />
                  <svg height="20" width="100">
                    <line
                      x1={50}
                      y1={0}
                      x2={50}
                      y2={20}
                      stroke={color}
                      strokeWidth="10"
                    />
                  </svg>
                </Stack>
              )}
              <Handle
                type="target"
                position={Position.Top}
                style={{
                  background: "#555",
                  width: "20px",
                  height: "20px",
                  opacity: 0,
                  zIndex: 1,
                  top: "-30px",
                }}
                isConnectable={true}
                id="a"
              />
            </>
          ) : (
            <Handle
              type="target"
              position={Position.Top}
              style={{
                background: "#555",
                width: "20px",
                height: "20px",
                opacity: 0,
              }}
              isConnectable={false}
              id="a"
            />
          )}
          <Stack
            direction="row"
            gap={2.5}
            alignItems="center"
            sx={{ position: "relative" }}
          >
            <NodeBox />
            <FlowPopover
              ref={popoverRef}
              content={
                <NodeEditorFields
                  operator={data}
                  id={node.id}
                  onClose={() => {
                    popoverRef.current?.close();
                  }}
                />
              }
              containerProps={{
                title: data.operator_title,
                hideFooter: true,
                disableScroll: true,
              }}
              delayDuration={500}
              onOpen={() => setSelectedNode(sourceNode)}
              onClose={() => setSelectedNode(null)}
            >
              <Box
                sx={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "100%",
                  border: `1px solid ${color}`,
                  padding: "14px",
                  background: "white",
                }}
                className="drag-handle"
                ref={anchorRef}
              >
                <Avatar
                  sx={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#fff",
                  }}
                  variant="circular"
                  src={app?.app_color_logo}
                >
                  {data.app_module === SystemModuleType.Loop ? (
                    "Loop"
                  ) : data.app_module === SystemModuleType.LoopEnd ? (
                    "?"
                  ) : (
                    <GfLogo sx={{ fontSize: "64px" }} />
                  )}
                </Avatar>
              </Box>
            </FlowPopover>
            {!isLoopEndOperator ||
            (isLoopEndOperator && !sourceLoopOperator) ? (
              <Tooltip title={data.operator_title}>
                <Box
                  sx={{
                    width: 100,
                    pointerEvents: "none",
                    // background: "red",
                    position: "absolute",
                    ...(layout === "horizontal"
                      ? {
                          transform: "rotate(90deg)",
                          left: "35%",
                          top: "70%",
                        }
                      : { marginLeft: "20px", left: "100%" }),
                  }}
                  className="text-container"
                >
                  <Typography
                    component="div"
                    variant="subtitle1"
                    color="text.primary"
                    sx={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {data.operator_title}
                  </Typography>

                  <Typography
                    component="div"
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {data.operator_subtitle}
                  </Typography>
                </Box>
              </Tooltip>
            ) : (
              <LoopConnector
                sourceLoopNodeId={data.operator_input_settings?.loop_node_id}
                yPos={node.yPos}
                xPos={node.xPos}
                isLoopEndOperator={isLoopEndOperator}
                operatorSlug={data.operator_slug}
                nodeId={node.id}
                color={color}
              />
            )}
          </Stack>
          {data?.in_loop && data?.loop_data?.loop_end_slug && (
            <LeafNodeLoopConnector
              color={color}
              yPos={node.yPos}
              operatorSlug={data.operator_slug}
              loopEndSlug={data.loop_data.loop_end_slug}
              inLoop={data.in_loop}
            />
          )}

          {(is_start_node || !!parentNode) &&
            (hovering || childNodes > 0) &&
            data.app_module !== "chart-node" && (
              <motion.div
                initial={{ top: "-40px" }}
                animate={{ top: 0 }}
                exit={{ top: "-40px" }}
                style={{ position: "relative", zIndex: -1 }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
                key="flow-node-connector"
              >
                <Connector
                  nodeId={node.id}
                  color={color}
                  onAddClick={(branchOut) => {
                    console.log("add click");
                    if (sourceNode) {
                      onAddClick?.(sourceNode, branchOut);
                    }
                  }}
                  childCount={childNodes}
                  connectionNodeId={connectionNodeId}
                />
              </motion.div>
            )}
          <Handle
            type="source"
            position={Position.Bottom}
            style={
              childNodes > 0
                ? {
                    width: "1px",
                    height: "1px",
                    opacity: 0,
                    bottom: "-65px",
                  }
                : {
                    // background: "#555",
                    width: "1px",
                    height: "1px",
                    opacity: 0,
                    bottom: "-40px",
                  }
            }
            isConnectable={!!connectionNodeId && (hovering || childNodes > 0)}
            key={connectionNodeId}
            id="b"
          />
          {/* )} */}
        </Stack>
      </Box>
      <FlowPopover
        content={
          <EdgeEditorFields
            edgeData={data.operator_conditions}
            operator={data}
            isOperatorConditions
          />
        }
        ref={conditionPopoverRef}
        containerProps={{
          title: "Operator Conditions",
          disableScroll: true,
          hideFooter: true,
        }}
        anchorReference="anchorEl"
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        onClose={() => {
          setEditConditionOperatorSlug(null);
        }}
      />
    </NodeContainer>
  );
};

type LeafNodeLoopConnectorProps = {
  inLoop?: boolean;
  operatorSlug: string;
  color: string;
  loopEndSlug?: string;
  yPos: number;
};

const LeafNodeLoopConnector: React.FC<LeafNodeLoopConnectorProps> = memo(
  (props) => {
    const { inLoop, operatorSlug, color, loopEndSlug, yPos } = props;

    const endLoopNode = useStore(
      useCallback(
        (store) => {
          let op: Node<FusionOperator> | undefined = undefined;
          for (const [k, n] of store.nodeInternals) {
            if (n.data.operator_slug === loopEndSlug) {
              op = n;
            }
          }
          return op;
        },
        [loopEndSlug]
      )
    );

    const needBottomEdge = useStore(
      useCallback(
        (store) => {
          if (inLoop) {
            const children = [];
            store.nodeInternals.forEach((v) => {
              if (v.data.parent_operator_slug === operatorSlug) {
                children.push(v);
              }
            });

            if (children.length === 0) {
              return true;
            }
          }

          return false;
        },
        [inLoop, operatorSlug]
      )
    );

    const extraEdgeHeight = useMemo(() => {
      return (endLoopNode?.position?.y || 0) - yPos - 50;
    }, [endLoopNode?.position?.y, yPos]);

    return needBottomEdge ? (
      <>
        <svg
          height={extraEdgeHeight}
          width={100}
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            pointerEvents: "none",
            // background: "#eee",
          }}
        >
          <line
            x1={50}
            y1={0}
            x2={50}
            y2={extraEdgeHeight}
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </>
    ) : null;
  },
  (prevProps, nextProps) =>
    prevProps.inLoop === nextProps.inLoop &&
    prevProps.loopEndSlug === nextProps.loopEndSlug &&
    prevProps.operatorSlug === nextProps.operatorSlug &&
    prevProps.color === nextProps.color &&
    prevProps.yPos === nextProps.yPos
);

type LoopConnectorProps = {
  sourceLoopNodeId?: string;
  yPos: number;
  xPos: number;
  isLoopEndOperator: boolean;
  operatorSlug: string;
  nodeId: string;
  color: string;
};

const LoopConnector: React.FC<LoopConnectorProps> = memo(
  (props) => {
    const {
      sourceLoopNodeId,
      yPos,
      xPos,
      isLoopEndOperator,
      operatorSlug,
      nodeId,
      color,
    } = props;

    const sourceLoopNode = useStore(
      useCallback(
        (store) =>
          store.nodeInternals.get(
            sourceLoopNodeId || ""
          ) as Node<FusionOperator>,
        [sourceLoopNodeId]
      )
    );

    const sourceNodeCoords = useMemo(() => {
      return sourceLoopNode?.position;
    }, [sourceLoopNode]);

    const edgeSvgHeight = useMemo(() => {
      return yPos - sourceNodeCoords?.y;
    }, [sourceNodeCoords, yPos]);

    const inLoopNodes = useStore(
      useCallback(
        (store) => {
          if (!isLoopEndOperator || !sourceLoopNode.data.operator_slug) {
            return [];
          }
          const nodes: Node<FusionOperator>[] = [];
          store.nodeInternals.forEach((n: Node<FusionOperator>) => {
            if (
              n.data?.in_loop &&
              n.data?.loop_data?.loop_start_slug ===
                sourceLoopNode?.data?.operator_slug &&
              n.data?.loop_data?.loop_end_slug === operatorSlug
            ) {
              nodes.push(n);
            }
          });

          return nodes;
        },
        [isLoopEndOperator, sourceLoopNode.data.operator_slug, operatorSlug]
      )
    );

    const edgeSvgWidth = useMemo(() => {
      const highestX = inLoopNodes?.length
        ? Math.max(...inLoopNodes.map((n) => n.position.x))
        : xPos;

      return highestX - xPos + 165;
    }, [inLoopNodes, xPos]);

    return (
      <>
        <svg
          height={edgeSvgHeight + 5}
          width={edgeSvgWidth + 5}
          style={{
            position: "absolute",
            bottom: "45px",
            left: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <linearGradient
              id={`grad-${nodeId}-loop`}
              x1={sourceLoopNode.position.x - xPos + 150}
              y1={5}
              x2={edgeSvgWidth}
              y2={5}
              gradientTransform="rotate(0)"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color} stopOpacity="0.4" />
              <stop offset="80%" stopColor={color} />
            </linearGradient>
          </defs>
          <line
            x1={sourceLoopNode.position.x - xPos + 150}
            y1={5}
            x2={edgeSvgWidth}
            y2={5}
            stroke={`url(#grad-${nodeId}-loop)`}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <line
            x1={edgeSvgWidth}
            y1={5}
            x2={edgeSvgWidth}
            y2={edgeSvgHeight}
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <line
            x1={0}
            y1={edgeSvgHeight}
            x2={edgeSvgWidth}
            y2={edgeSvgHeight}
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.sourceLoopNodeId === nextProps.sourceLoopNodeId &&
    prevProps.operatorSlug === nextProps.operatorSlug &&
    prevProps.nodeId === nextProps.nodeId &&
    prevProps.color === nextProps.color &&
    prevProps.isLoopEndOperator === nextProps.isLoopEndOperator &&
    prevProps.yPos === nextProps.yPos &&
    prevProps.xPos === nextProps.xPos
);

const ConnectorNode = styled(motion.div)({
  // "&:before": {
  //   position: "absolute",
  //   width: "47px",
  //   height: "47px",
  //   borderRadius: "50%",
  //   content: '""',
  //   background: "transparent",
  //   // border: "3px solid #fff",
  //   zIndex: 0,
  //   left: "50%",
  //   top: "50%",
  //   transform: "translate(-50%, -50%)",
  // },
});

type ConnectorProps = {
  nodeId: string;
  color: string;
  childCount: number;
  connectionNodeId: string | null;
  onAddClick(branchOut?: boolean): void;
};

const Connector: React.FC<ConnectorProps> = memo(
  (props) => {
    const { nodeId, color, onAddClick, childCount, connectionNodeId } = props;
    const controls = useAnimationControls();

    const [isConnecting, setIsConnecting] = useState(false);
    const connectionStatus = useStore((state) => state.connectionStatus);

    const selectedNode = useFusionFlowStore.useSelectedNode();
    const setHoveringNode = useFusionFlowStore.useSetHoveringAddNode();

    const lineCoords =
      childCount > 0
        ? {
            x1: 50,
            y1: 0,
            x2: 50,
            y2: 23,
          }
        : {
            x1: 50,
            y1: 0,
            x2: 50,
            y2: 4,
          };

    return (
      <Stack
        direction="column"
        sx={{
          position: "absolute",
          top: "100%",
          opacity: !!selectedNode?.id && selectedNode.id !== nodeId ? 0.4 : 1,
        }}
      >
        <svg height={childCount > 0 ? "30" : "12"} width="100">
          <defs>
            <linearGradient
              id={`grad${nodeId}`}
              {...lineCoords}
              gradientTransform="rotate(0)"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color} />
              <stop offset="80%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {childCount > 0 ? (
            <motion.line
              {...lineCoords}
              stroke={childCount > 0 ? `url(#grad${nodeId})` : color}
              strokeWidth="10"
              strokeLinecap="round"
              whileHover={{
                pathLength: 0.5,
              }}
              transition={{ ease: "easeInOut", duration: 0.2 }}
              initial={{ pathLength: 1 }}
              animate={controls}
            />
          ) : (
            <line
              {...lineCoords}
              stroke={childCount > 0 ? `url(#grad${nodeId})` : color}
              strokeWidth="10"
              strokeLinecap="round"
            />
          )}
        </svg>
        {childCount > 0 ? (
          <ConnectorNode
            className="connector-node"
            whileHover={{ scale: 1.2 }}
            onHoverStart={() => {
              controls.start({ pathLength: 0.9 });
              setHoveringNode(nodeId);
            }}
            onMouseMove={() => {
              if (connectionNodeId && connectionStatus === "valid") {
                setIsConnecting(true);
              }
            }}
            onHoverEnd={() => {
              controls.start({ pathLength: 1 });
              setHoveringNode(null);
              setIsConnecting(false);
            }}
            transition={{ ease: "easeInOut", duration: 0.2 }}
            style={{
              position: "relative",
              left: 38,
              color,
              width: "fit-content",
            }}
            // onClick={(e) => {
            //   e.stopPropagation();
            //   console.log("add click");
            //   onAddClick();
            // }}
          >
            <AddNodeIcon
              color={color}
              connectionNodeId={connectionNodeId}
              isConnecting={isConnecting}
              onClick={onAddClick}
            />
          </ConnectorNode>
        ) : (
          <ConnectorNode
            className="connector-node"
            style={{
              position: "relative",
              left: 38,
              color,
              width: "fit-content",
            }}
            onMouseMove={() => {
              if (connectionNodeId && connectionStatus === "valid") {
                setIsConnecting(true);
              }
            }}
            onHoverEnd={() => {
              setIsConnecting(false);
            }}
            // onClick={(e) => {
            //   e.stopPropagation();
            //   console.log("add click");
            //   onAddClick();
            // }}
          >
            <AddNodeIcon
              color={color}
              connectionNodeId={connectionNodeId}
              isConnecting={isConnecting}
              onClick={onAddClick}
            />
          </ConnectorNode>
        )}
      </Stack>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.nodeId === nextProps.nodeId &&
      prevProps.color === nextProps.color &&
      prevProps.childCount === nextProps.childCount &&
      prevProps.connectionNodeId === nextProps.connectionNodeId &&
      prevProps.onAddClick === nextProps.onAddClick
    );
  }
);

type AddNodeIconProps = {
  isConnecting: boolean;
  connectionNodeId: string | null;
  color: string;
  onClick(branchOut?: boolean): void;
};

const AddNodeIcon: React.FC<AddNodeIconProps> = memo(
  (props) => {
    const { isConnecting, connectionNodeId, color, onClick } = props;

    const connectingNode = useStore(
      useCallback(
        (state) => state.nodeInternals.get(`${connectionNodeId}`),
        [connectionNodeId]
      )
    );

    const { data: apps } = use3pApps();

    const app = apps?.find((app) => app.slug === connectingNode?.data.app);
    const connectingNodeColor = app?.app_color || color;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <Box
          sx={{
            background: color,
            width: "24px",
            height: "24px",
            borderRadius: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={(e) => {
            e.stopPropagation();
            // console.log("add click");
            onClick(true);
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleClick(e);
          }}
        >
          {isConnecting ? (
            <Box
              sx={{
                width: 24,
                height: 24,
                background: "#fff",
                border: `3px solid ${connectingNodeColor}`,
                borderRadius: "50%",
              }}
            />
          ) : (
            <AddIcon sx={{ color: "#fff" }} fontSize="small" />
          )}
        </Box>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              onClick(false);
              handleClose();
            }}
          >
            Add Node Inline
          </MenuItem>
          <MenuItem
            onClick={() => {
              onClick(true);
              handleClose();
            }}
          >
            Create Branch
          </MenuItem>
        </Menu>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isConnecting === nextProps.isConnecting &&
      prevProps.connectionNodeId === nextProps.connectionNodeId &&
      prevProps.color === nextProps.color &&
      prevProps.onClick === nextProps.onClick
    );
  }
);

export default memo(FlowNode);
