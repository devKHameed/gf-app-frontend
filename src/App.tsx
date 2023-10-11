import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PageMeta from "components/util-components/PageMeta";
import { SnackbarProvider } from "notistack";
import useAuthenticate from "queries/auth/useAuthenticate";
import React from "react";
import { useRoutes } from "react-router-dom";
import ThemeProvider from "theme";
import ThemeSettings from "theme/settings";
import "./App.css";
import routes from "./routes";
function App() {
  const content = useRoutes(routes);
  useAuthenticate();

  return (
    <React.Fragment>
      <ThemeProvider>
        <ThemeSettings>
          <SnackbarProvider maxSnack={3}>{content}</SnackbarProvider>
        </ThemeSettings>
      </ThemeProvider>
      <PageMeta />
      <ReactQueryDevtools position="bottom-right" />
    </React.Fragment>
  );
}

export default App;
