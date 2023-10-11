import { Box, Stack } from "@mui/material";
import { memo } from "react";
import useTranscriptionRef from "../hooks/useTranscriptionRef";

const Timelaps = memo(
  () => {
    const { totalDuration: duration } = useTranscriptionRef();
    let audioLength = duration || 0; // total audio length in seconds
    let sliceLength = 5; // slice length in seconds
    let numSlices = Math.ceil(audioLength / sliceLength);
    return (
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        className="dots-wrapper"
      >
        {new Array(numSlices).fill(0).map((num, index) => {
          if (index % 5 === 0) {
            return (
              <Box key={`interval=${index}`} className="interval">
                {index}s
              </Box>
            );
          }
          return (
            <>
              <Box key={`marker=${index}`} className="marker"></Box>
            </>
          );
        })}
      </Stack>
    );
  },
  () => true
);
export default Timelaps;
