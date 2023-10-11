import {
  Checkbox,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { isArray } from "lodash";
import ThreePAppRemoteProcedure from "models/ThreePAppRemoteProcedure";
import useAuthenticate from "queries/auth/useAuthenticate";
import React, { memo, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { useRPCStore } from "store/stores/rpc";
import { BaseParamFieldProps } from "../NodeEditorFields";

type SelectFieldProps = {} & BaseParamFieldProps;

const MultipleSelect: React.FC<SelectFieldProps> = (props) => {
  const { field, control, parentNamePath } = props;
  const { options, name: fieldName } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: formField }) => {
        return (
          <Select
            value={formField.value || []}
            onChange={(e) => {
              formField.onChange(e.target.value);
            }}
            id={field.name}
            multiple
            input={<OutlinedInput size="small" />}
            renderValue={(selected: unknown[]) => selected.join(", ")}
            // MenuProps={{
            //   disablePortal: true,
            //   // ...MenuProps,
            // }}
            defaultValue={[]}
            // sx={{ ".MuiPaper-root": { left: "30px !important" } }}
            fullWidth
            size="small"
          >
            {(options as LabeledValue[])?.map((op) => (
              <MenuItem key={op.value} value={op.value}>
                <Checkbox
                  size="small"
                  checked={formField.value?.indexOf(op.value) > -1}
                />
                <ListItemText primary={op.label} />
              </MenuItem>
            ))}
          </Select>
        );
      }}
    />
  );
};

const SelectField: React.FC<SelectFieldProps> = memo(
  (props) => {
    const { field, parentNamePath, control, getValues } = props;

    const { name: fieldName, grouped = false, multiple } = field;

    const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

    const placeholder =
      !isArray(field.options) &&
      typeof field.options !== "function" &&
      typeof field.options !== "string"
        ? field.options?.placeholder
        : "";

    const rpcData = useRPCStore((state) => state.rpcMap);
    const addRpcData = useRPCStore((state) => state.addRpcData);
    const selectedNode = useFusionFlowStore.useSelectedNode();
    const fusion = useFusionFlowStore.useFusionDraft();

    const { data: authData } = useAuthenticate();
    const user = authData?.user;

    const [options, setOptions] = useState<LabeledValue[]>([]);

    useEffect(() => {
      if (typeof field.options === "function") {
        if (selectedNode?.data) {
          setOptions(
            field.options(selectedNode.data, fusion?.fusion_operators || [])
          );
        }
      } else if (typeof field.options === "string") {
        const rpc = field.options.replace("rpc://", "");
        const rpcOptions = rpcData[rpc];

        if (rpcOptions) {
          setOptions(rpcOptions as LabeledValue[]);
        } else {
          const connectionSlug = getValues("fusion_connection_slug");
          const params = getValues();
          delete params.fusion_connection_slug;
          delete params.connection_params;
          delete params.mapped;
          ThreePAppRemoteProcedure.execute(
            rpc,
            selectedNode?.data.app!,
            connectionSlug!,
            user?.slug!,
            params,
            {
              is_global:
                selectedNode?.data.app_id?.startsWith("3p:global") ?? false,
            }
          ).then(({ data: rpcResData }) => {
            if (rpcResData) {
              addRpcData(rpc, rpcResData);

              setOptions(rpcResData as LabeledValue[]);
            } else {
              setOptions([]);
            }
          });
        }
      } else {
        if (isArray(field.options)) {
          setOptions(field.options);
        } else if (typeof field.options === "object") {
          if (isArray(field.options.store)) {
            setOptions(field.options.store);
          } else if (typeof field.options.store === "string") {
            const rpc = field.options.store.replace("rpc://", "");
            const rpcOptions = rpcData[rpc];

            if (rpcOptions) {
              setOptions(rpcOptions as LabeledValue[]);
              return;
            }

            const connectionSlug = getValues("fusion_connection_slug");
            const params = getValues();
            delete params.fusion_connection_slug;
            delete params.connection_params;
            delete params.mapped;
            ThreePAppRemoteProcedure.execute(
              rpc,
              selectedNode?.data.app!,
              connectionSlug!,
              user?.slug!,
              params,
              {
                is_global:
                  selectedNode?.data.app_id?.startsWith("3p:global") ?? false,
              }
            ).then(({ data: rpcResData }) => {
              if (rpcResData) {
                addRpcData(rpc, rpcResData);

                setOptions(rpcResData as LabeledValue[]);
              } else {
                setOptions([]);
              }
            });
          } else {
            setOptions([]);
          }
        } else {
          setOptions([]);
        }
      }
    }, [
      field.options,
      rpcData,
      getValues,
      selectedNode?.data.app,
      user?.slug,
      addRpcData,
      field,
      selectedNode?.data,
      fusion?.fusion_operators,
    ]);

    const menuItems = useMemo(() => {
      const items: JSX.Element[] = [
        // <MenuItem key={placeholder || "None"} value="">
        //   <em>{placeholder || "None"}</em>
        // </MenuItem>,
      ];
      if (grouped) {
        options.forEach((op) => {
          items.push(
            <ListSubheader
              disableSticky
              key={op.label}
              sx={{
                backgroundColor: "#222",
                lineHeight: "25px",
                fontWeight: "bold",
              }}
            >
              {op.label}
            </ListSubheader>,
            ...(op.options?.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label || o.value}
              </MenuItem>
            )) || [])
          );
        });
      } else {
        items.push(
          ...(options?.map((op) => (
            <MenuItem key={op.value} value={op.value}>
              {op.label || op.value}
            </MenuItem>
          )) || [])
        );
      }

      return items;
    }, [grouped, options]);

    return multiple ? (
      <MultipleSelect {...props} />
    ) : (
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Select
              displayEmpty
              id={name}
              fullWidth
              size="small"
              sx={{ ".MuiPaper-root": { maxHeight: "300px" } }}
              value={field.value || ""}
              onChange={field.onChange}
            >
              {menuItems}
            </Select>
          );
        }}
      />
    );
  },
  (prev, next) =>
    prev.formState.isDirty === next.formState.isDirty &&
    prev.field === next.field
);

export default SelectField;
