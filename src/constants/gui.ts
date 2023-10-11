export const GUI_TYPE = {
  DATASET_LIST: "dataset-list",
  DASHBOARD: "dashboard",
};

export const GUI_TYPE_OPTIONS = [
  { label: "Dataset List", value: GUI_TYPE.DATASET_LIST },
  { label: "Dashboard", value: GUI_TYPE.DASHBOARD },
];

export const DASHBOARD_WIDGET_TYPE = {
  BAR: "bar",
  LINE: "line",
  PIE: "pie",
  STAT: "stat",
  DATA_LIST: "data-list",
} as const;

export const DASHBOARD_WIDGET_TYPE_OPTIONS = [
  {
    label: "Bar Chart",
    value: DASHBOARD_WIDGET_TYPE.BAR,
    icon: "BarChartOutlined",
  },
  {
    label: "Line Chart",
    value: DASHBOARD_WIDGET_TYPE.LINE,
    icon: "TimelineOutlined",
  },
  {
    label: "Pie Chart",
    value: DASHBOARD_WIDGET_TYPE.PIE,
    icon: "DataUsageOutlined",
  },
  {
    label: "Statistics",
    value: DASHBOARD_WIDGET_TYPE.STAT,
    icon: "ScoreOutlined",
  },
  {
    label: "Data List",
    value: DASHBOARD_WIDGET_TYPE.DATA_LIST,
    icon: "Toc",
  },
];
