import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import Scrollbar from "components/Scrollbar";
import Spin from "components/Spin";
import { ParameterType } from "enums/3pApp";
import useSocket from "hooks/useSocket";
import isArray from "lodash/isArray";
import set from "lodash/set";
import ThreePAppRemoteProcedure from "models/ThreePAppRemoteProcedure";
import useAuthenticate from "queries/auth/useAuthenticate";
import React, { useState } from "react";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { BaseParamFieldProps } from "../NodeEditorFields";

type FileFolderFieldProps = {} & BaseParamFieldProps;

const FileFolderField: React.FC<FileFolderFieldProps> = (props) => {
  const { field, parentNamePath, watch, setValue, getValues } = props;
  const { name: fieldName } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  const { subscribe, unsubscribe } = useSocket();
  const selectedNode = useFusionFlowStore.useSelectedNode();
  const { data: authData } = useAuthenticate();
  const { user } = authData || {};

  const [prefix, setPrefix] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [loading, setLoading] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [menuItems, setMenuItems] = useState<
    (LabeledValue & { [key: string]: any })[]
  >([]);

  const value: string = watch(name);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    pFix?: string
  ) => {
    setLoading("base");
    console.log({ pFix });
    const target = event.currentTarget;
    const rpc = (
      (field.options as Record<string, any>).store as string
    ).replace("rpc://", "");
    const formValues = getValues();
    if (pFix != null) {
      set(formValues, name, pFix);
      setPrefix(pFix);
    }
    console.log({ formValues });
    subscribe("response", rpc, (data: SocketResponse) => {
      if (data.action === "rpc" && data.type === "response") {
        const rpcResponse = data.data as { rpc: string; data: unknown };
        let items = (
          isArray(rpcResponse.data) ? rpcResponse.data : []
        ) as (LabeledValue & {
          [key: string]: any;
        })[];
        if (field.type === ParameterType.Folder) {
          items = items.filter((i) => !!i.file);
        }
        if (rpcResponse.rpc === rpc) {
          setMenuItems(items as (LabeledValue & { [key: string]: any })[]);
          setLoading("");
          setAnchorEl(target);
          unsubscribe("response", rpc);
        }
      }
    });
    ThreePAppRemoteProcedure.execute(
      rpc,
      selectedNode?.data.app!,
      "",
      user?.slug!,
      formValues
    );
    // .then((res) => {
    //   console.log(res.data);
    //   setMenuItems(res.data as LabeledValue[]);
    //   setLoading("");
    //   setAnchorEl(event.currentTarget);
    // });
  };

  const handleSelect = (folder: string, isFile: string) => {
    if (isFile) {
      setFileSelected(true);
    }
    setValue(name, `${prefix ?? (value || "")}/${folder}`);
    setPrefix(null);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ background: "#ffffff0d", p: 1, borderRadius: "5px" }}>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: {
            maxWidth: 200,
          },
        }}
      >
        <Scrollbar autoHeight autoHeightMax={200}>
          {menuItems.map((item, index) => (
            <MenuItem
              sx={{
                whiteSpace: "normal",
                wordBreak: "break-all",
                hyphens: "auto",
              }}
              key={item.value}
              onClick={() => handleSelect(item.value!, item.file)}
            >
              {item.label}
            </MenuItem>
          ))}
        </Scrollbar>
      </Menu>
      {!value ? (
        <Button
          onClick={handleClick}
          size="small"
          variant="contained"
          color="primary"
          disableElevation
        >
          {loading === "base" ? (
            <Box
              sx={{
                ".MuiCircularProgress-root": {
                  width: "15px !important",
                  height: "15px !important",
                  color: "#ffffff",
                },
              }}
            >
              <Spin spinning />
            </Box>
          ) : (
            <>Click here to choose file</>
          )}
        </Button>
      ) : (
        <>
          {value
            .split("/")
            .filter(Boolean)
            .map((folder, i, arr) => {
              return (
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    px: 1,
                    background: "transparent",
                    border: "1px solid #ffffff4d",
                    minWidth: 0,
                    borderRadius: 0,
                  }}
                  onClick={(e) =>
                    handleClick(
                      e,
                      arr.reduce(
                        (acc, cur, idx) => (idx >= i ? acc : `${acc}/${cur}`),
                        ""
                      )
                    )
                  }
                >
                  / {folder}
                </Button>
              );
            })}
          {field.type === ParameterType.Folder ||
          (field.type === ParameterType.File && !fileSelected) ? (
            <Button
              size="small"
              variant="outlined"
              sx={{
                px: 1,
                background: "transparent",
                border: "1px solid #ffffff4d",
                minWidth: 0,
                borderRadius: 0,
              }}
              onClick={handleClick}
            >
              /
              {loading === "base" ? (
                <Box
                  sx={{
                    ".MuiCircularProgress-root": {
                      width: "15px !important",
                      height: "15px !important",
                      color: "#ffffff",
                    },
                  }}
                >
                  <Spin spinning />
                </Box>
              ) : (
                <AddCircleOutlineIcon sx={{ marginLeft: 1 }} fontSize="small" />
              )}
            </Button>
          ) : null}
        </>
      )}
    </Box>
  );
};

export default FileFolderField;
