import { ParameterType } from "enums/3pApp";
import { isArray, isPlainObject } from "lodash";
import ThreePAppRemoteProcedure from "models/ThreePAppRemoteProcedure";
import useAuthenticate from "queries/auth/useAuthenticate";
import React, { PropsWithChildren } from "react";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { useRPCStore } from "store/stores/rpc";
import { BaseParamFieldProps, ParamField } from "../NodeEditorFields";

type NestedFieldsWrapperProps = {
  mappable?: boolean;
} & BaseParamFieldProps;

const NestedFieldsWrapper: React.FC<
  PropsWithChildren<NestedFieldsWrapperProps>
> = (props) => {
  const { children, field, parentNamePath, mappable, getValues, ...form } =
    props;
  const { name: fieldName } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  const rpcData = useRPCStore((state) => state.rpcMap);
  const addRpcData = useRPCStore((state) => state.addRpcData);
  const selectedNode = useFusionFlowStore.useSelectedNode();
  const fusion = useFusionFlowStore.useFusionDraft();
  const { data: authData } = useAuthenticate();
  const { user } = authData || {};

  const fieldValue = form.watch(name);

  const nested = React.useMemo(() => {
    let nestedFields = field.nested || [];

    if (field.type === ParameterType.Select) {
      let options: (LabeledValue & {
        nested?: MappableParameter[] | string;
      })[] = [];
      if (typeof field.options === "function") {
        if (selectedNode?.data) {
          options = field.options(
            selectedNode?.data,
            fusion?.fusion_operators || []
          );
        }
      } else if (isArray(field.options)) {
        options = field.options;
      } else if (typeof field.options === "string") {
        const data = rpcData[field.options.replace("rpc://", "")];
        if (isArray(data)) {
          options = data;
        }
      } else if (isPlainObject(field.options)) {
        if (isArray(field.options?.store)) {
          options = field.options?.store || [];
        } else if (typeof field.options?.store === "string") {
          const data = rpcData[field.options.store.replace("rpc://", "")];
          if (isArray(data)) {
            options = data;
          }
        }
      }
      // (!isArray(field.options) ? field.options?.store : field.options) || [];
      if (field.grouped) {
        options = options.reduce<LabeledValue[]>((acc, cur) => {
          return cur.options ? acc.concat(cur.options as LabeledValue[]) : acc;
        }, []);
      }
      const selectedOption = options.find((op) => op.value === fieldValue);
      if (selectedOption?.nested) {
        if (typeof selectedOption.nested === "string") {
          const rpc = selectedOption.nested.replace("rpc://", "");
          const rpcOptions = rpcData[rpc];

          if (rpcOptions) {
            if (isArray(rpcOptions)) {
              nestedFields.push(...rpcOptions);
            }
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

                if (isArray(rpcResData)) {
                  nestedFields.push(...rpcResData);
                }
              }
            });
          }
        } else if (isArray(selectedOption.nested)) {
          nestedFields.push(...selectedOption.nested);
        }
      }
    }

    if (field.type === ParameterType.Boolean && !fieldValue) {
      nestedFields = [];
    }

    return nestedFields;
  }, [
    field,
    fieldValue,
    selectedNode?.data,
    fusion?.fusion_operators,
    rpcData,
    getValues,
    user?.slug,
    addRpcData,
  ]);

  return (
    <>
      {children}
      {nested.map((nestedField) => {
        return (
          <ParamField
            key={nestedField.name}
            parentNamePath={parentNamePath}
            mappable={mappable}
            field={nestedField}
          />
        );
      })}
    </>
  );
};

export default NestedFieldsWrapper;
