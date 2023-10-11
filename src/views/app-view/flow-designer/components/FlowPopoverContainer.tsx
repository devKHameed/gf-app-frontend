import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Button, Grid, Stack, Typography, useTheme } from "@mui/material";
import Scrollbar from "components/Scrollbar";
import React, { PropsWithChildren } from "react";

type Props = {
  title?: string;
  disableScroll?: boolean;
  hideFooter?: boolean;
  hideHeader?: boolean;
  onSaveClick?(): void;
  onCloseClick?(): void;
};

export type FlowPopoverContainerProps = Props;

const FlowPopoverContainer: React.FC<PropsWithChildren<Props>> = (props) => {
  const {
    title,
    disableScroll,
    hideFooter,
    hideHeader,
    onSaveClick,
    onCloseClick,
    children,
  } = props;

  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.GFRightNavBackground,
        minHeight: 200,
        width: "100%",
        borderRadius: 1,
      }}
    >
      <Grid container direction="column">
        {!hideHeader && (
          <Grid item xs={1}>
            <Box
              sx={{
                backgroundColor: theme.palette.primary.main,
                px: 2,
                py: 1.75,
                borderRadius: "6px 6px 0 0",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>{title}</Typography>
                <InfoOutlinedIcon />
              </Stack>
            </Box>
          </Grid>
        )}
        <Grid
          item
          xs={10}
          sx={{ minHeight: "78px", maxWidth: "100% !important" }}
        >
          {!disableScroll ? (
            <Scrollbar autoHeight autoHeightMax={"calc(100vh - 500px)"}>
              <Box>{children}</Box>
            </Scrollbar>
          ) : (
            <Box>{children}</Box>
          )}
        </Grid>
        {!hideFooter && (
          <Grid item xs={1}>
            <Box
              sx={{
                backgroundColor: theme.palette.primary.main,
                p: 2.25,
                borderRadius: "0 0 6px 6px",
              }}
            >
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1.5}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{ borderColor: "#fff", color: "#fff" }}
                  onClick={onCloseClick}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  sx={{
                    backgroundColor: "#fff",
                    color: theme.palette.primary.main,
                    borderColor: "#fff",
                    boxShadow: "none",
                  }}
                  onClick={onSaveClick}
                >
                  Save Changes
                </Button>
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FlowPopoverContainer;
