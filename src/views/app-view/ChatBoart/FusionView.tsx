import { Box } from "@mui/material";
import { FlowEdgeType, FlowNodeType } from "constants/index";
import useFusion from "queries/fusion/useFusion";
import React, { useEffect, useMemo } from "react";
import {
  EdgeTypes,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import FlowConnectionLine from "../flow-designer/components/FlowConnectionLine";
import FlowEdge from "../flow-designer/components/FlowEdge";
import FlowNode from "../flow-designer/components/FlowNode";

interface FusionViewProps {
  data?: JobSessionDisplayData;
}

const FusionView: React.FC<FusionViewProps> = (props) => {
  const { data = {} } = props;

  return (
    <Box sx={{ height: "calc(100vh - 110px)" }}>
      <ReactFlowProvider>
        <ReactFlowView fusionSlug={data.fusion_slug} />
      </ReactFlowProvider>
    </Box>
  );
};

const edgesTypes: EdgeTypes = {
  [FlowEdgeType.flowEdge]: (props) => <FlowEdge {...props} viewOnly />,
};

type ReactFlowViewProps = {
  fusionSlug?: string;
};

const ReactFlowView: React.FC<ReactFlowViewProps> = (props) => {
  const { fusionSlug } = props;

  const flowRef = useReactFlow();
  const [nodesState, setNodes, onNodesChange] = useNodesState([]);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState([]);

  const { data: fusion } = useFusion(fusionSlug);

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      [FlowNodeType.flowNode]: (props) => <FlowNode {...props} viewOnly />,
    }),
    []
  );

  useEffect(() => {
    if (fusion?.flow) {
      setNodes(fusion.flow.nodes || []);
      setEdges(fusion.flow.edges || []);

      const viewport = { x: 400, y: 100, zoom: 1 };
      flowRef.setViewport(viewport);
    }
  }, [fusion]);

  return (
    <ReactFlow
      nodes={nodesState}
      edges={edgesState}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onError={
        ((id: string, message: string) => {
          console.log("error", id, message);
        }) as any
      }
      maxZoom={1.5}
      minZoom={0.1}
      nodeTypes={nodeTypes}
      edgeTypes={edgesTypes}
      connectionLineComponent={FlowConnectionLine}
      zoomOnDoubleClick={false}
    />
  );
};

export default FusionView;
