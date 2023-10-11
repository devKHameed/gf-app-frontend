import { styled } from "@mui/material/styles";
import ReactCodeMirror, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import React, { forwardRef } from "react";

const CodeEditor: React.ForwardRefExoticComponent<
  ReactCodeMirrorProps & React.RefAttributes<ReactCodeMirrorRef>
> = forwardRef((props, ref) => {
  const { ...rest } = props;
  return <ReactCodeMirror ref={ref} theme={"dark"} {...rest} />;
});

export default styled(CodeEditor)(({ theme }) => {
  return {
    ".cm-editor, .cm-activeLineGutter, .cm-gutters": {
      background: theme.palette.background.GFRightNavBackground,
    },

    ".cm-editor": {
      borderRadius: "5px",
      border: `1px solid  ${theme.palette.background.GF40}`,
      overflow: "hidden",
    },

    ".cm-gutters": {
      borderRightColor: theme.palette.background.GFRightNavBackground,
    },

    ".cm-activeLine": {
      background: theme.palette.background.GFRightNavForeground,
    },

    ".cm-activeLineGutter": {
      color: theme.palette.common.white,
    },

    ".cm-cursor": {
      borderLeftColor: theme.palette.common.white,
    },
  };
});
