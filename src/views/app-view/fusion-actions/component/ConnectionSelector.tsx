import { FlashOnRounded } from "@mui/icons-material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import DeleteOutline from "assets/icons/DeleteOutline";
import FormField from "components/FormField";
import useOpenClose from "hooks/useOpenClose";
import useList3pSubmodule from "queries/3p-app-submodules/useList3pSubmodule";
import { ThreePAppSubModels } from "queries/apiModelMapping";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";

type Props = {
  value?: string;
  onChange?: (_: string | undefined) => void;
  label?: string | ReactElement;
  module?:
    | typeof ThreePAppSubModels.ThreePAppConnection
    | typeof ThreePAppSubModels.ThreePAppWebhook;
};

const ConnectionWrapper = styled(Stack)(({ theme }) => {
  return {
    gap: "6px",
  };
});

const ConnectionBox = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    lineHeight: "24px",
    color: theme.palette.text.secondary,
    marginTop: "20px",
    paddingLeft: "10px",

    ".MuiButtonBase-root ": {
      width: "36px",
      height: "36px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid ${theme.palette.background.GF20}`,
      background: theme.palette.background.GF5,
      color: theme.palette.text.primary,
      padding: "0",
      transition: "all 0.4s ease",

      "&:hover": {
        border: `1px solid ${theme.palette.background.GF40}`,
        background: theme.palette.background.GF40,
      },

      svg: {
        width: "20px",
        height: "auto",
      },
    },
  };
});

const ConnectionSelector = ({
  value: propValue,
  onChange,
  label,
  module,
}: Props) => {
  const { slug: threePAppSlug } =
    useParams<{ slug: string; datasetSlug: string }>();
  const { data: threePAppsConnections } = useList3pSubmodule(
    module || ThreePAppSubModels.ThreePAppConnection,
    { app: threePAppSlug! }
  );
  const [value, setValue] = useState<string | undefined>(propValue);
  const theme = useTheme();
  const [isOpen, onOpen, onClose] = useOpenClose();
  const [selectValue, setSelectValue] = useState<string | undefined>(propValue);

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  const handleSubmit = () => {
    setValue(selectValue);
    onChange?.(selectValue);
    onClose();
  };
  const selectedConnection = useMemo(
    () => threePAppsConnections?.find(({ slug }) => slug === value),
    [value, threePAppsConnections]
  );
  return (
    <ConnectionWrapper className="connection-wrapper">
      {label && <Typography variant="h6">{label}</Typography>}
      {!value ? (
        <ConnectionBox className="connection-box" onClick={onOpen}>
          <IconButton>
            <AddOutlinedIcon />
          </IconButton>
          Attach Connection
        </ConnectionBox>
      ) : (
        <Box>
          <ProfileCard
            // sx={{ marginBottom: 1.5 }}
            options={{ draggable: false, switcher: false }}
            title={selectedConnection?.label || ""}
            subTitle={
              "To access parameters of this connection in attach/detach, use {{connection.paraName}}"
            }
            AvatarImage={
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  background: theme.palette.warning.main,
                  borderRadius: "6px",
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                  mr: 0.75,
                }}
              >
                <FlashOnRounded />
              </Stack>
            }
            rightIcon={
              <Box
                className="delete-holder"
                onClick={() => setValue(undefined)}
              >
                <DeleteOutline
                  sx={{
                    width: "20px",
                    height: "auto",
                  }}
                />
              </Box>
            }
          />
        </Box>
      )}

      <Dialog
        onClose={onClose}
        disableEscapeKeyDown
        scroll="body"
        open={isOpen}
      >
        <DialogTitle>Add a Connection</DialogTitle>

        <DialogContent>
          <Box component="form">
            <FormField label="Module action">
              <Select
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
              >
                {threePAppsConnections?.map((op) => (
                  <MenuItem key={op.label} value={op.slug}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormField>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </ConnectionWrapper>
  );
};

export default ConnectionSelector;
