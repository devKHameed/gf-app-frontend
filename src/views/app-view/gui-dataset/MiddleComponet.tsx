import { Box, Stack, styled, Typography, useTheme } from "@mui/material";
import { DynamicEditFormProps } from "components/Form/DynamicEditForm";
import GenericIcon from "components/util-components/Icon";
import InnerPageLayout from "layouts/inner-app-layout";
import { find } from "lodash";
import { queryClient } from "queries";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import React, { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDatasetStore } from "store/stores/dataset";
import EditDataset from "./EditDateset";
import EditDatasetExtended from "./EditDatesetExtended";
type Props = {
  onBackClick?: () => void;
  onFormEvent?: DynamicEditFormProps["onFormEvent"];
  data?: any;
};

const InnerAppLayout = styled(Box)(({ theme }) => {
  return {
    ".heading-card": {
      padding: "0",
    },
  };
});

const EditBox = styled(Box)(({ theme }) => {
  return {
    padding: "24px",

    [`${theme.breakpoints.down("sm")}`]: {
      padding: "11px 15px",
    },
  };
});

export const BoxHeader = styled(Stack)(({ theme }) => ({
  gap: "24px",
  marginBottom: "48px",

  [`${theme.breakpoints.down("sm")}`]: {
    gap: "8px",
    margin: "-11px -15px 20px",
    padding: "11px 15px 11px",
    background: theme.palette.common.blackshades["30p"],
    borderBottom: `1px solid ${theme.palette.background.GFOutlineNav}`,
  },
}));

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

const MiddleComponent: React.FC<Props> = (props) => {
  const { onBackClick, onFormEvent, data } = props;
  const [searchParams] = useSearchParams();
  const {
    datasetDesignSlug,
    datasetSlug,
    slug: guiSlug,
  } = useParams<{
    slug: string;
    datasetDesignSlug?: string;
    datasetSlug?: string;
  }>();
  const [value, setValue] = useState(Number(searchParams.get("t")) || 0);
  const popDatasetDraft = useDatasetStore.usePopDatasetDraft();
  const defaultData = useMemo(() => {
    const defaultList = queryClient.getQueryData([
      [ApiModels.Dataset, { dataset_type_slug: datasetDesignSlug, title: "" }],
    ]) as unknown as DatasetDesign[];

    return find(defaultList, { slug: datasetSlug });
  }, [datasetDesignSlug, datasetSlug, queryClient]) as unknown as Dataset;

  const { data: dataset = defaultData, isLoading: datasetLoading } = useGetItem(
    {
      modelName: ApiModels.Dataset,
      slug: datasetSlug,
      requestOptions: { path: datasetDesignSlug },
    }
  );
  const { data: gui } = useGetItem({
    modelName: ApiModels.Gui,
    slug: guiSlug,
    queryOptions: { enabled: false },
  });

  const additionTabs = useMemo(
    () => gui?.dataset_list_settings?.included_tabs,
    [gui?.dataset_list_settings?.included_tabs]
  );
  const tabLists = useMemo(() => {
    const tabs = [
      {
        label: <TabStyle title="General" />,
        value: 0,
      },
    ];

    if (additionTabs)
      additionTabs.forEach((tab, index) => {
        tabs.push({ label: <TabStyle title={tab.name} />, value: index + 1 });
      });
    return tabs;
  }, [additionTabs]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    popDatasetDraft();
  };

  const selectedTab = additionTabs?.[value - 1];
  return (
    <EditBox>
      <InnerAppLayout>
        <InnerPageLayout
          icon={
            // (dataset?.icon && (
            <GenericIcon
              sx={{
                width: "40px",
                height: "40px",
                color: "text.secondary",
              }}
              iconName={"Dataset"}
              key={"Dataset"}
            />
            //)) as any
          }
          title={dataset?.title}
          onChange={handleChange}
          subtitle={
            <Typography variant="body1" color="text.secondary">
              Title:
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
            <EditDataset
              onFormEvent={onFormEvent}
              data={data}
              datasetDesignSlug={datasetDesignSlug}
              datasetSlug={datasetSlug}
              guiSlug={guiSlug!}
              includedFieldIds={gui?.dataset_list_settings?.form_fields || []}
            />
          )}
          {value !== 0 && (
            <EditDatasetExtended
              onFormEvent={onFormEvent}
              data={data}
              datasetDesignSlug={datasetDesignSlug}
              datasetSlug={datasetSlug}
              guiSlug={guiSlug!}
              selectedTabData={selectedTab}
              key={value}
            />
          )}
        </InnerPageLayout>
      </InnerAppLayout>
    </EditBox>
  );
};

export default MiddleComponent;
