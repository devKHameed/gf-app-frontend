import { AddOutlined, InfoOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Stack,
  TabProps,
  Typography,
  styled,
} from "@mui/material";
import IOSSwitch from "components/IOSSwitch";
import Scrollbar from "components/Scrollbar";
import Spin from "components/Spin";
import TabStyled from "components/TabStyled";
import Icon from "components/util-components/Icon";
import useOpenClose from "hooks/useOpenClose";
import useSettings from "hooks/useSettings";
import InnerPageLayout from "layouts/inner-app-layout";
import { cloneDeep, kebabCase } from "lodash";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useUpdateItem from "queries/useUpdateItem";
import React, { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGuiDashboardStore } from "store/stores/gui-dashboard-widget";
import { useSystemLayoutStore } from "store/stores/systemLayout";
import { getSearchParams, normalizeObjectForAPI } from "utils";
import AddGuiTabModal, { AddGuiTabFormType } from "./AddGuiTabModal";
import DashboardEditor from "./DashboardEditor";
import WidgetEditor from "./WidgetEditor";

const StatisticsWidget = styled(Card)({
  borderRadius: "10px",
});

const RowBox = styled(Box)(({ theme }) => ({
  background: theme.palette.background.GFRightNavBackground,
  padding: "25px",
  borderRadius: "10px",
}));

const CenterBox = styled(Box)({
  flexGrow: "1",
  flexBasis: "0",
  minWidth: "0",
  height: "calc(100vh - 60px)",

  ".heading-card": {
    margin: "0",
    padding: "0 0 9px !important",

    ".heading-wrap": {
      margin: "0 0 10px",
    },
  },
});

const Placeholder: React.FC = () => {
  return (
    <Stack spacing={3}>
      <RowBox>
        <Stack sx={{ py: 1 }} direction="row" alignItems="flex-start">
          <Box sx={{ width: "300px" }}>
            {/* <Doughnut
              style={{ maxHeight: "265px" }}
              options={{
                cutout: "90%",
                plugins: { legend: { display: false } },
                spacing: 10,
                maintainAspectRatio: true,
                // radius: "90%",
              }}
              plugins={[
                {
                  id: "text-inside",
                  beforeDraw: function (chart) {
                    const width = chart.width,
                      height = chart.height,
                      ctx = chart.ctx;
                    ctx.restore();
                    const fontSize = (height / 160).toFixed(2);
                    ctx.font = fontSize + "em sans-serif";
                    ctx.textBaseline = "top";
                    ctx.fillStyle = "#fff";
                    const text = "$3.50\nDay",
                      textX = Math.round(
                        (width - ctx.measureText(text).width) / 2
                      ),
                      textY = height / 2 - 10;
                    ctx.fillText(text, textX, textY);
                    ctx.save();
                  },
                },
              ]}
              data={{
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                  {
                    label: "# of Votes",
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderRadius: 100,
                    borderWidth: 0,
                  },
                ],
              }}
            /> */}
          </Box>
          <Stack direction="column">
            <Typography variant="h6">Pie chart</Typography>
            <Typography variant="body1">
              Gat, if you want we could also just make all of the items have to
              be full width. It will reduce some headache but still probably be
              pretty good. I like having space for content so that our data is
              telling stories.
            </Typography>
            <Stack spacing={10} direction="row" sx={{ mt: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    background: "#12A619",
                    width: "10px",
                    height: "10px",
                    borderRadius: "100%",
                  }}
                ></Box>
                <Typography variant="body1">Monkey venom</Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    background: "#12A619",
                    width: "10px",
                    height: "10px",
                    borderRadius: "100%",
                  }}
                ></Box>
                <Typography variant="body1">Monkey venom</Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    background: "#12A619",
                    width: "10px",
                    height: "10px",
                    borderRadius: "100%",
                  }}
                ></Box>
                <Typography variant="body1">Monkey venom</Typography>
              </Stack>
            </Stack>
            <Box sx={{ mt: 10 }}>
              <ButtonGroup sx={{}} size="small">
                <Button key="vertical">Day</Button>
                <Button key="vertical">Week</Button>
                <Button key="vertical">Month</Button>
                <Button key="vertical">Year</Button>
              </ButtonGroup>
            </Box>
          </Stack>
        </Stack>
      </RowBox>
      <RowBox>
        <Grid container spacing={3}>
          <Grid item xs>
            <StatisticsWidget sx={{ background: "#8C3B2D" }}>
              <CardHeader avatar={<InfoOutlined />} title="App Installations" />
              <CardContent>
                <Typography variant="h4">120,000</Typography>
              </CardContent>
            </StatisticsWidget>
          </Grid>
          <Grid item xs>
            <StatisticsWidget sx={{ background: "#BB7222" }}>
              <CardHeader avatar={<InfoOutlined />} title="App Installations" />
              <CardContent>
                <Typography variant="h4">120,000</Typography>
              </CardContent>
            </StatisticsWidget>
          </Grid>
          <Grid item xs>
            <StatisticsWidget sx={{ background: "#7CA935" }}>
              <CardHeader avatar={<InfoOutlined />} title="App Installations" />
              <CardContent>
                <Typography variant="h4">120,000</Typography>
              </CardContent>
            </StatisticsWidget>
          </Grid>
          <Grid item xs>
            <StatisticsWidget sx={{ background: "#0A8CA4" }}>
              <CardHeader avatar={<InfoOutlined />} title="App Installations" />
              <CardContent>
                <Typography variant="h4">120,000</Typography>
              </CardContent>
            </StatisticsWidget>
          </Grid>
        </Grid>
      </RowBox>
    </Stack>
  );
};

const GuiUpdate: React.FC = () => {
  const guiDraft = useGuiDashboardStore.useGuiDraft();
  const { mutate: updateGui } = useUpdateItem({ modelName: ApiModels.Gui });

  useEffect(() => {
    if (guiDraft?.pushUpdate) {
      updateGui({
        slug: guiDraft.slug!,
        data: normalizeObjectForAPI(guiDraft, ["pushUpdate"]),
      });
    }
  }, [guiDraft]);

  return null;
};

const EditModeSwitch: React.FC = () => {
  const editModeEnabled = useGuiDashboardStore.useEditModeEnabled();
  const setEditModeEnabled = useGuiDashboardStore.useSetEditModeEnabled();

  return (
    <FormControlLabel
      labelPlacement="start"
      label="Edit Mode"
      sx={{
        marginRight: "10px",
      }}
      control={
        <IOSSwitch
          checked={editModeEnabled}
          onChange={(e) => setEditModeEnabled(e.target.checked)}
          sx={{
            marginLeft: "10px",
            ".MuiSwitch-track": {
              backgroundColor: "rgb(255, 255, 255) !important",
            },
            ".MuiSwitch-thumb": {
              backgroundColor: (theme) => theme.palette.primary.main,
            },
          }}
        />
      }
    />
  );
};

const GFDashboard: React.FC<{ editable?: boolean }> = ({ editable = true }) => {
  const { slug } = useParams<{ slug: string }>();

  const [isAddModalOpen, openAddModal, closeAddModal] = useOpenClose();
  const { onChangeMode } = useSettings();

  const setShowSideNavTopSelector =
    useSystemLayoutStore.useSetShowSideNavTopSelector();
  const setEnableSideNavSearch =
    useSystemLayoutStore.useSetEnableSideNavSearch();
  const setShowActionButtons = useSystemLayoutStore.useSetShowActionButtons();
  const setAppBarProps = useSystemLayoutStore.useSetAppBarProps();

  const setEditModeEnabled = useGuiDashboardStore.useSetEditModeEnabled();
  const editModeEnabled = useGuiDashboardStore.useEditModeEnabled();
  const setGuiDraft = useGuiDashboardStore.useSetGuiDraft();
  const selectedTab = useGuiDashboardStore.useSelectedTab();
  const setSelectedTab = useGuiDashboardStore.useSetSelectedTab();
  const setWidgetDraft = useGuiDashboardStore.useSetWidgetDraft();
  const isWidgetEditorOpen = useGuiDashboardStore.useIsWidgetEditorOpen();
  const openWidgetEditor = useGuiDashboardStore.useOpenWidgetEditor();
  const closeWidgetEditor = useGuiDashboardStore.useCloseWidgetEditor();

  const { data: gui } = useGetItem({ modelName: ApiModels.Gui, slug });
  const { mutate: updateGui } = useUpdateItem({ modelName: ApiModels.Gui });

  const guiTab =
    selectedTab != null
      ? gui?.dashboard_list_settings.tabs?.[selectedTab]
      : undefined;

  useEffect(() => {
    setShowSideNavTopSelector(false);
    setEnableSideNavSearch(false);
    setShowActionButtons(false);
    onChangeMode({ target: { value: "blue" } });
    setAppBarProps({
      rightComponent: <EditModeSwitch />,
    });
    setEditModeEnabled(editable);
  }, []);

  useEffect(() => {
    if (gui) {
      setGuiDraft(gui);
    }
  }, [gui]);

  const handleAddTab = useCallback(
    (data: AddGuiTabFormType) => {
      if (slug) {
        const settings = cloneDeep(gui?.dashboard_list_settings || {});
        const name = data.tab_name;
        const id = kebabCase(name);
        settings.tabs = [
          ...(settings.tabs || []),
          {
            tab_name: name,
            id,
            tab_rows: [],
          },
        ];
        return new Promise<void>((resolve, reject) => {
          updateGui(
            { slug, data: { dashboard_list_settings: settings } },
            {
              onSuccess() {
                resolve();
              },
              onError() {
                reject();
              },
            }
          );
        });
      } else {
        return Promise.reject();
      }
    },
    [gui, slug, updateGui]
  );

  const tabs = useMemo(() => {
    const allTabs: TabProps[] = [];

    gui?.dashboard_list_settings?.tabs?.forEach((tab) => {
      allTabs.push({
        label: <TabStyled title={tab.tab_name} />,
      });
    });

    if (editModeEnabled) {
      allTabs.push({
        label: (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              openAddModal();
            }}
            variant="outlined"
            color="primary"
            size="small"
          >
            New Tab <AddOutlined fontSize="small" />
          </Button>
        ),
        value: "add-tab-button",
      });
    }

    return allTabs;
  }, [gui, handleAddTab, editModeEnabled]);

  useEffect(() => {
    const tab = getSearchParams().get("t");
    if (tab) {
      setSelectedTab(Number(tab));
    } else {
      setSelectedTab(0);
    }
  }, []);

  const handleAddWidgetClick = (rowId: string, col: number) => {
    if (gui && guiTab) {
      setWidgetDraft({
        parent_gui_id: gui?.slug,
        parent_tab_id: guiTab.id,
        row_id: rowId,
        row_column: col,
      });
      openWidgetEditor();
    }
  };

  const handleCloseWidgetEditor = () => {
    closeWidgetEditor();
    setWidgetDraft(null);
  };

  return (
    <Spin spinning={false} sx={{ height: "100%" }}>
      <GuiUpdate />
      <Stack direction="row">
        <CenterBox>
          <Scrollbar>
            <InnerPageLayout
              icon={
                (gui?.icon && (
                  <Icon
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
              subtitle={
                <Typography variant="body1" color="text.secondary">
                  Description:{" "}
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="text.primary"
                  >
                    {gui?.description}
                  </Typography>
                </Typography>
              }
              value={selectedTab}
              onChange={(_, tab) => setSelectedTab(tab)}
              tabList={tabs}
            >
              <DashboardEditor onAddWidgetClick={handleAddWidgetClick} />
            </InnerPageLayout>
          </Scrollbar>
        </CenterBox>
        <WidgetEditor
          open={isWidgetEditorOpen}
          onClose={handleCloseWidgetEditor}
        />
      </Stack>

      <AddGuiTabModal
        open={isAddModalOpen}
        onClose={() => closeAddModal()}
        onSubmit={handleAddTab}
      />
    </Spin>
  );
};

export default GFDashboard;
