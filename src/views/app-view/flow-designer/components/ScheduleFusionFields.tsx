import { Box, Button, Stack } from "@mui/material";
import Scrollbar from "components/Scrollbar";
import { ScheduleEditorField } from "constants/Fusion";
import { ScheduleType } from "enums/Fusion";
import moment from "moment";
import { ApiModels } from "queries/apiModelMapping";
import useUpdateItem from "queries/useUpdateItem";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { ParamField } from "./NodeEditorFields";

type ScheduleFusionFieldsProps = {
  onClose?(): void;
};

const ScheduleFusionFields: React.FC<ScheduleFusionFieldsProps> = (props) => {
  const { onClose } = props;

  const { fusionSlug } = useParams<{ fusionSlug: string }>();

  const { mutate: updateFusion } = useUpdateItem({
    modelName: ApiModels.Fusion,
  });

  const fusion = useFusionFlowStore.useFusionDraft();

  const form = useForm();

  useEffect(() => {
    if (fusion?.scheduling) {
      const toLocal = (timestamp?: string) => {
        if (!timestamp) return undefined;
        return moment.utc(timestamp).local().format("YYYY-MM-DD HH:mm:ss");
      };
      const scheduling = { ...(fusion?.scheduling || {}) } as SchedulingConfig;
      switch (scheduling?.type) {
        case ScheduleType.Once:
          scheduling.date = toLocal(scheduling.date)!;
          break;
        case ScheduleType.Daily:
        case ScheduleType.Weekly:
        case ScheduleType.Monthly:
        case ScheduleType.Yearly:
        case ScheduleType.Indefinitely:
          scheduling.start = toLocal(scheduling.start);
          scheduling.end = toLocal(scheduling.end);
          if (scheduling.type === ScheduleType.Indefinitely) {
            scheduling.restrict = scheduling.restrict?.map((rest) => ({
              ...rest,
              from: rest.time?.from,
              to: rest.time?.to,
              time: undefined,
            })) as any;
          }
          break;
      }
      form.reset(scheduling);
    }
  }, [form, fusion?.scheduling]);

  console.log(form.formState.isDirty);

  const handleSubmit = (values: any) => {
    delete values.mapped;
    delete values.show_advanced_settings;

    const toUTC = (timestamp?: string) => {
      if (!timestamp) return undefined;
      return moment(timestamp, "YYYY-MM-DD HH:mm:ss").utc().format();
    };

    const scheduling: SchedulingConfig = values;
    switch (scheduling.type) {
      case ScheduleType.Once:
        scheduling.date = toUTC(scheduling.date)!;
        break;
      case ScheduleType.Daily:
      case ScheduleType.Weekly:
      case ScheduleType.Monthly:
      case ScheduleType.Yearly:
      case ScheduleType.Indefinitely:
        scheduling.start = toUTC(scheduling.start);
        scheduling.end = toUTC(scheduling.end);
        if (scheduling.type === ScheduleType.Indefinitely) {
          scheduling.restrict = scheduling.restrict?.map(
            (
              rest: NonNullable<IndefiniteScheduling["restrict"]>[number] & {
                from?: string;
                to?: string;
              }
            ) => ({
              ...rest,
              time:
                rest.from || rest.to
                  ? { from: rest.from, to: rest.to }
                  : undefined,
            })
          ) as any;
        }
        break;
    }

    updateFusion({
      slug: fusionSlug!,
      data: {
        scheduling,
      },
    });
    onClose?.();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Scrollbar autoHeight autoHeightMax={"calc(100vh - 300px)"}>
          <Box sx={{ p: 2 }}>
            <ParamField mappable={false} field={ScheduleEditorField} />
          </Box>
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

export default ScheduleFusionFields;
