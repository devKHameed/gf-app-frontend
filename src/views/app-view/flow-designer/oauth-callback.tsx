import { Box } from "@mui/material";
import Spin from "components/Spin";
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { getLocalStorage, parseQuery, setLocalStorage } from "utils";

type Props = {
  className?: string;
};

const OauthCallback: React.FC<Props> = (props) => {
  const { className } = props;

  console.log("render");

  const location = useLocation();
  const query = parseQuery(location.search);

  useEffect(() => {
    const authData = getLocalStorage("fusion:oauth2") as {
      connectionType: string;
    };
    const googleAccountAuth = getLocalStorage(
      "google-account:oauth2"
    ) as Record<string, unknown>;

    if (
      authData &&
      [
        "oauth2_authorization_code_refresh_token",
        "oauth2_authorization_code",
      ].includes(authData.connectionType)
    ) {
      setLocalStorage("fusion:oauth2", { ...authData, query });
    } else {
      setLocalStorage("google-account:oauth2", {
        ...googleAccountAuth,
        code: query.code,
      });
    }
    window?.close();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className={className}
    >
      <Spin spinning />
    </Box>
  );
};

export default OauthCallback;
