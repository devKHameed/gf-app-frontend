import {
  Box,
  debounce,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InnerPageLayout from "layouts/inner-app-layout";

import { zodResolver } from "@hookform/resolvers/zod";
import TabStyled from "components/TabStyled";
import GenericIcon from "components/util-components/Icon";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useUpdateItem from "queries/useUpdateItem";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import BasicComponent from "./BasicComponent";
import GuiSetting from "./GuiSetting";

const InnerAppLayout = styled(Box)(({ theme }) => {
  return {
    ".heading-card": {
      padding: "0",
    },
  };
});

const formSchema = z.object({
  name: z.string({ required_error: "title is required" }),
  gui_type: z.string({ required_error: "type is required" }),
  description: z.string({ required_error: "description is required" }),
  color: z.string().optional(),
  icon: z.string().optional(),
});
type FormType = z.infer<typeof formSchema>;
type props = {} & Pick<
  React.ComponentProps<typeof BasicComponent>,
  "onEditDashboardClick"
>;
const MiddleComponent = (props: props) => {
  const { onEditDashboardClick } = props;
  const [searchParams] = useSearchParams();
  const { slug: guiSlug } = useParams<{ slug: string }>();
  const [value, setValue] = useState(Number(searchParams.get("t")) || 0);
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));

  const { data: gui } = useGetItem({
    modelName: ApiModels.Gui,
    slug: guiSlug,
  });
  const { mutate: updateGui } = useUpdateItem({
    modelName: ApiModels.Gui,
    mutationOptions: {
      mutationKey: [ApiModels.Gui],
    },
  });

  const form = useForm<Partial<FormType>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: gui,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = form;
  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);

  const tabLists = useMemo(() => {
    const tabs = [
      {
        label: <TabStyled title="General Settings" />,
      },
    ];
    if (!xlScreen)
      tabs.push({
        label: <TabStyled title="Setting" />,
      });
    return tabs;
  }, [xlScreen]);

  useEffect(() => {
    if (xlScreen) {
      setValue((prev) => {
        //Change this right bar index or last index
        if (prev === 1) return 0;
        return prev;
      });
    }
  }, [xlScreen]);

  const submitHandler = useCallback(
    (data: Partial<GfGui>) => {
      if (guiSlug && allowNetworkRequest.current) {
        updateGui(
          { slug: guiSlug, data },
          {
            onSuccess: () => {
              console.log("inner success");
            },
          }
        );
      }
    },
    [guiSlug, updateGui]
  );

  useEffect(() => {
    initialValueSet.current = false;
  }, [guiSlug]);

  useEffect(() => {
    if (gui && !initialValueSet.current) {
      reset(gui);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [reset, gui]);

  useEffect(() => {
    const submitDeb = debounce(() => {
      handleSubmit(submitHandler)();
    }, 600);
    const subscription = watch((_, { name }) => {
      switch (name) {
        case "color":
        case "icon":
          submitDeb();
          break;
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, submitHandler, handleSubmit]);

  const handleChange = (_: any, tab: number) => {
    setValue(tab);
  };

  return (
    <InnerAppLayout>
      <InnerPageLayout
        icon={
          (gui?.icon && (
            <GenericIcon
              sx={{
                width: "40px",
                height: "40px",
                color: "text.secondary",
              }}
              iconName={gui?.icon as any}
              key={gui?.icon}
            />
          )) as any
        }
        title={gui?.name}
        onChange={handleChange}
        subtitle={
          <Typography variant="body1" color="text.secondary">
            Title:{" "}
            <Typography
              component="span"
              variant="subtitle1"
              color="text.primary"
            >
              Gui Fusion CEO
            </Typography>
          </Typography>
        }
        tabList={tabLists}
        value={value}
      >
        {value === 0 && (
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <BasicComponent
                register={register}
                errors={errors}
                control={control}
                onEditDashboardClick={onEditDashboardClick}
              />
            </form>
          </FormProvider>
        )}

        {value === 1 && !xlScreen && (
          <Box>
            <GuiSetting disableScrollbar={true} />
          </Box>
        )}
      </InnerPageLayout>
      {/* <DevTool control={control} /> */}
    </InnerAppLayout>
  );
};

export default MiddleComponent;
