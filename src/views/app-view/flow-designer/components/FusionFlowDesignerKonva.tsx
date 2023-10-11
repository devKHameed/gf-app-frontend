import {
  Box,
  Menu,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  useTheme,
} from "@mui/material";
import { Instance } from "@popperjs/core";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { ShapeConfig } from "konva/lib/Shape";
import useFusion from "queries/fusion/useFusion";
import React, { useEffect, useRef, useState } from "react";
import {
  Circle,
  Group,
  Image,
  Layer,
  Line,
  Shape,
  Stage,
  StageProps,
} from "react-konva";
import { useParams } from "react-router-dom";
import { Position } from "reactflow";
import { v4 } from "uuid";
import AppSelection from "./AppSelection";
import FlowPopoverContainer from "./FlowPopoverContainer";

export const NodeEditorTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    width: 450,
    padding: 0,
    maxWidth: "none",
    maxHeight: "800px",
    backgroundColor: theme.palette.background.GFRightNavBackground,
    overflowY: "auto",
    overflow: "hidden",
  },
}));

type Props = {};

const coords = [900, 200];
const coords2 = [500, 600];

const scaleBy = 1.05;

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.5;

const alpha = {
  100: "FF",
  99: "FC",
  98: "FA",
  97: "F7",
  96: "F5",
  95: "F2",
  94: "F0",
  93: "ED",
  92: "EB",
  91: "E8",
  90: "E6",
  89: "E3",
  88: "E0",
  87: "DE",
  86: "DB",
  85: "D9",
  84: "D6",
  83: "D4",
  82: "D1",
  81: "CF",
  80: "CC",
  79: "C9",
  78: "C7",
  77: "C4",
  76: "C2",
  75: "BF",
  74: "BD",
  73: "BA",
  72: "B8",
  71: "B5",
  70: "B3",
  69: "B0",
  68: "AD",
  67: "AB",
  66: "A8",
  65: "A6",
  64: "A3",
  63: "A1",
  62: "9E",
  61: "9C",
  60: "99",
  59: "96",
  58: "94",
  57: "91",
  56: "8F",
  55: "8C",
  54: "8A",
  53: "87",
  52: "85",
  51: "82",
  50: "80",
  49: "7D",
  48: "7A",
  47: "78",
  46: "75",
  45: "73",
  44: "70",
  43: "6E",
  42: "6B",
  41: "69",
  40: "66",
  39: "63",
  38: "61",
  37: "5E",
  36: "5C",
  35: "59",
  34: "57",
  33: "54",
  32: "52",
  31: "4F",
  30: "4D",
  29: "4A",
  28: "47",
  27: "45",
  26: "42",
  25: "40",
  24: "3D",
  23: "3B",
  22: "38",
  21: "36",
  20: "33",
  19: "30",
  18: "2E",
  17: "2B",
  16: "29",
  15: "26",
  14: "24",
  13: "21",
  12: "1F",
  11: "1C",
  10: "1A",
  9: "17",
  8: "14",
  7: "12",
  6: "0F",
  5: "0D",
  4: "0A",
  3: "08",
  2: "05",
  1: "03",
  0: "00",
};

type FlowNodeProps = {
  position: { x: number; y: number };
  onNodeClick?(position: { x: number; y: number }): void;
  onNodeContextMenu?(e: PointerEvent): void;
  onAddClick?(e: PointerEvent): void;
} & ShapeConfig;

const FlowNode: React.FC<FlowNodeProps> = (props) => {
  const theme = useTheme();
  const {
    position,
    onNodeClick,
    onNodeContextMenu,
    onAddClick,
    ...shapeProps
  } = props;
  const { x, y } = position;

  const positionRef = React.useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const popperRef = React.useRef<Instance>(null);
  const areaRef = React.useRef<HTMLDivElement>(null);

  const [imageObj, setImageObj] = useState<HTMLImageElement>();
  const [lineGradient, setLineGradient] = useState<CanvasGradient>();

  useEffect(() => {
    const img = new window.Image();
    img.src =
      "https://d3eqpfgwpn6v2o.cloudfront.net/ad01ac32-276d-4468-9c5a-d3c9746b2425/5d13944ca4204-7bf7c5d0-2bcb-45c6-be4c-90a801c8eeb3.png?not-from-cache-please";
    img.setAttribute("crossOrigin", "Anonymous");
    img.onload = () => {
      setImageObj(img);
    };

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 100, 0, 145);
      grad.addColorStop(0, theme.palette.primary.main);
      grad.addColorStop(
        0.5,
        `${theme.palette.primary.main.slice(0, -4)}, 0.9)`
      );
      grad.addColorStop(
        0.7,
        `${theme.palette.primary.main.slice(0, -4)}, 0.7)`
      );
      grad.addColorStop(1, `${theme.palette.primary.main.slice(0, -4)}, 0.5)`);
      setLineGradient(grad);
    }
  }, []);

  const handleNodeClick = (e: KonvaEventObject<MouseEvent>) => {
    console.log(
      "🚀 ~ file: FusionFlowDesignerKonva.tsx:178 ~ handleNodeClick ~ e:",
      e
    );
    e.cancelBubble = true;
    // e.evt.cancelBubble = true;
    onNodeClick?.(position);
  };

  const handleContextMenu = (e: KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
    e.cancelBubble = true;
    onNodeContextMenu?.(e.evt);
  };

  const handleAddClick = (e: KonvaEventObject<PointerEvent>) => {
    e.cancelBubble = true;
    onAddClick?.(e.evt);
  };

  return (
    <>
      <Group draggable x={x} y={y}>
        <Line
          points={[0, 100, 0, 145]}
          stroke={lineGradient}
          strokeWidth={15}
          lineCap="round"
        />
        <Group
          x={0}
          y={0}
          onContextMenu={handleContextMenu}
          onClick={handleNodeClick}
        >
          <Circle
            x={0}
            y={0}
            radius={100}
            strokeWidth={3}
            stroke={theme.palette.primary.main}
            fill="#fff"
          />
          <Image width={150} height={150} x={-75} y={-75} image={imageObj} />
        </Group>
        <Group x={0} y={180} onClick={handleAddClick}>
          <Circle x={0} y={0} radius={20} fill={theme.palette.primary.main} />
          <Line points={[0, -10, 0, 10]} stroke="#fff" strokeWidth={3} />
          <Line points={[-10, 0, 10, 0]} stroke="#fff" strokeWidth={3} />
        </Group>
      </Group>
      {/* <FlowPopover
        content={<></>}
        containerProps={{ title: "Operator sample" }}
      /> */}
    </>
  );
};

const NewNode: React.FC<FlowNodeProps> = (props) => {
  const { position, onNodeClick, ...shapeProps } = props;
  const { x, y } = position;
  const theme = useTheme();

  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      const tween2 = new Konva.Tween({
        node: ref.current,
        duration: 0.1,
        radius: 90,
        scaleX: 1.1,
        scaleY: 1.1,
        onFinish: function () {
          const tween3 = new Konva.Tween({
            node: ref.current,
            duration: 0.1,
            scaleX: 1,
            scaleY: 1,
            radius: 100,
          });
          tween3.play();
        },
      });
      tween2.play();
    }
  }, []);

  return (
    <Group
      draggable
      ref={ref}
      x={x}
      y={y}
      onClick={() => onNodeClick?.(position)}
    >
      <Circle
        x={0}
        y={0}
        radius={100}
        fill={theme.palette.primary.main}
        ref={ref}
        {...shapeProps}
      />
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath();
          ctx.moveTo(0, -20);
          ctx.lineTo(0, 20);
          ctx.moveTo(-20, 0);
          ctx.lineTo(20, 0);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 10;
          ctx.stroke();

          ctx.fillStrokeShape(shape);
        }}
      />
    </Group>
  );
};

type TooltipComponentProps = {
  type?: string;
};

const TooltipComponent: React.FC<TooltipComponentProps> = (props) => {
  const { type } = props;
  console.log("🚀 ~ file: FusionFlowDesignerKonva.tsx:324 ~ type:", type);

  switch (type) {
    case "node-editor":
      return <FlowPopoverContainer>ABC</FlowPopoverContainer>;
    case "app-selection":
      return <AppSelection parentOperatorSlug="" />;
    default:
      return <></>;
  }
};

type PositionXY = {
  x: number;
  y: number;
};

type KonvaCanvasProps = {
  nodes: Node<FusionOperator>[];
  edges: Edge[];
  layerRef?: React.Ref<Konva.Layer>;
  onNodeClick?(node: Node<FusionOperator>, position: PositionXY): void;
  onNodeContextMenu?(event: PointerEvent, node: Node<FusionOperator>): void;
  onAddClick?(event: PointerEvent, node: Node<FusionOperator>): void;
} & StageProps;

const KonvaCanvas: React.FC<KonvaCanvasProps> = (props) => {
  const {
    nodes,
    edges,
    onNodeClick,
    onNodeContextMenu,
    onAddClick,
    layerRef,
    ...stageProps
  } = props;

  const stageRef = useRef<Konva.Stage | null>(null);

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      draggable
      onWheel={(e) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) {
          return;
        }

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (!pointer) {
          return;
        }

        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
          direction = -direction;
        }

        const newScale =
          direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        if (newScale <= MAX_ZOOM && newScale >= MIN_ZOOM) {
          stage.scale({ x: newScale, y: newScale });

          const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
          };
          stage.position(newPos);
        }
      }}
      {...stageProps}
    >
      <Layer ref={layerRef}>
        {nodes.map((n) =>
          n.type === "new-node" ? (
            <NewNode
              key={n.id}
              position={n.position}
              onNodeClick={(pos) => {
                onNodeClick?.(n, pos);
              }}
            />
          ) : (
            <FlowNode
              key={n.id}
              position={n.position}
              onNodeClick={(pos) => {
                onNodeClick?.(n, pos);
              }}
              onNodeContextMenu={(e) => {
                onNodeContextMenu?.(e, n);
              }}
              onAddClick={(e) => {
                onAddClick?.(e, n);
              }}
            />
          )
        )}
      </Layer>
    </Stage>
  );
};

const getPoints = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
}: any) => {
  if (sourcePosition === Position.Left) {
    const p1 = [sourceX, sourceY];
    const p2 = [targetX, sourceY];
    const p3 = [targetX, targetY];

    return [p1, p2, p3];
  }
};

type Node<T = Record<string, unknown>> = {
  id: string;
  position: { x: number; y: number };
  data?: T;
  type: string;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  data?: unknown;
};

const getCursorPosition = (event: MouseEvent, canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
};

const FusionFlowDesignerKonva: React.FC<Props> = (props) => {
  const { fusionSlug } = useParams<{ fusionSlug: string }>();
  const theme = useTheme();

  const { data: fusion } = useFusion(fusionSlug);

  const lineRef = useRef<any>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  console.log(
    "🚀 ~ file: FusionFlowDesignerKonva.tsx:488 ~ positionRef:",
    positionRef.current
  );
  const contextMenuRef = useRef<{ type: string }>();
  const popoverContentRef = useRef<{ type: string }>();

  const [open, setOpen] = useState(false);
  console.log(
    "🚀 ~ file: FusionFlowDesignerKonva.tsx:520 ~ open:",
    open,
    popoverContentRef.current
  );
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [nodes, setNodes] = useState<Node<FusionOperator>[]>([
    // { id: "1", position: { x: coords[0], y: coords[1] }, type: "flow-node" },
  ]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (fusion?.flow?.nodes) {
      setNodes(fusion.flow.nodes as Node<FusionOperator>[]);
    }
  }, [fusion]);

  const handleClose = () => {
    setContextMenuOpen(false);
  };

  return (
    <>
      <Menu
        open={contextMenuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: positionRef.current.y,
          left: positionRef.current.x,
        }}
      >
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
      <NodeEditorTooltip
        title={<TooltipComponent type={popoverContentRef.current?.type} />}
        // title="ABC"
        open={open}
        onClose={() => setOpen(false)}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        arrow
        placement="right-start"
        PopperProps={{
          anchorEl: {
            getBoundingClientRect() {
              return new DOMRect(
                positionRef.current.x + 100,
                positionRef.current.y,
                0,
                0
              );
            },
          },
        }}
      >
        <Box>
          <KonvaCanvas
            nodes={nodes}
            edges={[]}
            layerRef={layerRef}
            onClick={(e) => {
              console.log("stage clicked", e);
              if (open) {
                setOpen(false);
                popoverContentRef.current = undefined;
                positionRef.current = { x: 0, y: 0 };
              }
            }}
            onDblClick={(e) => {
              if (layerRef.current) {
                const canvas = layerRef.current.getCanvas()._canvas;
                setNodes((nds) =>
                  nds.concat({
                    id: v4(),
                    position: getCursorPosition(e.evt, canvas),
                    type: "new-node",
                  })
                );
              }
            }}
            onNodeClick={(n, pos) => {
              if (n.type === "new-node") {
                positionRef.current = { x: pos.x, y: pos.y };
                popoverContentRef.current = { type: "app-selection" };
                setOpen(true);
              } else if (n.type === "flow-node") {
                positionRef.current = { x: pos.x, y: pos.y };
                popoverContentRef.current = { type: "node-editor" };
                setOpen(true);
              }
            }}
            onNodeContextMenu={(e, n) => {
              setOpen(false);
              positionRef.current = { x: e.x, y: e.y };
              contextMenuRef.current = { type: "node-menu" };
              setContextMenuOpen(true);
            }}
            onAddClick={(e, n) => {
              const canvas = layerRef.current?.getCanvas()._canvas;
              if (!canvas) {
                return;
              }

              const pos = getCursorPosition(e, canvas);
              setNodes((nds) =>
                nds.concat({
                  id: v4(),
                  position: { x: pos.x, y: pos.y + 200 },
                  type: "new-node",
                })
              );
            }}
          />
        </Box>
      </NodeEditorTooltip>
    </>
  );
};

export default FusionFlowDesignerKonva;
