import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import CodeEditor from "components/CodeEditor";
import React, { useMemo } from "react";
import { Controller } from "react-hook-form";
import { BaseParamFieldProps } from "../NodeEditorFields";

type CodeFieldProps = {
  mode: string;
} & BaseParamFieldProps;

const CodeField: React.FC<CodeFieldProps> = (props) => {
  const { field, control, parentNamePath } = props;
  const { name: fieldName, mode } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  const extension = useMemo(() => {
    if (mode === "html") {
      return html();
    }

    if (mode === "css") {
      return css();
    }

    return javascript();
  }, [mode]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CodeEditor
          value={field.value}
          onChange={(value) => field.onChange(value)}
          extensions={[extension]}
        />
      )}
    />
  );
};

export default CodeField;
