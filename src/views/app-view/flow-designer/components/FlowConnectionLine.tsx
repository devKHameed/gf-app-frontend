import { useTheme } from "@mui/material";
import use3pApps from "queries/3p-app/use3pApps";
import React from "react";
import {
  ConnectionLineComponentProps,
  Node,
  Position,
  XYPosition,
} from "reactflow";

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

function getEdgePosition(node: Node, intersectionPoint: XYPosition) {
  const n = { ...node.position, ...node };
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

const FlowConnectionLine: React.FC<ConnectionLineComponentProps> = (props) => {
  const { fromX, fromY, toX, toY, fromNode } = props;

  const theme = useTheme();

  const { data: apps } = use3pApps();
  const app = apps?.find((app) => app.slug === fromNode?.data.app);
  const color = app?.app_color || theme.palette.primary.main;

  return (
    <g>
      <defs>
        <linearGradient
          id="connection-line-gradient"
          x1={fromX}
          y1={fromY + 40}
          x2={toX}
          y2={toY}
          gradientTransform="rotate(0)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset="90%" stopColor={color} />
        </linearGradient>
      </defs>
      <line
        x1={fromX}
        y1={fromY + 40}
        x2={toX}
        y2={toY}
        stroke="url(#connection-line-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle
        cx={toX}
        cy={toY}
        r="8"
        fill="#fff"
        stroke={color}
        strokeWidth="3"
      />
    </g>
  );
};

export default FlowConnectionLine;
