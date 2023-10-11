import { Box } from "@mui/material";
import { forwardRef, useRef } from "react";
import useWFPlayer from "views/app-view/TranscriptionEditor/hooks/useWFPlayer";

interface Props extends Partial<WFPlayer> {
  url: string;
}
const RcWFPlayer = forwardRef((props: Props, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const WFPlayerEle = useWFPlayer(containerRef, props);

  return (
    <>
      <Box ref={containerRef} maxHeight={75} minHeight={75} />
    </>
  );
});
export default RcWFPlayer;
