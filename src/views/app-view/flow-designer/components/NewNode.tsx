import AddOutlined from "@mui/icons-material/AddOutlined";
import { Stack, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import AppSelection from "./AppSelection";
import FlowPopover from "./FlowPopover";

export type OnAppSelect = (
  data:
    | { app: ThreePApp; appModule: ThreePAppAction }
    | { app: null; appModule: SystemModule },
  id: string
) => void;

type NewNodeProps = {
  onAppSelect?: OnAppSelect;
};

type Props = NodeProps<FusionOperator> & NewNodeProps;

const FlowNode: React.FC<Props> = (props) => {
  const { onAppSelect, id, data } = props;
  const parentOperatorSlug = data.parent_operator_slug!;

  const layout = useFusionFlowStore.useLayout();

  const theme = useTheme();

  const layoutStyles =
    layout === "horizontal" ? { transform: "rotate(270deg)" } : {};

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 1000,
        damping: 20,
      }}
    >
      <FlowPopover
        containerProps={{
          title: "Select an app",
          disableScroll: true,
          hideFooter: true,
          hideHeader: true,
        }}
        content={
          <AppSelection
            parentOperatorSlug={parentOperatorSlug}
            onAppSelect={(data) => onAppSelect?.(data, id)}
          />
        }
      >
        <Stack
          sx={{
            width: "100px",
            height: "100px",
            borderRadius: "100%",
            padding: "14px",
            background: theme.palette.primary.main,
            ...layoutStyles,
          }}
          justifyContent="center"
          alignItems="center"
          className="drag-handle"
        >
          <Handle
            type="target"
            position={Position.Top}
            style={{
              background: "#555",
              // left: 60,
              // top: 10,
              width: "20px",
              height: "20px",
              opacity: 0,
            }}
            isConnectable={false}
            id="a"
          />
          <AddOutlined fontSize="large" />
        </Stack>
      </FlowPopover>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: "1px",
          height: "1px",
          opacity: 0,
          bottom: "20px",
        }}
        isConnectable={false}
        id="b"
      />
    </motion.div>
  );
};

export default memo(FlowNode);
