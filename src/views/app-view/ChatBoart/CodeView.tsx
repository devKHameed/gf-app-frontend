import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface CodeViewProps {
  data?: JobSessionDisplayData;
}

const CodeView: React.FC<CodeViewProps> = (props) => {
  const { data = {} } = props;

  const [codeContent, setCodeContent] = useState("");
  const codeQueue = useRef<string[]>([]);
  const doneCodeLines = useRef<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (codeQueue.current.length > 0) {
        const queueItem = codeQueue.current.shift();
        if (queueItem) {
          setCodeContent((prev) => prev + queueItem);
        }
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data.id && !doneCodeLines.current?.includes(data.id)) {
      if (data.code_action === "append") {
        codeQueue.current = [
          ...codeQueue.current,
          ...(data.code?.split("") || []),
        ];
      } else {
        codeQueue.current = data.code?.split("") || [];
      }
      doneCodeLines.current = [...doneCodeLines.current, data.id];
    }

    // if (data.code_action === "append") {
    //   setCodeContent((prev) => prev + (data.code || ""));
    // } else {
    //   setCodeContent(data.code || "");
    // }
  }, [data]);

  return (
    <Box sx={{ p: 2 }}>
      <div dangerouslySetInnerHTML={{ __html: codeContent }} />
    </Box>
  );
};

export default CodeView;
