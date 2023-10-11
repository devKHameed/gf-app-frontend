import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { Box, styled } from "@mui/material";
import {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import CodeEditor from ".";

export const ErrorHolder = styled(Box)(({ theme }) => ({
  color: theme.palette.error.main,
  margin: "8px 0 0",
}));
export const CodeEditorField: React.ForwardRefExoticComponent<
  Omit<ReactCodeMirrorProps, "theme" | "value" | "onChange"> &
    React.RefAttributes<ReactCodeMirrorRef> &
    (
      | {
          mode: "json";
          value: Record<string, any>;
          onChange: (_: Record<string, any>) => void;
        }
      | {
          mode: "default" | "markdown";
          value: string;
          onChange: (_: string) => void;
        }
    )
> = forwardRef((props, ref) => {
  const { value, onChange, mode, ...rest } = props;

  const [valueString, setValueString] = useState(
    mode !== "json" ? value : JSON.stringify(value, null, 2)
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (mode === "json") {
      try {
        const valueStr = JSON.stringify(value || {}, null, 2);
        if (
          !valueString ||
          (valueString === "{}" && valueStr !== "{}") ||
          (valueString === "[]" && valueStr !== "[]")
        ) {
          setValueString(valueStr);
        }
        setError("");
      } catch (e) {}
    } else {
      if (!valueString) {
        setValueString(value);
      }
    }
  }, [value]);

  const extensions = useMemo(() => {
    const extension = [];
    if (mode === "json") extension.push(json());
    if (mode === "markdown") extension.push(markdown());
    return extension;
  }, [mode]);

  const onChangeHandler = (v: string) => {
    setValueString(v);
    if (mode === "json") {
      try {
        const valueStr = JSON.stringify(value, null, 2);
        setError("");
        if (valueStr === v) {
          return;
        }
        const jsonObj = JSON.parse(v) as unknown as Record<string, any>;
        if (error) {
          setError("");
        }

        onChange?.(jsonObj);
      } catch (e) {
        setError("Invalid JSON");
      }
    } else {
      onChange(v);
      setError("");
    }
  };
  return (
    <React.Fragment>
      <CodeEditor
        ref={(vref) => {
          if (ref) (ref as any).current = vref?.view;
        }}
        value={valueString}
        onChange={onChangeHandler}
        extensions={extensions}
        {...rest}
      />
      {error.length > 0 && <ErrorHolder>{error}</ErrorHolder>}
    </React.Fragment>
  );
});
export default CodeEditorField;
