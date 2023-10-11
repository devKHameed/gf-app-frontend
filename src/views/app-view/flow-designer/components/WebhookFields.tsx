import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { ParameterType } from "enums/3pApp";
import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ConnectionParamField, ParamField } from "./NodeEditorFields";

type Props = {
  webhook: ThreePAppWebhook;
  operator: FusionOperator;
  appModule: ThreePAppAction;
};

const WebhookFields: React.FC<Props> = (props) => {
  const { webhook, operator, appModule } = props;

  const form = useFormContext();

  const showAdvancedFields = form.watch(
    "connection_params.show_advanced_settings"
  );

  const { fields, advancedFields } = useMemo(() => {
    return (
      webhook.app_parameters?.reduce<{
        fields: MappableParameter[];
        advancedFields: MappableParameter[];
      }>(
        (acc, cur) => {
          if (cur.advanced) {
            showAdvancedFields && acc.advancedFields.push(cur);
          } else {
            acc.fields.push(cur);
          }

          return acc;
        },
        { fields: [], advancedFields: [] }
      ) || { fields: [], advancedFields: [] }
    );
  }, [showAdvancedFields, webhook]);

  return (
    <Box sx={{ p: 2 }}>
      <ParamField
        field={{
          name: "webhook_name",
          type: ParameterType.Text,
          label: "Webhook Name",
        }}
        mappable={false}
        parentNamePath="connection_params"
      />
      <ConnectionParamField
        {...form}
        operator={operator}
        appModule={appModule}
        isWebhookConnection
        parentNamePath="connection_params"
      />
      {fields.map((field) => (
        <ParamField
          parentNamePath="connection_params"
          field={field as MappableParameter}
          mappable={false}
        />
      ))}
      {advancedFields.map((field) => (
        <ParamField
          parentNamePath="connection_params"
          field={field as MappableParameter}
          mappable={false}
        />
      ))}
      <Controller
        name="connection_params.show_advanced_settings"
        control={form.control}
        render={({ field }) => (
          <FormControlLabel
            sx={{ m: 0 }}
            control={
              <Checkbox
                sx={{ p: 0.5 }}
                value={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label="Show advanced settings"
          />
        )}
      />
      {/* <DevTool control={form.control} /> */}
    </Box>
  );
};

export default WebhookFields;
