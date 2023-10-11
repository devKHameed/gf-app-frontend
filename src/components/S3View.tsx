import { Box } from "@mui/material";
import axios from "axios";
import { S3_CLOUD_FRONT_URL } from "configs/AppConfig";
import React, { useEffect, useState } from "react";

interface S3ViewProps {
  data?: JobSessionDisplayData;
}

const S3View: React.FC<S3ViewProps> = (props) => {
  const { data = {} } = props;
  const {
    html: htmlUrl,
    css: cssUrl,
    js: jsUrl,
    code: codeUrl,
    display_type,
  } = data;

  switch (display_type) {
    case "html":
      return <HTMLTypeView htmlUrl={htmlUrl} cssUrl={cssUrl} jsUrl={jsUrl} />;
    case "code":
      return <CodeTypeView codeUrl={codeUrl} />;
    default:
      return <div></div>;
  }
};

type CodeTypeViewProps = {
  codeUrl?: string;
};

const CodeTypeView: React.FC<CodeTypeViewProps> = (props) => {
  const { codeUrl } = props;

  const [codeContent, setCodeContent] = useState("");

  useEffect(() => {
    if (codeUrl) {
      axios
        .get(`${S3_CLOUD_FRONT_URL}/${codeUrl}`)
        .then((res) => setCodeContent(res.data))
        .catch((e) => console.error);
    }
  }, [codeUrl]);

  return (
    <Box sx={{ p: 2 }}>
      <div dangerouslySetInnerHTML={{ __html: codeContent }} />
    </Box>
  );
};

type HTMLTypeViewProps = {
  htmlUrl?: string;
  cssUrl?: string;
  jsUrl?: string;
};

const HTMLTypeView: React.FC<HTMLTypeViewProps> = (props) => {
  const { htmlUrl, cssUrl, jsUrl } = props;

  const [htmlContent, setHtmlContent] = useState("");
  const [jsContent, setJsContent] = useState("");
  const [cssContent, setCssContent] = useState("");

  useEffect(() => {
    if (htmlUrl) {
      axios
        .get(`${S3_CLOUD_FRONT_URL}/${htmlUrl}`)
        .then((res) => setHtmlContent(res.data))
        .catch((e) => console.error);
    }
    if (jsUrl) {
      axios
        .get(`${S3_CLOUD_FRONT_URL}/${jsUrl}`)
        .then((res) => setJsContent(res.data))
        .catch((e) => console.error);
    }
    if (cssUrl) {
      axios
        .get(`${S3_CLOUD_FRONT_URL}/${cssUrl}`)
        .then((res) => setCssContent(res.data))
        .catch((e) => console.error);
    }
  }, [htmlUrl, jsUrl, cssUrl]);

  return (
    <Box sx={{ p: 2 }}>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <script dangerouslySetInnerHTML={{ __html: jsContent }} />
      <style>{cssContent}</style>
    </Box>
  );
};

export default S3View;
