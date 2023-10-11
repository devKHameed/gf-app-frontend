import {
  AddCircle,
  AddOutlined,
  CloseOutlined,
  EditOutlined,
  InfoOutlined,
  MenuOutlined,
  MoreHoriz,
} from "@mui/icons-material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import ColCount1 from "assets/icons/ColCount1";
import ColCount2 from "assets/icons/ColCount2";
import ColCount3 from "assets/icons/ColCount3";
import Chart, {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import classNames from "classnames";
import DataTable from "components/DataTable";
import { AddDatasetItemModel } from "components/DataTable/DataTableField";
import { SortableList } from "components/SortableList";
import Spin from "components/Spin";
import { COLORS } from "constants/color";
import { DASHBOARD_WIDGET_TYPE } from "constants/gui";
import { DocumentElementType } from "enums/Form";
import useAccountSlug from "hooks/useAccountSlug";
import useOpenClose from "hooks/useOpenClose";
import useSocket from "hooks/useSocket";
import {
  get,
  isArray,
  isBoolean,
  isEmpty,
  isNumber,
  isPlainObject,
  isString,
  omit,
  sample,
  set,
  toNumber,
} from "lodash";
import FusionModel from "models/Fusion";
import { ApiModels } from "queries/apiModelMapping";
import useListItems from "queries/useListItems";
import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { FormProvider, useForm } from "react-hook-form";
import { useGuiDashboardStore } from "store/stores/gui-dashboard-widget";
import { getUser } from "utils";
import { v4 } from "uuid";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const COLOR_1 = "#3e82f7"; // blue
const COLOR_2 = "#04d182"; // cyan

const COLOR_1_LIGHT = "rgba(62, 130, 247, 0.15)";
const COLOR_2_LIGHT = "rgba(4, 209, 130, 0.1)";

type Row = DashboardTabRow & { id: string };

const RowBox = styled(Box)<{ editMode: boolean }>(({ editMode }) => {
  const styles = {
    ".row-header": {
      height: "0",
      overflow: "hidden",
      padding: "0",
    },
    ".row-frame": {
      padding: "0px !important",
      background: "transparent !important",
    },

    ".content-row": {
      gap: "40px",
    },
  };

  if (editMode) {
    return {
      "&:not(:hover)": styles,
    };
  }

  return styles;
});

const RowFrame = styled(Box)(({ theme }) => ({
  paddingTop: "0px",
  paddingLeft: "24px",
  paddingRight: "24px",
  paddingBottom: "24px",
  borderRadius: "0 0 8px 8px",
  transition: "all 0.4s ease",
  background: theme.palette.green.GFGreen,
}));

const RowHeader = styled(Stack)(({ theme }) => ({
  background: theme.palette.green.GFGreen,
  height: "36px",
  borderRadius: "8px 8px 0 0",
  padding: "5px 6px 6px 11px",
  transition: "all 0.4s ease",

  ".MuiButtonBase-root": {
    minWidth: "30px",
    padding: "4px",
  },

  ".MuiIconButton-root": {
    color: "#ffffff",
  },

  ".DragHandle .MuiIconButton-root": {
    padding: "0px",
  },
}));

const RowContent = styled(Stack)({
  // background: "#1D1A26",
  // padding: "30px",
  // borderRadius: "8px",
  // height: "290px",
  gap: "17px",
  transition: "all 0.4s ease",
});

const ColCountButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  ".MuiButton-root": {
    "&.selected": {
      background: "rgba(255, 255, 255, 0.3)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
    },
    height: "auto",
    fontSize: "12px",

    svg: {
      fontSize: "inherit",

      "&.col-3-icon": {
        fontSize: "16px",
      },
    },
  },
}));

const ColHolder = styled(Box)(({ theme }) => ({
  background: theme.palette.background.GFRightNavBackground,
  borderRadius: "8px",
  width: "100%",

  "&:not(:hover)": {
    ".edit-cover": {
      display: "none",
    },
  },

  "&.no-widget": {
    ".edit-cover": {
      display: "none !important",
    },
  },
}));

const ColContent = styled(Box)({
  padding: "30px",
  height: "100%",

  ".MuiTypography-h5": {
    margin: "0 0 10px",
  },
});

const ColPlaceholderContainer = styled(Stack)({
  minHeight: "230px",
  height: "100%",
});

const ButtonsArea = styled(Stack)(({ theme }) => ({
  padding: "12px 0 0",

  ".MuiButtonGroup-root": {
    padding: "4px 9px",
    border: `1px solid ${theme.palette.other?.outlinedBorder}`,
    borderRadius: "4px",
  },

  ".MuiButton-root": {
    border: "none !important",
    color: theme.palette.text.secondary,
    fontSize: "16px",
    lineHeight: "20px",
    padding: "2px 12px",
    minWidth: "inherit",
    fontWeight: "400",
    height: "auto",
    position: "relative",
    borderRadius: "4px !important",

    "&:first-child:before": {
      display: "none",
    },

    "&:before": {
      position: "absolute",
      left: "0",
      top: "50%",
      width: "1px",
      height: "15px",
      content: `""`,
      background: theme.palette.other?.outlinedBorder,
      transform: "translate(0, -50%)",
    },
  },
}));

const LabelsBox = styled(Stack)(({ theme }) => ({
  gap: "48px",
  marginTop: "14px",

  ".MuiTypography-body1": {
    color: theme.palette.text.secondary,
  },
}));

const BoxRow = styled(Stack)(({ theme }) => ({
  gap: "40px",
}));
const BoxGraph = styled(Box)(({ theme }) => ({
  width: "30%",
  minWidth: "30%",
  height: "230px !important",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));
const DetailBox = styled(Stack)(({ theme }) => ({
  justifyContent: "space-between",
  padding: "5px 0",

  ".description-box": {
    color: theme.palette.text.secondary,
    margin: "0 0 24px",
  },
}));

const StackChart = styled(Stack)(({ theme }) => ({
  justifyContent: "space-between",
  height: "100%",
}));

type ColPlaceholderProps = {
  onAddWidgetClick(): void;
  editModeEnabled?: boolean;
};

const ColPlaceholder: React.FC<ColPlaceholderProps> = (props) => {
  const { onAddWidgetClick, editModeEnabled } = props;

  const onClickHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (editModeEnabled) {
      onAddWidgetClick?.();
    }
  };
  return (
    <ColPlaceholderContainer
      onClick={onClickHandler}
      justifyContent="center"
      alignItems="center"
    >
      {editModeEnabled ? (
        <AddOutlined fontSize="large" />
      ) : (
        <Box>Please add a widget here</Box>
      )}
    </ColPlaceholderContainer>
  );
};

const StatisticsCard = styled(Card)(({ theme }) => ({
  borderRadius: "10px",
  height: "100%",
  color: theme.palette.primary.contrastText,

  ".MuiCardHeader-avatar": {
    marginRigth: "10px",
    width: "20px",

    svg: {
      width: "100%",
      height: "auto",
    },
  },

  ".MuiTypography-body2 ": {
    fontSize: "16px",
    lineHeight: "28px",
    fontWeight: "600",
    color: theme.palette.primary.contrastText,
  },
}));

type FilterGroupsProps = {
  filterGroups?: WidgetFilterGroup[];
  widget?: GuiDashboardWidget;
};

const FilterGroups: React.FC<FilterGroupsProps> = (props) => {
  const { filterGroups = [], widget } = props;

  const [active, setActive] = useState(filterGroups[0]?.id);
  const setSelectedFilterTabs = useGuiDashboardStore.useSetSelectedFilterTabs();
  const editModeEnabled = useGuiDashboardStore.useEditModeEnabled();

  useEffect(() => {
    if (active && widget?.slug) {
      setSelectedFilterTabs(widget?.slug, active);
    }
  }, [active]);

  return filterGroups.length > 0 ? (
    <ButtonsArea direction="row" justifyContent="center">
      <ButtonGroup size="small">
        {filterGroups.map((f) => (
          <Button
            key="vertical"
            variant={f.id === active ? "contained" : "outlined"}
            onClick={() => {
              if (!editModeEnabled) {
                setActive(f.id);
              }
            }}
          >
            {f.title}
          </Button>
        ))}
      </ButtonGroup>
    </ButtonsArea>
  ) : null;
};

const StatisticsWidgetWrapper = styled(Grid)({
  height: "calc(100% + 24px)",

  ".MuiGrid-item ": {
    minWidth: "262px",
  },
});

type StatisticsWidgetProps = {
  data?: { status: string; value: string; subtitle: string };
  title?: string;
  description?: string;
  filterGroups?: WidgetFilterGroup[];
  widget?: GuiDashboardWidget;
  loading?: boolean;
};

const StatisticsWidget: React.FC<StatisticsWidgetProps> = (props) => {
  const {
    data,
    title,
    description,
    widget,
    filterGroups = [],
    loading,
  } = props;
  const Title = <Typography variant="h5">{title}</Typography>;

  const Filter = <FilterGroups filterGroups={filterGroups} widget={widget} />;

  return (
    <Spin spinning={loading}>
      <Box>
        {Title}
        <StatisticsWidgetWrapper container spacing={3}>
          <Grid item xs>
            <StatisticsCard sx={{ background: "#8C3B2D" }}>
              <CardHeader
                avatar={<InfoOutlined />}
                title={data?.subtitle || "App Installations"}
              />
              <CardContent>
                <Typography variant="h4">{data?.value || "120,000"}</Typography>
              </CardContent>
            </StatisticsCard>
          </Grid>
          <Grid item xs>
            <StatisticsCard sx={{ background: "#BB7222" }}>
              <CardHeader
                avatar={<InfoOutlined />}
                title={data?.subtitle || "App Installations"}
              />
              <CardContent>
                <Typography variant="h4">{data?.value || "120,000"}</Typography>
              </CardContent>
            </StatisticsCard>
          </Grid>
          <Grid item xs>
            <StatisticsCard sx={{ background: "#7CA935" }}>
              <CardHeader
                avatar={<InfoOutlined />}
                title={data?.subtitle || "App Installations"}
              />
              <CardContent>
                <Typography variant="h4">{data?.value || "120,000"}</Typography>
              </CardContent>
            </StatisticsCard>
          </Grid>
          <Grid item xs>
            <StatisticsCard sx={{ background: "#0A8CA4" }}>
              <CardHeader
                avatar={<InfoOutlined />}
                title={data?.subtitle || "App Installations"}
              />
              <CardContent>
                <Typography variant="h4">{data?.value || "120,000"}</Typography>
              </CardContent>
            </StatisticsCard>
          </Grid>
        </StatisticsWidgetWrapper>
        {Filter}
      </Box>
    </Spin>
  );
};

type ChartWidgetProps = {
  fullView?: boolean;
  title?: string;
  description?: string;
  filterGroups?: WidgetFilterGroup[];
  widget?: GuiDashboardWidget;
  loading?: boolean;
};

const doughnutData: Chart.ChartData<"doughnut"> = {
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
};

const doughnutOptions = {
  cutout: "90%",
  plugins: { legend: { display: false } },
  spacing: 10,
  maintainAspectRatio: true,
  // radius: "90%",
};

const doughnutPlugins: Chart.Plugin<"doughnut">[] = [
  // {
  //   id: "text-inside",
  //   beforeDraw: function (chart: any) {
  //     const width = chart.width,
  //       height = chart.height,
  //       ctx = chart.ctx;
  //     ctx.restore();
  //     const fontSize = (height / 160).toFixed(2);
  //     ctx.font = fontSize + "em sans-serif";
  //     ctx.textBaseline = "top";
  //     ctx.fillStyle = "#fff";
  //     const text = "$3.50\nDay",
  //       textX = Math.round((width - ctx.measureText(text).width) / 2),
  //       textY = height / 2 - 10;
  //     ctx.fillText(text, textX, textY);
  //     ctx.save();
  //   },
  // },
];

const isValidDoughnut = (data: any): data is Chart.ChartData<"doughnut"> => {
  if (!data || !isArray(data.labels)) {
    return false;
  }

  if (
    !isArray(data.datasets) ||
    !data.datasets.every((set: any) => isArray(set.data))
  ) {
    return false;
  }

  return true;
};

const parseDoughnutData = (data: any): Chart.ChartData<"doughnut"> => {
  const colors = data.labels.map(() => sample(COLORS));
  return {
    labels: data.labels.map((label: { value: string }) => label.value),
    datasets: data?.datasets?.map((set: any) => ({
      label: set.label,
      data: set.data.map((d: { value: string }) => d.value),
      borderColor:
        set.backgroundColor
          ?.map((color: { value: string }) => color.value)
          .filter(Boolean) || colors,
      borderRadius: 100,
      borderWidth: 0,
      backgroundColor:
        set.backgroundColor
          ?.map((color: { value: string }) => color.value)
          .filter(Boolean) || colors,
    })),
  };
};

type DoughnutChartWidgetProps = {
  data?: Chart.ChartData<"doughnut">;
  loading?: boolean;
} & ChartWidgetProps;

const DoughnutChartWidget: React.FC<DoughnutChartWidgetProps> = (props) => {
  const {
    fullView,
    data,
    title,
    description,
    filterGroups = [],
    widget,
    loading,
  } = props;

  const chartData = useMemo(() => {
    return isValidDoughnut(data) ? parseDoughnutData(data) : doughnutData;
  }, [data]);

  const Chart = (
    <Doughnut
      style={{ maxHeight: "265px", maxWidth: "100%" }}
      options={doughnutOptions}
      plugins={doughnutPlugins}
      data={chartData}
    />
  );

  const Title = <Typography variant="h5">{title ?? "Pie Chart"}</Typography>;

  const Labels = (
    <LabelsBox
      className="graph-detail"
      direction="row"
      justifyContent={fullView ? "flex-start" : "center"}
      flexWrap="wrap"
    >
      {chartData.labels?.map((label, idx) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              background: (theme) =>
                `${
                  (chartData?.datasets?.[0]?.backgroundColor as any[])?.[idx] ||
                  theme.palette.primary.main
                }`,
              width: "10px",
              height: "10px",
              borderRadius: "100%",
            }}
          ></Box>
          <Typography variant="body1">{label as string}</Typography>
        </Stack>
      ))}
    </LabelsBox>
  );

  const Filter = <FilterGroups filterGroups={filterGroups} widget={widget} />;

  const Description = (
    <Typography variant="body1" className="description-box">
      {description}
    </Typography>
  );

  return (
    <Spin spinning={loading}>
      {!fullView ? (
        <StackChart>
          <Box>
            {Title}
            {Chart}
          </Box>
          <Box>
            {Labels}
            {Filter}
          </Box>
        </StackChart>
      ) : (
        <BoxRow direction="row">
          <BoxGraph>{Chart}</BoxGraph>
          <DetailBox>
            <Box>
              {Title}
              {Description}
              {Labels}
            </Box>
            {Filter}
          </DetailBox>
        </BoxRow>
      )}
    </Spin>
  );
};

const lineData: Chart.ChartData<"line"> = {
  labels: ["M", "T", "W", "T", "F", "S", "S"],
  datasets: [
    {
      label: "Series A",
      data: [28, 48, 40, 55, 86, 55, 90],
      backgroundColor: COLOR_1,
      borderColor: COLOR_1,
      pointBackgroundColor: COLOR_1,
      pointHoverBackgroundColor: COLOR_1,
      pointHoverBorderColor: COLOR_1,
      fill: true,
      tension: 0.4,
      pointStyle: "circle",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
    },
    {
      label: "Series B",
      data: [62, 42, 52, 55, 80, 49, 100],
      backgroundColor: COLOR_2,
      borderColor: COLOR_2,
      pointBackgroundColor: COLOR_2,
      pointHoverBackgroundColor: COLOR_2,
      pointHoverBorderColor: COLOR_2,
      fill: true,
      tension: 0.4,
      pointStyle: "circle",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
    },
  ],
};

const lineOptions: Chart.ChartOptions<"line"> = {
  plugins: {
    // filler: {
    //   propagate: false,
    // },
    tooltip: {
      enabled: true,
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: true,
    },
    y: {
      grid: {
        color: "#eee",
        // drawBorder: false,
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};

const isValidLine = (data: any): data is Chart.ChartData<"line"> => {
  if (!data || !isArray(data.labels)) {
    return false;
  }

  if (
    !isArray(data.datasets) ||
    !data.datasets.every((set: any) => set.label && isArray(set.data))
  ) {
    return false;
  }

  return true;
};

const parseLineData = (data: any): Chart.ChartData<"line"> => {
  return {
    labels: data.labels?.map((l: { value: string }) => l.value),
    datasets: data.datasets?.map((set: any) => {
      const color = sample(COLORS);
      return {
        label: set.label,
        data: set.data?.map((d: { value: string }) => toNumber(d.value)),
        fill: set.fill ?? true,
        backgroundColor: set.backgroundColor ?? color,
        borderColor: set.borderColor ?? color,
        pointBackgroundColor: set.pointBackgroundColor ?? color,
        pointHoverBackgroundColor: set.pointBackgroundColor ?? color,
        pointHoverBorderColor: set.pointBackgroundColor ?? color,
        tension: toNumber(set.tension) ?? 0.4,
        pointStyle: set.pointStyle ?? "circle",
        pointBorderColor: "#fff",
        pointBorderWidth: toNumber(set.pointBorderWidth) ?? 2,
        pointRadius: toNumber(set.pointRadius) ?? 5,
      };
    }),
  };
};

type LineChartWidgetProps = {
  data?: Chart.ChartData<"line">;
} & ChartWidgetProps;

const LineChartWidget: React.FC<LineChartWidgetProps> = (props) => {
  const {
    fullView,
    data,
    title,
    description,
    filterGroups = [],
    widget,
    loading,
  } = props;

  const chartData = useMemo(() => {
    return isValidLine(data) ? parseLineData(data) : lineData;
  }, [data]);

  const Chart = (
    <Line
      style={{ maxHeight: "265px", maxWidth: "100%" }}
      options={lineOptions}
      // plugins={doughnutPlugins}
      data={chartData}
    />
  );

  const Title = <Typography variant="h5">{title ?? "Line Chart"}</Typography>;

  const Labels = (
    <LabelsBox
      className="graph-detail"
      direction="row"
      justifyContent={fullView ? "flex-start" : "center"}
    >
      {chartData.datasets?.map((set) =>
        set.label ? (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                background: (theme) =>
                  `${set.backgroundColor || theme.palette.primary.main}`,
                width: "10px",
                height: "10px",
                borderRadius: "100%",
              }}
            ></Box>
            <Typography variant="body1">{set.label}</Typography>
          </Stack>
        ) : null
      )}
    </LabelsBox>
  );

  const Filter = <FilterGroups filterGroups={filterGroups} widget={widget} />;

  const Description = (
    <Typography variant="body1" className="description-box">
      {description}
    </Typography>
  );

  return (
    <Spin spinning={loading}>
      {!fullView ? (
        <StackChart>
          <Box>
            {Title}
            {Chart}
          </Box>
          <Box>
            {Labels}
            {Filter}
          </Box>
        </StackChart>
      ) : (
        <BoxRow direction="row">
          <BoxGraph>{Chart}</BoxGraph>
          <DetailBox>
            <Box>
              {Title}
              {Description}
              {Labels}
            </Box>
            {Filter}
          </DetailBox>
        </BoxRow>
      )}
    </Spin>
  );
};

const barData: Chart.ChartData<"bar"> = {
  labels: [
    "30/12/2019",
    "29/12/2019",
    "28/12/2019",
    "27/12/2019",
    "26/12/2019",
  ],
  datasets: [
    {
      label: "Long",
      backgroundColor: "#0353a4",
      data: [9000, 5000, 5240, 3520, 2510],
    },
    {
      label: "Short",
      backgroundColor: "#ff8552",
      data: [3000, 4000, 6000, 3500, 3600],
    },
    {
      label: "Spreading",
      backgroundColor: "#4ecdc4",
      data: [6000, 7200, 6500, 4600, 3600],
    },
  ],
};

const borderRadius = 0;
const borderRadiusAllCorners = {
  topLeft: borderRadius,
  topRight: borderRadius,
  bottomLeft: borderRadius,
  bottomRight: borderRadius,
};

const barOptions: Chart.ChartOptions<"bar"> = {
  datasets: {
    bar: {
      borderWidth: 0,
      borderRadius: borderRadiusAllCorners,
      borderSkipped: false,
      maxBarThickness: 20,
    },
  },
  scales: {
    x: { stacked: true },
    y: {
      stacked: true,
      ticks: { maxRotation: 90, minRotation: 90 },
      grid: {
        offset: true,
      },
      beginAtZero: true,
    },
  },
  plugins: {
    tooltip: {
      enabled: true,
      // external: externalTooltipHandler,
    },
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false,
};

const isValidBar = (data: any): data is Chart.ChartData<"bar"> => {
  if (!data || !isArray(data.labels)) {
    return false;
  }

  if (
    !isArray(data.datasets) ||
    !data.datasets.every((set: any) => set.label && isArray(set.data))
  ) {
    return false;
  }

  return true;
};

const parseBarData = (data: any): Chart.ChartData<"bar"> => {
  return {
    labels: data.labels?.map((l: { value: string }) => l.value),
    datasets: data.datasets?.map((set: any) => ({
      label: set.label,
      data: set.data?.map((d: { value: string }) => toNumber(d.value)),
      backgroundColor: set.backgroundColor ?? sample(COLORS),
    })),
  };
};

type BarChartWidgetProps = {
  data?: Chart.ChartData<"bar">;
} & ChartWidgetProps;

const BarChartWidget: React.FC<BarChartWidgetProps> = (props) => {
  const {
    fullView,
    data,
    title,
    description,
    filterGroups = [],
    widget,
    loading,
  } = props;

  const chartData = useMemo(() => {
    return isValidBar(data) ? parseBarData(data) : barData;
  }, [data]);

  const Chart = (
    <Bar
      style={{
        maxHeight: "365px",
        maxWidth: "100%",
      }}
      className="bar-chart"
      options={barOptions}
      // plugins={doughnutPlugins}
      data={chartData}
    />
  );

  const Title = <Typography variant="h5">{title ?? "Bar Chart"}</Typography>;

  const Description = (
    <Typography variant="body1" className="description-box">
      {description}
    </Typography>
  );

  const Labels = (
    <LabelsBox
      className="graph-detail"
      direction="row"
      justifyContent={fullView ? "flex-start" : "center"}
    >
      {chartData.datasets?.map((set) =>
        set.label ? (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                background: (theme) =>
                  `${set.backgroundColor || theme.palette.primary.main}`,
                width: "10px",
                height: "10px",
                borderRadius: "100%",
              }}
            ></Box>
            <Typography variant="body1">{set.label}</Typography>
          </Stack>
        ) : null
      )}
    </LabelsBox>
  );

  const Filter = <FilterGroups filterGroups={filterGroups} widget={widget} />;

  return (
    <Spin spinning={loading}>
      {!fullView ? (
        <StackChart>
          <Box>
            {Title}
            {Chart}
          </Box>
          <Box>
            {Labels}
            {Filter}
          </Box>
        </StackChart>
      ) : (
        <BoxRow direction="row">
          <BoxGraph>{Chart}</BoxGraph>
          <DetailBox>
            <Box>
              {Title}
              {Description}
              {Labels}
            </Box>
            {Filter}
          </DetailBox>
        </BoxRow>
      )}
    </Spin>
  );
};

type DataListWidgetProps = {
  widget: GuiDashboardWidget;
  data?: {
    data_source_type?: string;
    data_source_id?: string;
    title_field?: string;
    data?: Record<string, unknown>[];
    data_fields?: { field_label: string; field_key: string }[];
  };
  loading?: boolean;
};

const getDataType = (data: any) => {
  if (isString(data)) {
    return DocumentElementType.TextField;
  }

  if (isNumber(data)) {
    return DocumentElementType.Number;
  }

  if (isBoolean(data)) {
    return DocumentElementType.Boolean;
  }

  if (isArray(data)) {
    return DocumentElementType.RecordList;
  }

  if (isPlainObject(data)) {
    return DocumentElementType.CodeEditor;
  }

  return "none";
};

const CustomDataListWidget: React.FC<DataListWidgetProps> = (props) => {
  const { data: chartData, widget } = props;
  const {
    data,
    title_field: titleField,
    data_fields: customDataFields,
  } = chartData || {};

  const accountId = useAccountSlug();
  const [isOpen, open, close] = useOpenClose();
  const form = useForm();

  const userId = getUser()?.slug;

  const populateFusionPayload = useGuiDashboardStore.usePopulateFusionPayload();
  const editModeEnabled = useGuiDashboardStore.useEditModeEnabled();

  const setPopulateFusionPayload =
    useGuiDashboardStore.useSetPopulateFusionPayload();

  const [selectedForm, setSelectedForm] =
    useState<{ type: "create" | "edit"; form: WidgetAction }>();

  const tableData = React.useMemo(() => {
    return isArray(data)
      ? data.map((d) => ({
          ...d,
          _id: v4(),
        })) || []
      : [];
  }, [data]);

  const fields = React.useMemo(() => {
    const titleFieldValue = customDataFields?.find(
      (f) => f.field_key === titleField
    );
    if (titleFieldValue) {
      return [
        titleFieldValue,
        ...(customDataFields?.filter((f) => f.field_key !== titleField) || []),
      ].map(
        (f) =>
          ({
            title: f.field_label,
            slug: f.field_key,
            type: getDataType(get(data?.[0], f.field_key)),
          } as DataField)
      );
    } else {
      return (
        customDataFields?.map(
          (f) =>
            ({
              title: f.field_label,
              slug: f.field_key,
              type: getDataType(get(data?.[0], f.field_key)),
            } as DataField)
        ) || []
      );
    }
  }, [data, titleField]);

  useEffect(() => {
    form.reset({
      [widget.slug]:
        tableData?.map((set) => ({
          ...set,
          _id: set._id,
        })) || [],
    });
  }, [tableData]);

  return (
    <>
      <FormProvider {...form}>
        <Box>
          <DataTable
            items={tableData}
            name={widget.slug}
            fields={fields}
            paginationViewOnly={editModeEnabled}
            disableInlineEdit={editModeEnabled}
            getColumnTitle={(field, idx) => {
              if (idx === 0) {
                return (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Stack
                      sx={{
                        width: "20px",
                        height: "20px",
                        background: (theme) => theme.palette.primary.main,
                        color: "#fff",
                        borderRadius: "3px",
                      }}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <KeyboardArrowDownOutlinedIcon />
                    </Stack>
                    <Stack
                      sx={{
                        // width: "20px",
                        height: "20px",
                        background: (theme) => theme.palette.primary.main,
                        color: "#fff",
                        borderRadius: "3px",
                        padding: "0px 6px",
                        // fontSize: "12px",
                        fontWeight: 600,
                        lineHeight: "18px",
                      }}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {field.title}
                    </Stack>
                    <Box>0 Tasks</Box>
                  </Stack>
                );
              }

              return (
                <Box sx={{ fontWeight: 600, lineHeight: "15px" }}>
                  {field.title}
                </Box>
              );
            }}
            tableActions={
              <DataTableWidgetActions
                widget={widget}
                type="create"
                onSelect={(f) => {
                  setSelectedForm({ type: "create", form: f });
                  open();
                  if (accountId && userId && f.populate_fusion) {
                    FusionModel.runWidgetFusion(
                      accountId,
                      userId,
                      f.populate_fusion,
                      {}
                    );
                  }
                }}
              />
            }
            rowActions={(rowIdx, item) => {
              return (
                <DataTableWidgetActions
                  widget={widget}
                  type="edit"
                  onSelect={(f) => {
                    setSelectedForm({ type: "edit", form: f });
                    open();
                    if (accountId && userId && f.populate_fusion) {
                      FusionModel.runWidgetFusion(
                        accountId,
                        userId,
                        f.populate_fusion,
                        f.form_fields.fields?.reduce<Record<string, unknown>>(
                          (acc, f) => {
                            set(acc, f.slug, get(item, f.slug));
                            return acc;
                          },
                          {}
                        ) || {}
                      );
                    }
                  }}
                />
              );
            }}
          />
        </Box>
      </FormProvider>
      <AddDatasetItemModel
        open={isOpen}
        onClose={() => {
          close();
          setPopulateFusionPayload(null);
          setSelectedForm(undefined);
        }}
        fields={selectedForm?.form.form_fields?.fields || []}
        title={widget.name}
        selected={populateFusionPayload}
        mode="add"
        defaultTitleField={false}
        onSubmit={(values: any) => {
          const fieldsData = { ...values };
          if (fieldsData.title) {
            delete fieldsData.title;
          }

          if (selectedForm?.type === "create") {
            if (accountId && userId && selectedForm.form.submit_fusion) {
              FusionModel.runWidgetFusion(
                accountId,
                userId,
                selectedForm.form.submit_fusion,
                values
              );
            }
            setPopulateFusionPayload(null);
            setSelectedForm(undefined);
            close();
          } else if (selectedForm?.type === "edit") {
            if (accountId && userId && selectedForm.form.submit_fusion) {
              FusionModel.runWidgetFusion(
                accountId,
                userId,
                selectedForm.form.submit_fusion,
                values
              );
            }
            setPopulateFusionPayload(null);
            setSelectedForm(undefined);
            close();
          }
        }}
      />
    </>
  );
};

type DataTableWidgetActionsProps = {
  type: "create" | "edit";
  onSelect?: (form: WidgetAction) => void;
} & Pick<DataListWidgetProps, "widget">;

const DataTableWidgetActions: React.FC<DataTableWidgetActionsProps> = (
  props
) => {
  const { widget, type, onSelect } = props;
  const [isOpen, open, close] = useOpenClose();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const editModeEnabled = useGuiDashboardStore.useEditModeEnabled();

  if (!editModeEnabled) {
    return widget.create_forms?.length ? (
      <Box>
        <IconButton
          onClick={(event) => {
            open();
            setAnchorEl(event.currentTarget);
          }}
        >
          {type === "edit" ? <MoreHoriz /> : <AddCircle />}
        </IconButton>
        <Menu
          id="add-menu"
          anchorEl={anchorEl}
          open={isOpen}
          onClose={() => {
            close();
            setAnchorEl(null);
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {widget[`${type}_forms`]?.map((form) => (
            <MenuItem key={form.id} onClick={() => onSelect?.(form)}>
              {form.button_title}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    ) : null;
  }

  return (
    <IconButton>{type === "edit" ? <MoreHoriz /> : <AddCircle />}</IconButton>
  );
};

const DataListWidget: React.FC<DataListWidgetProps> = (props) => {
  const { loading } = props;

  return (
    <Spin spinning={loading}>
      <CustomDataListWidget {...props} />
    </Spin>
  );

  // switch (data?.data_source_type) {
  //   case "dataset-design":
  //     return (
  //       <Spin spinning={loading}>
  //         <DocumentDesignDataListWidget {...props} />
  //       </Spin>
  //     );
  //   case "custom":
  //     return (

  //     );

  //   default:
  //     return (
  //       <Box>
  //         <DataTable
  //           items={[]}
  //           name={widget.slug}
  //           fields={[]}
  //           tableActions={
  //             <DataTableWidgetActions type="create" widget={widget} />
  //           }
  //           rowActions={<DataTableWidgetActions type="edit" widget={widget} />}
  //         />
  //       </Box>
  //     );
  // }
};

const EditContainerWrapper = styled(Box)({
  position: "relative",
  height: "100%",
});

const EditOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  background: theme.palette.text.secondary,
  borderRadius: "8px",
  pointerEvents: "none",
  opacity: "0",
  visibility: "hidden",

  transition: "all 0.4s ease",
}));

const EditCover = styled(Stack)({
  position: "absolute",
  width: "100%",
  height: "100%",
  // background: "rgba(255, 255, 255, 0.7)",
  borderRadius: "8px",
  pointerEvents: "none",
});

const EditIconBox = styled(Stack)(({ theme }) => ({
  // background: theme.palette.background.GF40,
  color: theme.palette.text.secondary,
  width: "100px",
  height: "100px",
  borderRadius: "8px",
  cursor: "pointer",
  pointerEvents: "all",
  position: "relative",
  zIndex: "9",
  "&:hover": {
    background: theme.palette.background.GFRightNavBackground,
    color: theme.palette.text.primary,
    "+.edit-overlay": {
      opacity: "1",
      visibility: "visible",
    },
  },
}));

type EditContainerProps = {
  onEditClick(): void;
};

const EditCoverContainer: React.FC<EditContainerProps> = (props) => {
  const { onEditClick } = props;

  const editModeEnabled = useGuiDashboardStore.useEditModeEnabled();

  return editModeEnabled ? (
    <EditCover
      className="edit-cover"
      justifyContent="center"
      alignItems="center"
    >
      <EditIconBox
        justifyContent="center"
        alignItems="center"
        onClick={onEditClick}
      >
        <EditOutlined sx={{ fontSize: "50px" }} />
      </EditIconBox>
      <EditOverlay className="edit-overlay" />
    </EditCover>
  ) : null;
};

const EditContainer: React.FC<PropsWithChildren<EditContainerProps>> = (
  props
) => {
  const { children, onEditClick } = props;

  return (
    <EditContainerWrapper>
      <EditCoverContainer onEditClick={onEditClick} />
      {children}
    </EditContainerWrapper>
  );
};

type WidgetProps = {
  widget?: GuiDashboardWidget;
  row: Row;
  onAddWidgetClick(): void;
};

const Widget: React.FC<WidgetProps> = (props) => {
  const { widget, onAddWidgetClick, row } = props;

  const accountId = useAccountSlug();

  const { subscribe, unsubscribe } = useSocket();
  const editModeEnabled = useGuiDashboardStore.useEditModeEnabled();
  const widgetData = useGuiDashboardStore.useWidgetData();
  const setChartData = useGuiDashboardStore.useSetWidgetData();
  const selectedFilterTabs = useGuiDashboardStore.useSelectedFilterTabs();
  const setPopulateFusionPayload =
    useGuiDashboardStore.useSetPopulateFusionPayload();

  const isChartDataSet = React.useRef<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const selectedTab = React.useMemo(
    () => selectedFilterTabs[`${widget?.slug}`],
    [selectedFilterTabs, widget]
  );

  // const chartData = React.useMemo(() => {
  //   if (widget) {
  //     return widgetData[widget.slug];
  //   }
  // }, [widget, widgetData]);

  // const dataRef = useRef<any>(chartData);

  const [remountKey, setRemountKey] = useState(v4());

  useEffect(() => {
    const userId = getUser()?.slug;
    if (widget && userId && accountId) {
      setLoading(true);
      const widgetFusion = widget.associated_fusion_id;
      FusionModel.runWidgetFusion(
        accountId,
        userId,
        widget.associated_fusion_id,
        { selected_tab: selectedTab || widget.filter_groups[0]?.id }
      );
      isChartDataSet.current[widget.slug] = false;

      subscribe("chart-data", widget.slug, (data) => {
        const fusionSlug = data?.data?.fusion_slug;
        const cData = data?.data?.session_data?.payload;

        setLoading(false);

        if (
          [
            "data-list-widget-create-action-form-submit",
            "data-list-widget-edit-action-form-submit",
          ].includes(data?.data?.session_data?.fusion_type || "")
        ) {
          setRemountKey(v4());
        } else if (
          [
            "data-list-widget-create-action-form-populate",
            "data-list-widget-edit-action-form-populate",
          ].includes(data?.data?.session_data?.fusion_type || "")
        ) {
          setPopulateFusionPayload(cData);
        } else if (
          fusionSlug === widgetFusion &&
          !isEmpty(cData) &&
          !isChartDataSet.current[widget.slug]
        ) {
          // dataRef.current = cData;
          setChartData(fusionSlug, (prev: any) => ({
            ...(prev || {}),
            ...cData,
          }));

          isChartDataSet.current[widget.slug] = true;
        }
      });

      return () => {
        unsubscribe("chart-data", widget.slug);
      };
    }
  }, [accountId, widget, selectedTab, remountKey]);

  const widgetProps = React.useMemo(() => {
    return {
      title: widget?.name,
      description: widget?.description,
      filterGroups: widget?.filter_groups,
      widget,
      loading,
    };
  }, [widget, loading]);

  switch (widget?.widget_type) {
    case DASHBOARD_WIDGET_TYPE.STAT:
      return (
        <StatisticsWidget
          data={widgetData?.[widget.associated_fusion_id]}
          {...widgetProps}
        />
      );
    case DASHBOARD_WIDGET_TYPE.PIE:
      return (
        <DoughnutChartWidget
          fullView={row.row_column_count === 1}
          data={widgetData?.[widget.associated_fusion_id]}
          {...widgetProps}
        />
      );
    case DASHBOARD_WIDGET_TYPE.LINE:
      return (
        <LineChartWidget
          fullView={row.row_column_count === 1}
          data={widgetData?.[widget.associated_fusion_id]}
          {...widgetProps}
        />
      );
    case DASHBOARD_WIDGET_TYPE.BAR:
      return (
        <BarChartWidget
          fullView={row.row_column_count === 1}
          data={widgetData?.[widget.associated_fusion_id]}
          {...widgetProps}
        />
      );
    case DASHBOARD_WIDGET_TYPE.DATA_LIST:
      return (
        <DataListWidget
          widget={widget}
          data={widgetData?.[widget.associated_fusion_id]}
          loading={loading}
        />
      );
    default:
      return (
        <ColPlaceholder
          onAddWidgetClick={onAddWidgetClick}
          editModeEnabled={editModeEnabled}
        />
      );
  }
};

type WidgetCardProps = {
  colIndex: number;
  onAddWidgetClick(): void;
  row: Row;
};

const WidgetCard: React.FC<WidgetCardProps> = (props) => {
  const { colIndex, onAddWidgetClick, row } = props;

  const gui = useGuiDashboardStore.useGuiDraft();
  const selectedTab = useGuiDashboardStore.useSelectedTab();
  const setWidgetDraft = useGuiDashboardStore.useSetWidgetDraft();
  const openWidgetEditor = useGuiDashboardStore.useOpenWidgetEditor();

  const { data: widgets } = useListItems({
    modelName: ApiModels.GuiDashboardWidget,
    requestOptions: {
      query: {
        parent_gui_id: gui?.slug,
        parent_tab_id:
          gui?.dashboard_list_settings?.tabs?.[selectedTab || 0]?.id,
      },
    },
    queryKey: [
      ApiModels.GuiDashboardWidget,
      gui?.slug,
      gui?.dashboard_list_settings?.tabs?.[selectedTab || 0]?.id,
    ],
    queryOptions: {
      enabled:
        !!gui?.slug &&
        gui?.dashboard_list_settings?.tabs?.[selectedTab || 0]?.id != null,
    },
  });

  const widget = useMemo(() => {
    return widgets?.find(
      (w) => w.row_id === row.row_id && w.row_column === colIndex
    );
  }, [widgets, colIndex, row]);

  const handleEditWidgetClick = () => {
    if (!widget) {
      return;
    }

    setWidgetDraft(widget);
    openWidgetEditor();
  };

  return (
    <ColHolder
      className={classNames({ "no-widget": !widget, "card-holder": true })}
    >
      <EditContainer onEditClick={handleEditWidgetClick}>
        <ColContent>
          <Widget
            widget={widget}
            row={row}
            onAddWidgetClick={onAddWidgetClick}
          />
        </ColContent>
      </EditContainer>
    </ColHolder>
  );
};

type RowHolderProps = {
  row: Row;
  onRemoveClick(): void;
  onAddWidgetClick(col: number): void;
  onColCountChange(count: number): void;
};

const RowHolder: React.FC<RowHolderProps> = (props) => {
  const { onRemoveClick, row, onAddWidgetClick, onColCountChange } = props;
  const [colCount, setColCount] = useState<number>(1);

  const editModeEnabled = useGuiDashboardStore.useEditModeEnabled();

  useEffect(() => {
    if (row) {
      setColCount(row.row_column_count ?? 0);
    }
  }, [row]);

  const handleColCountChange = (count: number) => {
    setColCount(count);
    onColCountChange(count);
  };

  return (
    <RowBox editMode={editModeEnabled}>
      {editModeEnabled && (
        <RowHeader
          className="row-header"
          direction="row"
          justifyContent="space-between"
        >
          <SortableList.DragHandle>
            <IconButton>
              <MenuOutlined fontSize="small" />
            </IconButton>
          </SortableList.DragHandle>
          <ColCountButtonGroup size="small">
            <Button
              key="1"
              onClick={() => handleColCountChange(1)}
              className={classNames({ selected: colCount === 1 })}
            >
              <ColCount1 />
            </Button>
            <Button
              key="2"
              onClick={() => handleColCountChange(2)}
              className={classNames({ selected: colCount === 2 })}
            >
              <ColCount2 />
            </Button>
            <Button
              key="3"
              onClick={() => handleColCountChange(3)}
              className={classNames({ selected: colCount === 3 })}
            >
              <ColCount3 className="col-3-icon" />
            </Button>
          </ColCountButtonGroup>
          <IconButton onClick={onRemoveClick}>
            <CloseOutlined fontSize="small" />
          </IconButton>
        </RowHeader>
      )}
      <RowFrame className="row-frame">
        <RowContent key={colCount} direction="row" className="content-row">
          {Array(colCount)
            .fill(null)
            .map((_, idx) => (
              <WidgetCard
                row={row}
                colIndex={idx}
                onAddWidgetClick={() => onAddWidgetClick(idx)}
              />
            ))}
        </RowContent>
      </RowFrame>
    </RowBox>
  );
};

type EditorFooterProps = {
  onAddRowClick(): void;
};

const EditorFooter: React.FC<EditorFooterProps> = (props) => {
  const { onAddRowClick } = props;

  const editModeEnabled = useGuiDashboardStore.useEditModeEnabled();

  return editModeEnabled ? (
    <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        fullWidth
        sx={{ maxWidth: "600px", borderStyle: "dashed" }}
        onClick={onAddRowClick}
      >
        Add Row <AddOutlined />
      </Button>
    </Stack>
  ) : null;
};

type Props = {
  onAddWidgetClick(rowId: string, col: number): void;
};

const DashboardEditor: React.FC<Props> = (props) => {
  const { onAddWidgetClick } = props;

  const guiDraft = useGuiDashboardStore.useGuiDraft();
  const removeTabRow = useGuiDashboardStore.useRemoveTabRow();
  const addTabRow = useGuiDashboardStore.useAddTabRow();
  const updateTabRow = useGuiDashboardStore.useUpdateTabRow();
  const setTabRows = useGuiDashboardStore.useSetTabRows();
  const selectedTab = useGuiDashboardStore.useSelectedTab();

  const [rows, setRows] = useState<(DashboardTabRow & { id: string })[]>([]);

  useEffect(() => {
    const tabRows =
      selectedTab != null
        ? guiDraft?.dashboard_list_settings?.tabs?.[selectedTab]?.tab_rows || []
        : [];
    setRows(tabRows.map((row) => ({ ...row, id: row.row_id })));
  }, [guiDraft, selectedTab]);

  const handleRemoveRow = (row: Row) => {
    if (selectedTab != null) {
      removeTabRow(selectedTab, row.row_id, true);
    }
  };

  const handleAddTabRow = () => {
    if (selectedTab != null) {
      addTabRow(selectedTab, { row_id: v4(), row_column_count: 1 }, true);
    }
  };

  const handleColCountChange = (row: Row, count: number) => {
    if (selectedTab != null) {
      updateTabRow(selectedTab, row.row_id, { row_column_count: count }, true);
    }
  };

  const handleRowSort = (sortedRows: Row[]) => {
    setRows(sortedRows);
    if (selectedTab != null) {
      setTabRows(
        selectedTab,
        sortedRows.map((r) => omit(r, ["id"])),
        true
      );
    }
  };

  return (
    <Box>
      <SortableList
        items={rows}
        onChange={handleRowSort}
        stackProps={{ spacing: "24px" }}
        renderItem={(item) => {
          return (
            <SortableList.Item id={item.id} handle>
              <RowHolder
                row={item}
                onRemoveClick={() => handleRemoveRow(item)}
                onAddWidgetClick={(col: number) =>
                  onAddWidgetClick(item.row_id, col)
                }
                onColCountChange={(count) => handleColCountChange(item, count)}
              />
            </SortableList.Item>
          );
        }}
      />
      <EditorFooter onAddRowClick={handleAddTabRow} />
    </Box>
  );
};

export default DashboardEditor;
