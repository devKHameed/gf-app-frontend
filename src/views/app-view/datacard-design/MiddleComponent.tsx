import {
  Box,
  debounce,
  Stack,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InnerPageLayout from "layouts/inner-app-layout";

import { zodResolver } from "@hookform/resolvers/zod";
import GenericIcon from "components/util-components/Icon";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useUpdateItem from "queries/useUpdateItem";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import BasicComponent from "./BasicComponent";
import DatacardDesignHistory from "./DatacardDesignHistory";
import DatasetDesignSetting from "./DatacardDesignSetting";

const InnerAppLayout = styled(Box)(({ theme }) => {
  return {
    ".heading-card": {
      padding: "0",
    },
  };
});

const TabStyle = ({ title }: { title: string }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1}>
      <Typography className="tab-text" sx={{ color: "#fff" }}>
        {title}
      </Typography>
      <Typography
        sx={{ color: theme.palette.background.GF40 }}
        className="counter"
      >
        4
      </Typography>
    </Stack>
  );
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});
const MiddleComponent = () => {
  const [searchParams] = useSearchParams();
  const { slug: datacardDesignSlug } = useParams<{ slug: string }>();
  const [value, setValue] = useState(Number(searchParams.get("t")) || 0);
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));

  const { data: datacardDesign } = useGetItem({
    modelName: ApiModels.DatacardDesign,
    slug: datacardDesignSlug,
    requestOptions: {
      path: `contacts`,
    },
  });
  const { mutate: updateDatacardDesign } = useUpdateItem({
    modelName: ApiModels.DatacardDesign,
    mutationOptions: {
      mutationKey: [ApiModels.DatacardDesign],
    },
    requestOptions: { path: "contacts" },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = useForm<Partial<DatacardDesign>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: datacardDesign,
  });
  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);

  const tabLists = useMemo(() => {
    const tabs = [
      {
        label: <TabStyle title="Records" />,
      },
      {
        label: <TabStyle title="History" />,
      },
    ];
    if (!xlScreen)
      tabs.push({
        label: <TabStyle title="Setting" />,
      });
    return tabs;
  }, [xlScreen]);

  useEffect(() => {
    if (xlScreen) {
      setValue((prev) => {
        if (prev === 2) return 0;
        return prev;
      });
    }
  }, [xlScreen]);

  const submitHandler = useCallback(
    (data: Partial<DatasetDesign>) => {
      if (datacardDesignSlug && allowNetworkRequest.current) {
        updateDatacardDesign(
          { slug: datacardDesignSlug, data },
          {
            onSuccess: () => {
              console.log("inner success");
            },
          }
        );
      }
    },
    [datacardDesignSlug, updateDatacardDesign]
  );
  useEffect(() => {
    initialValueSet.current = false;
  }, [datacardDesignSlug]);
  useEffect(() => {
    if (datacardDesign && !initialValueSet.current) {
      reset(datacardDesign);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [reset, datacardDesign]);

  useEffect(() => {
    const submitDeb = debounce(() => {
      handleSubmit(submitHandler)();
    }, 600);
    const subscription = watch((_) => {
      submitDeb();
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
          (datacardDesign?.icon && (
            <GenericIcon
              sx={{
                width: "40px",
                height: "40px",
                color: "text.secondary",
              }}
              iconName={datacardDesign?.icon as any}
              key={datacardDesign?.icon}
            />
          )) as any
        }
        title={datacardDesign?.name}
        onChange={handleChange}
        subtitle={
          <Typography variant="body1" color="text.secondary">
            Description:{" "}
            <Typography
              component="span"
              variant="subtitle1"
              color="text.primary"
            >
              <>{datacardDesign?.description}</>
            </Typography>
          </Typography>
        }
        tabList={tabLists}
        value={value}
      >
        {value === 0 && (
          <BasicComponent
            register={register}
            errors={errors}
            control={control}
          />
        )}
        {value === 1 && <DatacardDesignHistory />}
        {value === 2 && !xlScreen && (
          <Box>
            <DatasetDesignSetting disableScrollbar={true} />
          </Box>
        )}
      </InnerPageLayout>
      {/* <DevTool control={control} /> */}
    </InnerAppLayout>
  );
};

export default MiddleComponent;
