import { motion } from "framer-motion";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const FlowNode: React.FC<NodeProps> = (props) => {
  const { data } = props;
  // console.log("🚀 ~ file: FlowNode.tsx:10 ~ props:", props);
  // const path = getStraightPath({
  //   sourceX: props.xPos,
  //   sourceY: props.yPos + 300,
  //   targetX: props.xPos,
  //   targetY: props.yPos + 3320,
  // });
  return (
    <motion.div
      // initial={{ scale: 0.8 }}
      // animate={{ scale: 1 }}
      // transition={
      //   {
      //     type: "spring",
      //     stiffness: 1000,
      //     damping: 20,
      //   }
      //   {
      //   mass: 0.2,
      //   duration: 0.1,
      // }
      // }
      style={{
        background: "#fff",
        width: "15px",
        height: "15px",
        border: `2px solid ${data.color}`,
        borderRadius: "100%",
      }}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: "2px",
          height: "2px",
          opacity: 0,
          top: 5,
          left: 8,
        }}
        isConnectable={false}
        id="connection-node"
      />
    </motion.div>
  );
};

export default memo(FlowNode);
