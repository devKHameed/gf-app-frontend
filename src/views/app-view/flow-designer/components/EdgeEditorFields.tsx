import { Box, Button, Stack } from "@mui/material";
import Scrollbar from "components/Scrollbar";
import { FilterOperators } from "constants/index";
import { ParameterType } from "enums/3pApp";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { ParamField } from "./NodeEditorFields";

type EdgeEditorFieldsProps = {
  edgeData?: FusionOperator["edge_data"];
  onClose?(): void;
  isOperatorConditions?: boolean;
  operator?: FusionOperator;
};

const EdgeEditorFields: React.FC<EdgeEditorFieldsProps> = (props) => {
  const { edgeData, onClose, isOperatorConditions, operator } = props;

  const updateEdgeSettings = useFusionFlowStore.useUpdateEdgeSettings();
  const updateOperatorConditions =
    useFusionFlowStore.useUpdateOperatorConditions();

  const form = useForm();

  console.log(form.formState.isDirty);

  // const formWatch = form.watch();
  // console.log("🚀 ~ file: EdgeEditorFields.tsx:25 ~ formWatch:", formWatch);

  useEffect(() => {
    if (edgeData) {
      // console.log(
      //   "🚀 ~ file: EdgeEditorFields.tsx:26 ~ useEffect ~ edgeData:",
      //   edgeData
      // );

      Object.entries(edgeData).forEach(([key, value]) => {
        form.setValue(key, value);
      });
      // form.reset(edgeData);
    }
  }, [edgeData]);

  const handleSubmit = (values: any) => {
    delete values.mapped;
    if (isOperatorConditions && operator?.operator_slug) {
      updateOperatorConditions({
        operatorSlug: operator?.operator_slug,
        settings: values,
      });
    } else {
      updateEdgeSettings(values);
    }
    onClose?.();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Scrollbar autoHeight autoHeightMax={"calc(100vh - 300px)"}>
          <Stack direction="column" sx={{ p: 2 }}>
            <ParamField
              mappable={false}
              field={{
                label: "Label",
                name: "label",
                type: ParameterType.Text,
              }}
            />
            <ParamField
              // mappable={false}
              field={{
                label: "Condition",
                name: "condition_sets",
                type: ParameterType.Filter,
                options: {
                  operators: FilterOperators,
                },
              }}
            />
          </Stack>
        </Scrollbar>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.primary.main,
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
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="inherit"
              type="submit"
              sx={{
                backgroundColor: "#fff",
                color: (theme) => theme.palette.primary.main,
                borderColor: "#fff",
                boxShadow: "none",
              }}
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      </form>
      {/* <DevTool control={form.control} /> */}
    </FormProvider>
  );
};

export default EdgeEditorFields;
