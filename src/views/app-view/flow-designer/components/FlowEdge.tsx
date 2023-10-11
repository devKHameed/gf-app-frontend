import { rgbToHex, useTheme } from "@mui/material";
import classNames from "classnames";
import { FlowNodeType } from "constants/index";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  EdgeProps,
  Node,
  NodeInternals,
  Position,
  XYPosition,
  getStraightPath,
  useStore,
} from "reactflow";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import EdgeEditorFields from "./EdgeEditorFields";
import FlowPopover, { FlowPopoverRef } from "./FlowPopover";

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode: Node, targetNode: Node) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    position: intersectionNodePosition,
  } = intersectionNode;
  const targetPosition = targetNode.position;

  if (
    intersectionNodeHeight == null ||
    intersectionNodeWidth == null ||
    intersectionNodePosition == null ||
    targetPosition == null
  ) {
    return { x: 0, y: 0 };
  }

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + w;
  const y1 = targetPosition.y + h;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node: Node, intersectionPoint: XYPosition) {
  const n = { ...node.positionAbsolute, ...node };
  const nx = Math.round(n.x!);
  const ny = Math.round(n.y!);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.width! - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y! + n.height! - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// find the intersection point of the line between the center of the circle and the target point. also consider negative coordinates
function getCircleIntersection(
  circle: Node,
  targetPoint: XYPosition
): XYPosition {
  const { x: cx, y: cy } = {
    x: circle.position.x + 100 / 2,
    y: circle.position.y + 100 / 2,
  };
  const { x: px, y: py } = targetPoint;
  const dx = px - cx;
  const dy = py - cy;
  const d = Math.sqrt(dx * dx + dy * dy);

  if (d === 0) {
    return targetPoint;
  }

  const angle = Math.atan2(dy, dx);
  const radius = d / Math.sin(angle);

  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function findLineCircleIntersections(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cx: number,
  cy: number,
  r: number
) {
  // Calculate the distance between the two points (x1, y1) and (x2, y2)
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.sqrt(dx * dx + dy * dy);

  // Calculate the direction of the line
  const dirX = dx / d;
  const dirY = dy / d;

  // Calculate the difference between the circle center and the line start point
  const diffX = cx - x1;
  const diffY = cy - y1;

  // Calculate the projection of the difference vector onto the line direction
  const proj = diffX * dirX + diffY * dirY;

  // Check if the circle and line intersect
  const dist = Math.sqrt(diffX * diffX + diffY * diffY - proj * proj);
  if (dist > r) {
    // The line and circle do not intersect
    return [];
  }

  // Calculate the distance from the line start point to the intersection points
  const d1 = proj - Math.sqrt(r * r - dist * dist);
  const d2 = proj + Math.sqrt(r * r - dist * dist);

  // Calculate the coordinates of the intersection points
  const xi1 = x1 + d1 * dirX;
  const yi1 = y1 + d1 * dirY;
  const xi2 = x1 + d2 * dirX;
  const yi2 = y1 + d2 * dirY;

  return [
    { x: xi1, y: yi1 },
    { x: xi2, y: yi2 },
  ];
}

function findIntersection(
  centerX: number,
  centerY: number,
  radius: number,
  slope: number
) {
  let a = centerX;
  let b = centerY;
  let m = slope;
  let c = b - m * a;

  let discriminant = Math.sqrt(
    Math.pow(2 * m * c - 2 * b, 2) -
      4 * (m * m + 1) * (c * c + b * b - radius * radius)
  );
  let x1 = (2 * m * c - 2 * b + discriminant) / (2 * (m * m + 1));
  let y1 = m * x1 + c;
  let x2 = (2 * m * c - 2 * b - discriminant) / (2 * (m * m + 1));
  let y2 = m * x2 + c;

  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ];
}

function slopeOfLine(x1: number, y1: number, x2: number, y2: number) {
  return (y2 - y1) / (x2 - x1);
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: Node, target: Node) {
  const s = {
    ...source,
    position: {
      x: source.position.x + 100 / 2,
      y: source.position.y + 100 + 40,
    },
    width: 1,
    height: 1,
  };
  const t = {
    ...target,
    position: {
      x: target.position.x + 100 / 2,
      y: target.position.y + 100 / 2,
    },
    width: 1,
    height: 1,
  };
  const sourceIntersectionPoint = getNodeIntersection(s, t);
  const targetIntersectionPoint = getNodeIntersection(t, s);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

export interface GetSmoothStepPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  borderRadius?: number;
  centerX?: number;
  centerY?: number;
  offset?: number;
}

export function getEdgeCenter({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}): [number, number, number, number] {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

  return [centerX, centerY, xOffset, yOffset];
}

const handleDirections = {
  [Position.Left]: { x: -1, y: 0 },
  [Position.Right]: { x: 1, y: 0 },
  [Position.Top]: { x: 0, y: -1 },
  [Position.Bottom]: { x: 0, y: 1 },
};

const getDirection = ({
  source,
  sourcePosition = Position.Bottom,
  target,
}: {
  source: XYPosition;
  sourcePosition: Position;
  target: XYPosition;
}): XYPosition => {
  if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
    return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
  }
  return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
};

function getPoints({
  source,
  sourcePosition = Position.Bottom,
  target,
  targetPosition = Position.Top,
  center,
  offset,
}: {
  source: XYPosition;
  sourcePosition: Position;
  target: XYPosition;
  targetPosition: Position;
  center: Partial<XYPosition>;
  offset: number;
}): [XYPosition[], number, number, number, number] {
  const sourceDir = handleDirections[sourcePosition];
  const targetDir = handleDirections[targetPosition];
  const sourceGapped: XYPosition = {
    x: source.x + sourceDir.x * offset,
    y: source.y + sourceDir.y * offset,
  };
  const targetGapped: XYPosition = {
    x: target.x + targetDir.x * offset,
    y: target.y + targetDir.y * offset,
  };
  const dir = getDirection({
    source: sourceGapped,
    sourcePosition,
    target: targetGapped,
  });
  const dirAccessor = dir.x !== 0 ? "x" : "y";
  const currDir = dir[dirAccessor];

  let points: XYPosition[] = [];
  let centerX, centerY;
  const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] =
    getEdgeCenter({
      sourceX: source.x,
      sourceY: source.y,
      targetX: target.x,
      targetY: target.y,
    });

  // opposite handle positions, default case
  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    centerX = center.x || defaultCenterX;
    centerY = center.y || defaultCenterY;
    //    --->
    //    |
    // >---
    const verticalSplit: XYPosition[] = [
      { x: centerX, y: sourceGapped.y },
      { x: centerX, y: targetGapped.y },
    ];
    //    |
    //  ---
    //  |
    const horizontalSplit: XYPosition[] = [
      { x: sourceGapped.x, y: centerY },
      { x: targetGapped.x, y: centerY },
    ];

    if (sourceDir[dirAccessor] === currDir) {
      points = dirAccessor === "x" ? verticalSplit : horizontalSplit;
    } else {
      points = dirAccessor === "x" ? horizontalSplit : verticalSplit;
    }
  } else {
    // sourceTarget means we take x from source and y from target, targetSource is the opposite
    const sourceTarget: XYPosition[] = [
      { x: sourceGapped.x, y: targetGapped.y },
    ];
    const targetSource: XYPosition[] = [
      { x: targetGapped.x, y: sourceGapped.y },
    ];
    // this handles edges with same handle positions
    if (dirAccessor === "x") {
      points = sourceDir.x === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource;
    }

    // these are conditions for handling mixed handle positions like Right -> Bottom for example
    if (sourcePosition !== targetPosition) {
      const dirAccessorOpposite = dirAccessor === "x" ? "y" : "x";
      const isSameDir =
        sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
      const sourceGtTargetOppo =
        sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
      const sourceLtTargetOppo =
        sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
      const flipSourceTarget =
        (sourceDir[dirAccessor] === 1 &&
          ((!isSameDir && sourceGtTargetOppo) ||
            (isSameDir && sourceLtTargetOppo))) ||
        (sourceDir[dirAccessor] !== 1 &&
          ((!isSameDir && sourceLtTargetOppo) ||
            (isSameDir && sourceGtTargetOppo)));

      if (flipSourceTarget) {
        points = dirAccessor === "x" ? sourceTarget : targetSource;
      }
    }

    centerX = points[0].x;
    centerY = points[0].y;
  }

  const pathPoints = [source, sourceGapped, ...points, targetGapped, target];

  return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}

const distance = (a: XYPosition, b: XYPosition) =>
  Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

function getBend(
  a: XYPosition,
  b: XYPosition,
  c: XYPosition,
  size: number
): string {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const { x, y } = b;

  // no bend
  if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
    return `L${x} ${y}`;
  }

  // first segment is horizontal
  if (a.y === y) {
    const xDir = a.x < c.x ? -1 : 1;
    const yDir = a.y < c.y ? 1 : -1;
    return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${
      y + bendSize * yDir
    }`;
  }

  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}

export function getSmoothStepPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  borderRadius = 5,
  centerX,
  centerY,
  offset = 20,
}: GetSmoothStepPathParams): [
  path: string,
  labelX: number,
  labelY: number,
  offsetX: number,
  offsetY: number,
  points?: XYPosition[]
] {
  const [points, labelX, labelY, offsetX, offsetY] = getPoints({
    source: { x: sourceX, y: sourceY },
    sourcePosition,
    target: { x: targetX, y: targetY },
    targetPosition,
    center: { x: centerX, y: centerY },
    offset,
  });

  const path = points.reduce<string>((res, p, i) => {
    let segment = "";

    if (i > 0 && i < points.length - 1) {
      segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
    } else {
      segment = `${i === 0 ? "M" : "L"}${p.x} ${p.y}`;
    }

    res += segment;

    return res;
  }, "");

  return [path, labelX, labelY, offsetX, offsetY, points];
}

const getPositions = (
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  source?: Node,
  target?: Node,
  layout?: string
): [XYPosition, XYPosition] => {
  const sourcePos = { x: sx, y: sy };
  const targetPos = { x: tx, y: ty };
  const sourcePosition =
    layout === "horizontal" ? Position.Right : Position.Bottom;
  const targetPosition = layout === "horizontal" ? Position.Left : Position.Top;

  if (sourcePosition === Position.Bottom) {
    if (!source || !target) {
      return [sourcePos, targetPos];
    }

    if (source.type === FlowNodeType.flowNode) {
      sourcePos.x = source.position.x + 50;
      sourcePos.y = source.position.y + 170;
    }

    if (target.type === FlowNodeType.flowNode) {
      targetPos.x = target.position.x + 50;
    }

    if (target.type === FlowNodeType.newNode) {
      targetPos.x = tx - 2;
    }
  } else {
    if (!source || !target) {
      return [sourcePos, targetPos];
    }

    if (source.type === FlowNodeType.flowNode) {
      sourcePos.x = sx + 15;
      sourcePos.y = sy - 10;
    }

    if (target.type === FlowNodeType.flowNode) {
      targetPos.y = ty + 10;
    }

    if (target.type === FlowNodeType.newNode) {
      targetPos.y = ty + 10;
    }
  }

  // if (target.type === FlowNodeType.newNode) {
  //   return [
  //     { x: (source.position.x || sx) + 55, y: (source.position.y || sy) + 15 },
  //     { x: tx, y: ty },
  //   ];
  // }

  return [sourcePos, targetPos];
};

const getSourcePosition = (
  sx: number,
  sy: number,
  tx: number,
  ty: number
): Position => {
  if (Math.round(tx) > Math.round(sx)) {
    return Position.Right;
  }

  if (Math.round(tx) < Math.round(sx)) {
    return Position.Left;
  }

  return Position.Bottom;
};

const getSourceCoordinates = (
  sx: number,
  sy: number,
  pos: Position,
  targetNode: Node,
  nodes: NodeInternals
) => {
  if (pos === Position.Bottom) {
    return { x: sx, y: sy };
  }

  const parentNode = (() => {
    let parent: Node | null = null;

    const values = nodes.values();
    let n = values.next();
    while (n) {
      if (n.done) {
        break;
      }
      if (n.value.data.operator_slug === targetNode.data.parent_operator_slug) {
        parent = n.value;
      }

      n = values.next();
    }

    return parent;
  })();

  // if (!parentNode) {
  //   throw new Error("No parent node found");
  // }

  if (pos === Position.Right) {
    const beforeSiblingXs = (() => {
      let sibling: Node[] = [];

      const values = nodes.values();
      let n = values.next();
      while (n) {
        if (n.done) {
          break;
        }
        if (
          n.value.data.parent_operator_slug ===
            parentNode?.data.operator_slug &&
          n.value.data.operator_slug !== targetNode.data.operator_slug &&
          Math.round(n.value.position.x) >
            Math.round(parentNode?.position.x || 0) &&
          Math.round(n.value.position.x) < Math.round(targetNode.position.x)
        ) {
          sibling.push(n.value);
        }

        n = values.next();
      }

      return sibling;
    })().map((n) => n.position.x);
    if (beforeSiblingXs.length) {
      return { x: Math.max(...beforeSiblingXs) + 50, y: sy - 25 };
    }
    return { x: sx + 20, y: sy - 25 };
  }
  if (pos === Position.Left) {
    const afterSiblingXs = (() => {
      let sibling: Node[] = [];

      const values = nodes.values();
      let n = values.next();
      while (n) {
        if (n.done) {
          break;
        }
        if (
          n.value.data.parent_operator_slug ===
            parentNode?.data.operator_slug &&
          n.value.data.operator_slug !== targetNode.data.operator_slug &&
          Math.round(n.value.position.x) <
            Math.round(parentNode?.position.x || 0) &&
          Math.round(n.value.position.x) > Math.round(targetNode.position.x)
        ) {
          sibling.push(n.value);
        }

        n = values.next();
      }

      return sibling;
    })().map((n) => n.position.x);
    if (afterSiblingXs.length) {
      return { x: Math.min(...afterSiblingXs) + 50, y: sy - 25 };
    }
    return { x: sx - 20, y: sy - 25 };
  }

  return { x: sx, y: sy };
};

const getLines = (points: XYPosition[], sp: Position) => {
  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));

  if (sp === Position.Right) {
    return [
      [
        { x: minX, y: minY },
        { x: maxX, y: minY },
      ],
      [
        { x: maxX, y: minY },
        { x: maxX, y: maxY },
      ],
    ];
  } else {
    return [
      [
        { x: maxX, y: minY },
        { x: minX, y: minY },
      ],
      [
        { x: minX, y: minY },
        { x: minX, y: maxY },
      ],
    ];
  }

  // if (sp === Position.Left) {
  // }

  // return [];
};

export default function FlowEdge(props: EdgeProps & { viewOnly?: boolean }) {
  const {
    id,
    // sourceX: sxx,
    // sourceY: syy,
    // targetX: txx,
    // targetY: tyy,
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
    // sourcePosition,
    // targetPosition,
    style = {},
    data,
    markerEnd,
    source,
    target,
    // selected,
    viewOnly,
    ...rest
  } = props;

  const theme = useTheme();

  const sourceNode = useStore(
    (store) => store.nodeInternals.get(source) as Node<FusionOperator>
  );

  const targetNode = useStore(
    (store) => store.nodeInternals.get(target) as Node<FusionOperator>
  );

  // const { sx, sy, tx, ty } = {
  //   sx: (sourceNode?.position?.x || 0) + (sourceNode?.width || 0) / 2,
  //   sy: (sourceNode?.position?.y || 0) + (sourceNode?.height || 0) + 100,
  //   tx: (targetNode?.position?.x || 0) + (targetNode?.width || 0) / 2,
  //   ty: targetNode?.position?.y || 0,
  // };

  // console.log({ sx, sy, tx, ty }, { sxx, syy, txx, tyy });

  const nodeInternals = useStore((store) => store.nodeInternals);

  const selectedEdge = useFusionFlowStore.useSelectedEdge();
  // console.log("🚀 ~ file: FlowEdge.tsx:717 ~ selectedEdge:", selectedEdge);
  const setSelectedEdge = useFusionFlowStore.useSetSelectedEdge();
  const selectedNode = useFusionFlowStore.useSelectedNode();
  const hoveringNode = useFusionFlowStore.useHoveringAddNode();
  const layout = useFusionFlowStore.useLayout();

  const edgePopoverRef = useRef<FlowPopoverRef>();

  const horizontalPathControl = useAnimationControls();
  const straightPathControl = useAnimationControls();

  const anchorRef = useRef<SVGGElement | null>(null);

  const selected = selectedEdge?.id === id;

  useEffect(() => {
    if (
      anchorRef.current &&
      selectedEdge &&
      selectedEdge.id === id &&
      !viewOnly
    ) {
      edgePopoverRef.current?.open(anchorRef.current);
    }
  }, [id, selectedEdge, viewOnly]);

  const targetPosition = layout === "horizontal" ? Position.Left : Position.Top;

  const [{ x: sourceX, y: sourceY }, { x: targetX, y: targetY }] = getPositions(
    sx,
    sy,
    tx,
    ty,
    sourceNode,
    targetNode,
    layout
  );
  // const sourceX = (sourceNode?.position.x || sx) + 55;
  // const sourceY = (sourceNode?.position.y || sy) + 15;
  // const targetX = tx;
  // const targetY = ty;
  // console.log({ sourceX, sourceY, targetX, targetY, selected, style, rest });
  const sp = getSourcePosition(sourceX, sourceY, targetX, targetY);
  const sourceCoords = getSourceCoordinates(
    sourceX,
    sourceY,
    sp,
    targetNode,
    nodeInternals
  );
  const [edgePath, lX, lY, oX, oY, points = []] = getSmoothStepPath({
    sourceX: sourceCoords.x,
    sourceY: sourceCoords.y,
    sourcePosition: sp,
    targetX: targetX,
    targetY: targetY,
    targetPosition,
    offset: 20,
  });
  // console.log(lX, lY);
  const [horizontal, vertical] = getLines(points, sp);

  let [straightPath, sLabelX, sLabelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX: targetX,
    targetY,
  });

  // let d = `M${horizontal[0].x},${horizontal[0].y - 5} L${horizontal[1].x},${
  //   horizontal[1].y - 5
  // } A 5 5 0 0 1 ${horizontal[1].x} ${horizontal[1].y + 5} L${horizontal[0].x},${
  //   horizontal[1].y + 5
  // } M${horizontal[0].x},${horizontal[0].y - 5} A 5 5 0 0 1 ${horizontal[0].x},${
  //   horizontal[0].y + 5
  // }`;

  // if (sourceCoords.x < targetX) {
  //   d = `M${horizontal[0].x},${horizontal[0].y - 5} L${horizontal[1].x},${
  //     horizontal[1].y - 5
  //   } A 5 5 0 0 1 ${horizontal[1].x} ${horizontal[1].y + 5} L${
  //     horizontal[0].x
  //   },${horizontal[1].y + 5} A 5 5 0 0 1 ${horizontal[0].x},${
  //     horizontal[0].y - 5
  //   }`;
  // }

  const color = data.color || rgbToHex(theme.palette.primary.main).slice(0, -2);

  useLayoutEffect(() => {
    if (hoveringNode === sourceNode.id) {
      horizontalPathControl.start({
        x1: horizontal[0].x - (sourceCoords.x < targetX ? -2 : 2),
      });
      straightPathControl.start({ y1: points[0].y - 8 + 2 });
    } else {
      horizontalPathControl.start({ x1: horizontal[0].x });
      straightPathControl.start({ y1: points[0].y - 8 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveringNode, sourceNode.id, horizontalPathControl]);

  if (layout === "free") {
    const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);
    const [edgePath, fLabelX, fLabelY] = getStraightPath({
      sourceX: sx,
      sourceY: sy,
      targetX: tx,
      targetY: ty,
    });
    return (
      <>
        <g
          className={classNames({
            "selected-node-edge": selectedNode?.id === target,
          })}
          onClick={() => setSelectedEdge(props)}
          ref={anchorRef}
        >
          <defs key={`grad${color}${sourceNode.id}${targetNode.id}`}>
            <linearGradient
              id={`grad${color}${sourceNode.id}${targetNode.id}`}
              {...{
                x1: sx,
                y1: sy,
                x2: tx,
                y2: ty,
                gradientTransform: "rotate(0)",
              }}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>
          {selected ? (
            <path
              id={id}
              style={{
                ...style,
                animation: "dashdraw 0.5s linear infinite",
              }}
              d={edgePath}
              markerEnd={markerEnd}
              strokeLinecap="butt"
              stroke={`url(#grad${color}${sourceNode.id}${targetNode.id})`}
              strokeWidth="10"
              // stroke={color}
              fill="none"
              strokeDasharray={5}
            />
          ) : (
            <motion.path
              id={id}
              style={{
                ...style,
                animation: undefined,
              }}
              d={edgePath}
              markerEnd={markerEnd}
              strokeLinecap="round"
              stroke={`url(#grad${color}${sourceNode.id}${targetNode.id})`}
              strokeWidth="10"
              // stroke={color}
              fill="none"
            />
          )}
        </g>
        <FlowPopover
          content={<EdgeEditorFields edgeData={targetNode.data.edge_data} />}
          ref={edgePopoverRef}
          containerProps={{
            title: "Edge Options",
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
            setSelectedEdge(null);
          }}
        />
      </>
    );
  }

  return (
    <>
      <g
        onClick={() => setSelectedEdge(props)}
        ref={anchorRef}
        className={classNames({
          "selected-node-edge": selectedNode?.id === target,
        })}
      >
        {sourceNode?.type === "connectionNode" ? (
          <>
            <path
              id={id}
              style={{
                ...style,
                animation: selected
                  ? "dashdraw 0.5s linear infinite"
                  : undefined,
              }}
              d={straightPath}
              markerEnd={markerEnd}
              strokeLinecap={selected ? "butt" : "round"}
              stroke={color}
              strokeWidth="10"
              strokeDasharray={selected ? "5" : undefined}
              fill="none"
            />
          </>
        ) : Math.round(sourceX) === Math.round(targetX) ? (
          <>
            <defs key={`grad${color}`}>
              <linearGradient
                id={`grad${color}`}
                {...{
                  x1: points[0].x,
                  y1: points[0].y - 8,
                  x2: points[points.length - 1].x,
                  y2: points[points.length - 1].y + 20,
                  gradientTransform: "rotate(0)",
                }}
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={color} stopOpacity="0.4" />
                <stop offset="60%" stopColor={color} />
              </linearGradient>
            </defs>
            {selected && !viewOnly ? (
              <line
                x1={points[0].x}
                y1={points[0].y - 8}
                x2={points[points.length - 1].x}
                y2={points[points.length - 1].y + 20}
                stroke={`url(#grad${color})`}
                style={{
                  ...style,
                  animation: selected
                    ? "dashdraw 0.5s linear infinite"
                    : undefined,
                }}
                // stroke={data.color}
                strokeWidth="10"
                strokeLinecap={selected ? "butt" : "round"}
                strokeDasharray={selected ? "5" : undefined}
              />
            ) : (
              <motion.line
                x1={points[0].x}
                x2={points[points.length - 1].x}
                y2={points[points.length - 1].y + 20}
                stroke={`url(#grad${color})`}
                style={{
                  ...style,
                  animation:
                    selected && !viewOnly
                      ? "dashdraw 0.5s linear infinite"
                      : undefined,
                }}
                strokeWidth="10"
                strokeLinecap={selected && !viewOnly ? "butt" : "round"}
                strokeDasharray={selected && !viewOnly ? "5" : undefined}
                animate={straightPathControl}
                initial={{ y1: points[0].y - 8 }}
              />
            )}
          </>
        ) : (
          <>
            <defs key={`grad${color}${sourceNode.id}${targetNode.id}`}>
              <linearGradient
                id={`grad${color}${sourceNode.id}${targetNode.id}`}
                x1={horizontal[0].x}
                y1={horizontal[0].y}
                x2={horizontal[1].x}
                y2={horizontal[1].y}
                gradientUnits="userSpaceOnUse"
              >
                {/* {sx < tx ? (
                <> */}
                <stop stopColor={`${color}4d`} />
                <stop offset="10%" stopColor={`${color}66`} />
                <stop offset="70%" stopColor={`${color}80`} />
                <stop offset="100%" stopColor={color} />
                {/* </>
              ) : (
                <>
                  <stop stopColor={color} />
                  <stop offset="40%" stopColor={`${color}80`} />
                  <stop offset="70%" stopColor={`${color}66`} />
                  <stop offset="100%" stopColor={`${color}4d`} />
                </>
              )} */}
              </linearGradient>
            </defs>
            {/* <motion.path
            d={d}
            style={{
              ...style,
              animation: selected ? "dashdraw 0.5s linear infinite" : undefined,
            }}
            fill={`url(#grad${color}${sourceNode.id}${targetNode.id})`}
            strokeDasharray={selected ? "5" : undefined}
            initial={{ pathLength: 1 }}
            // animate={horizontalPathControl}
            whileHover={{ pathLength: 0.8 }}
          /> */}
            {selected && !viewOnly ? (
              <line
                x1={horizontal[0].x}
                y1={horizontal[0].y}
                x2={horizontal[1].x}
                y2={horizontal[1].y}
                stroke={`url(#grad${color}${sourceNode.id}${targetNode.id})`}
                style={{
                  ...style,
                  animation: selected
                    ? "dashdraw 0.5s linear infinite"
                    : undefined,
                }}
                strokeWidth="10"
                strokeLinecap={selected ? "butt" : "round"}
                strokeDasharray={selected ? "5" : undefined}
              />
            ) : (
              <motion.line
                y1={horizontal[0].y}
                x2={horizontal[1].x}
                y2={horizontal[1].y}
                stroke={`url(#grad${color}${sourceNode.id}${targetNode.id})`}
                strokeWidth="10"
                strokeLinecap={selected && !viewOnly ? "butt" : "round"}
                strokeDasharray={selected && !viewOnly ? "5" : undefined}
                initial={{ x1: horizontal[0].x }}
                animate={horizontalPathControl}
                transition={{ ease: "easeInOut", duration: 0.2 }}
                key={`${horizontal[0].x}:${horizontal[1].x}:${horizontal[0].y}:${horizontal[1].y}:${targetNode.data.parent_operator_slug}`}
              />
            )}
            <line
              x1={vertical[0].x}
              y1={vertical[0].y}
              x2={vertical[1].x}
              y2={vertical[1].y + 20}
              stroke={color}
              style={{
                ...style,
                animation:
                  selected && !viewOnly
                    ? "dashdraw 0.5s linear infinite"
                    : undefined,
              }}
              // stroke={data.color}
              strokeWidth="10"
              strokeLinecap={selected && !viewOnly ? "butt" : "round"}
              strokeDasharray={selected && !viewOnly ? "5" : undefined}
              key={`${vertical[0].x}:${vertical[1].x}:${vertical[0].y}:${vertical[1].y}:${targetNode.data.parent_operator_slug}`}
            />
          </>
        )}
      </g>
      <FlowPopover
        content={<EdgeEditorFields edgeData={targetNode.data.edge_data} />}
        ref={edgePopoverRef}
        containerProps={{
          title: "Edge Options",
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
          setSelectedEdge(null);
        }}
      />
    </>
  );
}
