import {
  AddOutlined,
  ArrowBack,
  Close,
  EditOutlined,
  GridView,
  Search,
  ViewHeadline,
} from "@mui/icons-material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Card,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Drawer,
  DrawerProps,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import DataTable from "components/DataTable";
import DynamicCreateForm, {
  FormRefAttribute,
} from "components/Form/DynamicCreateForm";
import { transformFieldsOptions } from "components/Form/helper";
import Scrollbar from "components/Scrollbar";
import SubHeader from "components/SubHeader";
import Icon from "components/util-components/Icon";
import useOpenClose from "hooks/useOpenClose";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
} from "layouts/AnimationLayout";
import SkillDataModel from "models/SkillData";
import { ApiModels } from "queries/apiModelMapping";
import useFusion from "queries/fusion/useFusion";
import useCreateItem from "queries/useCreateItem";
import useListItems from "queries/useListItems";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { getSearchParams, setSearchParams } from "utils";

type Props = {};

const SkillsBlock = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",

  ".sub-header": {
    padding: "0 25px !important",
    height: "60px",
  },

  ".field-holder": {
    width: "auto !important",
    background: "transparent !important",
    height: "100%",

    ".MuiTabs-root": {
      height: "100%",

      ".MuiTabs-flexContainer": {
        height: "100%",
      },
    },
  },
}));
const SkillsBoxes = styled(Box)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minHeight: "0",
}));
const BoxesRow = styled(Grid)(({ theme }) => ({
  maxWidth: "1030px",
  marginLeft: "auto",
  marginRight: "auto",
  padding: "28px 20px 48px",
  overflow: "hidden",
  width: "100%",

  ".MuiTable-root": {
    borderCollapse: "separate",
    borderSpacing: "0 8px",
  },

  ".MuiTableBody-root": {
    ".MuiTableCell-root": {
      borderTop: "1px solid rgba(154, 154, 154, 0.2) !important",
      borderBottom: "1px solid rgba(154, 154, 154, 0.2) !important",
      // borderRadius: "8px",

      "&:first-child": {
        borderLeft: "1px solid rgba(154, 154, 154, 0.2) !important",
        borderRadius: "8px 0 0 8px !important",
      },
      "&:last-child": {
        borderRight: "1px solid rgba(154, 154, 154, 0.2) !important",
        borderRadius: "0 8px 8px 0 !important",
      },
    },
  },

  // ".MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root:first-child":
  //   {
  //     border: "1px solid rgba(154, 154, 154, 0.2)",
  //     borderRadius: "8px !important",
  //   },

  ".MuiTableCell-root": {
    background: "transparent !important",
  },
}));

const SkillsBox = styled(Grid)(({ theme }) => ({}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type SkillUserTableModuleTabsProps = {
  skillUserTableModules: SkillUserTableModule[];
  onTabChange(selectedModule: SkillUserTableModule): void;
  onAddClick(): void;
};

const SkillUserTableModuleTabs: React.FC<SkillUserTableModuleTabsProps> = (
  props
) => {
  const { skillUserTableModules, onTabChange, onAddClick } = props;

  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    onTabChange(skillUserTableModules[value]);
  }, [value, skillUserTableModules]);

  return (
    <>
      <Stack direction="row" alignItems="center" height="100%">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {skillUserTableModules.map((m, idx) => (
            <Tab
              icon={<Icon iconName={m.icon || "Menu"} />}
              iconPosition="start"
              label={m.name}
              {...a11yProps(idx)}
            />
          ))}
        </Tabs>
        <IconButton onClick={handleMoreClick}>
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="module-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              onAddClick();
              setAnchorEl(null);
            }}
          >
            <AddOutlined /> Add
          </MenuItem>
        </Menu>
      </Stack>
    </>
  );
};

type SkillDrawerDataWidgetProps = {
  title?: string;
  fields: DataField[];
  data: Record<string, unknown>;
  onEditClick(fields: DataField[], data: Record<string, unknown>): void;
};

const SkillDrawerDataWidget: React.FC<SkillDrawerDataWidgetProps> = (props) => {
  const { title, fields, data, onEditClick } = props;

  return (
    <Card
      sx={{
        margin: "20px",
        padding: "20px",
        borderRadius: "10px",
        background: (theme) =>
          `${theme.palette.text.secondary_shades?.["4p"]} !important`,
        position: "relative",
        minHeight: "60px",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{title}</Typography>
        <IconButton
          onClick={() => onEditClick(fields, data)}
          // sx={{ position: "absolute", right: 10, top: 10 }}
        >
          <EditOutlined />
        </IconButton>
      </Stack>
      <Stack direction="column" justifyContent="center" sx={{ mt: 2 }}>
        {fields.map((f) => (
          <Stack direction="row" alignItems="center">
            <Typography>{f.title}: </Typography>
            <Typography>
              <> {data[`${f.slug}`] ? ` ${data[`${f.slug}`]}` : ""}</>
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

type SidebarDataWidgetProps = {
  title?: string;
  fields: DataField[];
  sidebar?: SkillUserTableSidebar;
  skillDesignSlug: string;
  tableSlug: string;
  parentTableId?: string;
  fullTableSlug?: string;
  skillUserSidebars?: SkillUserTableSidebar[];
  onEditClick(fields: DataField[], data: Record<string, unknown>): void;
};

const SidebarDataWidget: React.FC<SidebarDataWidgetProps> = (props) => {
  const {
    title,
    fields,
    sidebar,
    tableSlug,
    skillDesignSlug,
    fullTableSlug,
    parentTableId,
    onEditClick,
    skillUserSidebars = [],
  } = props;

  const { data: sidebarSkillDataList } = useListItems({
    modelName: ApiModels.SkillData,
    requestOptions: {
      query: {
        skill_design_slug: skillDesignSlug,
        sidebar_slug: sidebar?.slug,
        table_slug: tableSlug,
        type: "sidebar",
      },
    },
    queryOptions: {
      enabled: !!skillDesignSlug && !!sidebar?.slug,
    },
    queryKey: [
      ApiModels.SkillData,
      skillDesignSlug,
      sidebar?.slug,
      tableSlug,
      "sidebar",
    ],
  });

  // console.log("Q KEY: ", [
  //   ApiModels.SkillData,
  //   skillDesignSlug,
  //   sidebar?.slug,
  //   tableSlug,
  //   "sidebar",
  // ]);

  const data = sidebarSkillDataList?.find(
    (s) => s[`parent_${fullTableSlug}_id`] === parentTableId
  );

  const childSidebars = skillUserSidebars.filter(
    (s) => s.parent_sidebar_id === sidebar?.id
  );

  return (
    <Card
      sx={{
        margin: "20px",
        padding: "20px",
        borderRadius: "10px",
        background: (theme) =>
          `${theme.palette.text.secondary_shades?.["4p"]} !important`,
        position: "relative",
        minHeight: "60px",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{title}</Typography>
        <IconButton
          onClick={() => onEditClick(fields, data || {})}
          // sx={{ position: "absolute", right: 10, top: 10 }}
        >
          <EditOutlined />
        </IconButton>
      </Stack>
      <Stack
        direction="column"
        justifyContent="center"
        spacing={2}
        sx={{ mt: 2 }}
      >
        {fields.map((f) => (
          <Stack direction="row" alignItems="center">
            <Typography>{f.title}: </Typography>
            <Typography>
              <> {data?.[`${f.slug}`] ? ` ${data?.[`${f.slug}`]}` : ""}</>
            </Typography>
          </Stack>
        ))}
        <Stack direction="column" justifyContent="center" spacing={2}>
          {childSidebars.map((s) => (
            <Card
              sx={{
                border: "1px solid rgba(154, 154, 154, 0.2) !important",
                padding: "5px 20px",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle1">{s.name}</Typography>
                {/* <IconButton>
                  <EditOutlined />
                </IconButton> */}
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

type SkillEditorProps = {
  selectedSidebar?: SkillUserTableSidebar;
  skillUserSidebars: SkillUserTableSidebar[];
  editData?: { fields: DataField[]; data: Record<string, unknown> };
  setSelectedSidebar: (selectedSidebar?: SkillUserTableSidebar) => void;
  setEditData: (data?: {
    fields: DataField[];
    data: Record<string, unknown>;
  }) => void;
  skillUserTables: SkillUserTable[];
  goBack(): void;
  tables: SkillUserTable[];
  value: number;
  fields: DataField[];
  submitHandler: (data: Record<string, unknown>) => void;
  skillDesignSlug: string;
  tableSlug: string;
  primaryRecordData?: Record<string, unknown>;
  setSidebarData: (data: Record<string, unknown>) => void;
  gotoComponent: (data: { name: string; id: string }) => void;
};

const SkillEditor: React.FC<SkillEditorProps> = (props) => {
  const {
    selectedSidebar,
    skillUserSidebars,
    setSelectedSidebar,
    setEditData,
    skillUserTables,
    goBack,
    tables,
    value,
    fields,
    submitHandler,
    skillDesignSlug,
    tableSlug,
    primaryRecordData,
    setSidebarData,
    gotoComponent,
    editData,
  } = props;
  const theme = useTheme();
  const formRef = useRef<FormRefAttribute | undefined>();

  useEffect(() => {
    if (primaryRecordData && formRef.current) {
      formRef.current.reset(primaryRecordData);
    }
  }, [primaryRecordData, formRef.current]);

  useEffect(() => {
    const { data } = editData || {};
    setTimeout(() => {
      formRef.current?.reset({ fields: data || {} });
    }, 1000);
  }, [editData]);

  return (
    <Box>
      <Toolbar sx={{ background: theme.palette.text.secondary_shades?.["4p"] }}>
        <Stack
          direction="row"
          justifyContent="flex-start"
          spacing={2}
          alignItems="center"
        >
          <IconButton
            onClick={() => {
              if (selectedSidebar) {
                const parent = skillUserSidebars.find(
                  (s) => s.id === selectedSidebar.parent_sidebar_id
                );
                if (parent) {
                  setSelectedSidebar(parent);
                  setEditData({
                    fields: parent.fields?.fields || [],
                    data: {},
                  });
                } else {
                  setSelectedSidebar(undefined);
                  const parentTable = skillUserTables.find(
                    (t) => t.id === selectedSidebar.table_id
                  );
                  setEditData({
                    fields: parentTable?.fields?.fields || [],
                    data: {},
                  });
                }
                goBack();
              } else {
                setEditData(undefined);
                goBack();
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography>
            {selectedSidebar ? selectedSidebar.name : tables[value]?.name}
          </Typography>
        </Stack>
      </Toolbar>
      <Box
        sx={{
          height: "calc(100vh - 128px)",
        }}
      >
        <Scrollbar>
          <Box sx={{ padding: "20px" }}>
            <DynamicCreateForm
              name={"fields"}
              key={selectedSidebar?.slug || "table-primary-form"}
              fields={(fields || []) as any[]}
              ref={formRef}
              submitButton={false}
              onFormEvent={(e) => {
                if (e.name === "table-edit-complete") {
                  formRef.current?.setValue(e.field, e.data.array);
                }
              }}
              labelCol={false}
              allFieldsFullWidth
            />
            <DialogActions sx={{ background: "transparent" }}>
              <LoadingButton
                onClick={() => {
                  if (selectedSidebar) {
                    const parent = skillUserSidebars.find(
                      (s) => s.id === selectedSidebar.parent_sidebar_id
                    );
                    if (parent) {
                      setSelectedSidebar(parent);
                      setEditData({
                        fields: parent.fields?.fields || [],
                        data: {},
                      });
                    } else {
                      setSelectedSidebar(undefined);
                      const parentTable = skillUserTables.find(
                        (t) => t.id === selectedSidebar.table_id
                      );
                      setEditData({
                        fields: parentTable?.fields?.fields || [],
                        data: {},
                      });
                    }
                    goBack();
                  } else {
                    setEditData(undefined);
                    goBack();
                  }
                }}
                // loading={isLoading}
                loadingPosition="start"
              >
                Cancel
              </LoadingButton>
              <LoadingButton
                onClick={(e) => {
                  console.log({ form: formRef.current });
                  formRef.current?.handleSubmit(submitHandler)();
                }}
                variant="contained"
                // loading={isLoading}
                loadingPosition="start"
              >
                Submit
              </LoadingButton>
            </DialogActions>
            {skillUserSidebars
              .filter(
                (s) =>
                  s.parent_sidebar_id &&
                  s.parent_sidebar_id === selectedSidebar?.id
              )
              .map((s) => (
                <SidebarDataWidget
                  title={s.name}
                  key={s.id}
                  fields={s.fields?.fields || []}
                  skillDesignSlug={skillDesignSlug}
                  sidebar={s}
                  tableSlug={tables[value].slug}
                  fullTableSlug={tableSlug}
                  parentTableId={primaryRecordData?.id as string}
                  skillUserSidebars={skillUserSidebars}
                  onEditClick={(fields, data) => {
                    setSelectedSidebar(s);
                    setSidebarData(data);
                    setEditData({ fields, data });
                    setTimeout(() => {
                      formRef.current?.reset({ fields: data || {} });
                    }, 1000);
                    gotoComponent({
                      name: "skill-fields-editor",
                      id: s.id,
                    });
                  }}
                />
              ))}
          </Box>
        </Scrollbar>
      </Box>
    </Box>
  );
};

const SkillIntentEditor: React.FC<SkillEditorProps> = (props) => {
  const {
    selectedSidebar,
    skillUserSidebars,
    setSelectedSidebar,
    setEditData,
    skillUserTables,
    goBack,
    tables,
    value,
    fields,
    submitHandler,
    skillDesignSlug,
    tableSlug,
    primaryRecordData,
    setSidebarData,
    gotoComponent,
    editData,
  } = props;
  const theme = useTheme();
  const formRef = useRef<FormRefAttribute | undefined>();

  useEffect(() => {
    if (primaryRecordData && formRef.current) {
      formRef.current.reset(primaryRecordData);
    }
  }, [primaryRecordData, formRef.current]);

  useEffect(() => {
    const { data } = editData || {};
    setTimeout(() => {
      formRef.current?.reset({ fields: data || {} });
    }, 1000);
  }, [editData]);

  return (
    <Box>
      <Toolbar sx={{ background: theme.palette.text.secondary_shades?.["4p"] }}>
        <Stack
          direction="row"
          justifyContent="flex-start"
          spacing={2}
          alignItems="center"
        >
          <IconButton
            onClick={() => {
              if (selectedSidebar) {
                const parent = skillUserSidebars.find(
                  (s) => s.id === selectedSidebar.parent_sidebar_id
                );
                if (parent) {
                  setSelectedSidebar(parent);
                  setEditData({
                    fields: parent.fields?.fields || [],
                    data: {},
                  });
                } else {
                  setSelectedSidebar(undefined);
                  const parentTable = skillUserTables.find(
                    (t) => t.id === selectedSidebar.table_id
                  );
                  setEditData({
                    fields: parentTable?.fields?.fields || [],
                    data: {},
                  });
                }
                goBack();
              } else {
                setEditData(undefined);
                goBack();
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography>
            {selectedSidebar ? selectedSidebar.name : tables[value]?.name}
          </Typography>
        </Stack>
      </Toolbar>
      <Box
        sx={{
          height: "calc(100vh - 128px)",
        }}
      >
        <Scrollbar>
          <Box sx={{ padding: "20px" }}></Box>
        </Scrollbar>
      </Box>
    </Box>
  );
};
const SkillUserTableTabs = styled(Tabs)(({ theme }) => ({
  ".MuiTabs-indicator": {
    background: "#181B1F",
  },
  ".MuiTabs-flexContainer": {
    ".MuiTab-root": {
      flexGrow: 1,
      background: theme.palette.text.secondary_shades?.["4p"],
      color: theme.palette.background.GF40,
      minWidth: "100px",

      "&.Mui-selected": {
        background: "#181B1F",
      },
    },
  },
}));

type SkillUserTableSidebarProps = {
  skillUserTableModule: SkillUserTableModule | null;
  skillUserTables: SkillUserTable[];
  skillUserSidebars: SkillUserTableSidebar[];
  primaryRecordData?: Record<string, unknown>;
  skillDesignSlug: string;
  tableSlug: string;
  activeModule?: SkillUserTableModule | null;
  primaryTable?: SkillUserTable;
} & DrawerProps;

const SkillUserTableSidebar: React.FC<SkillUserTableSidebarProps> = (props) => {
  const {
    skillUserTableModule,
    skillUserTables,
    skillUserSidebars,
    primaryRecordData,
    skillDesignSlug,
    tableSlug,
    activeModule,
    primaryTable,
    ...drawerProps
  } = props;

  const rightSidebarRef = useRef<AnimationLayoutRef>(null);
  const theme = useTheme();

  const [sidebarData, setSidebarData] = useState<Record<string, unknown>>({});

  const [value, setValue] = useState(0);
  const [selectedSidebar, setSelectedSidebar] =
    useState<SkillUserTableSidebar>();

  const queryClient = useQueryClient();

  // const { mutate: createSkillData } = useCreateItem({
  //   modelName: ApiModels.SkillData,
  //   requestOptions: {
  //     query: {
  //       skill_design_slug: skillDesignSlug,
  //       table_slug: tableSlug,
  //       sidebar_slug: selectedSidebar?.slug,
  //       type: "sidebar",
  //       // parent_sidebar_slug,
  //     },
  //   },
  // });

  const [editData, setEditData] =
    useState<{ fields: DataField[]; data: Record<string, unknown> }>();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // useEffect(() => {
  //   console.log({ form: formRef.current });
  //   if (formRef.current) {
  //     console.log(editData?.data);
  //     formRef.current.reset({ fields: editData?.data || {} });
  //   }
  // }, [editData, formRef.current]);

  const tables = useMemo(() => {
    return (
      skillUserTables.filter((t) => t.module_id === skillUserTableModule?.id) ||
      []
    );
  }, [skillUserTables, skillUserTableModule]);

  const sidebars = useMemo(() => {
    const selectedTable = tables[value];
    return (
      skillUserSidebars.filter(
        (s) => s.table_id === selectedTable?.id && !s.parent_sidebar_id
      ) || []
    );
  }, [skillUserSidebars, value, tables]);

  const fields = useMemo(() => {
    let fields: DataField[] = [];
    if (editData?.fields?.length) {
      fields = fields.concat(
        transformFieldsOptions(editData.fields || [], {
          prefixName: "fields",
        })
      );
    }
    return fields;
  }, [editData]);
  // console.log("🚀 ~ file: index.tsx:423 ~ fields ~ fields:", fields);

  const submitHandler = useCallback(
    async ({ fields: data }: Record<string, unknown>) => {
      if (!sidebarData?.id) {
        if (selectedSidebar) {
          await SkillDataModel.create(
            { fields: data },
            {
              query: {
                skill_design_slug: skillDesignSlug,
                table_slug: tableSlug,
                sidebar_slug: selectedSidebar?.slug,
                parent_sidebar_slug: primaryRecordData?.id,
                type: "sidebar",
              },
            }
          );
        } else {
          if (!editData?.data?.id) {
            await SkillDataModel.create(
              { fields: data },
              {
                query: {
                  skill_design_slug: skillDesignSlug,
                  table_slug: tableSlug,
                  type: "table",
                },
              }
            );
          } else {
            await SkillDataModel.update(
              sidebarData?.id as string,
              { fields: data },
              {
                query: {
                  skill_design_slug: skillDesignSlug,
                  table_slug: tableSlug,
                  type: "table",
                },
              }
            );
          }
        }
      } else {
        if (selectedSidebar) {
          await SkillDataModel.update(
            sidebarData?.id as string,
            { fields: data },
            {
              query: {
                skill_design_slug: skillDesignSlug,
                table_slug: tableSlug,
                sidebar_slug: selectedSidebar?.slug,
                type: "sidebar",
              },
            }
          );
        } else {
          if (!editData?.data?.id) {
            await SkillDataModel.create(
              { fields: data },
              {
                query: {
                  skill_design_slug: skillDesignSlug,
                  table_slug: tableSlug,
                  type: "table",
                },
              }
            );
          } else {
            await SkillDataModel.update(
              sidebarData?.id as string,
              { fields: data },
              {
                query: {
                  skill_design_slug: skillDesignSlug,
                  table_slug: tableSlug,
                  type: "table",
                },
              }
            );
          }
        }
      }
      // console.log([
      //   ApiModels.SkillData,
      //   skillDesignSlug,
      //   selectedSidebar?.slug,
      //   tables[value].slug,
      //   "sidebar",
      // ]);
      // queryClient.invalidateQueries([
      //   ApiModels.SkillData,
      //   skillDesignSlug,
      //   selectedSidebar?.slug,
      //   tableSlug,
      //   "sidebar",
      // ]);
      // queryClient.invalidateQueries([
      //   ApiModels.SkillData,
      //   skillDesignSlug,
      //   "table",
      //   activeModule?.slug,
      //   primaryTable?.slug,
      // ]);
      await queryClient.refetchQueries([
        ApiModels.SkillData,
        skillDesignSlug,
        selectedSidebar?.slug,
        tables[value].slug,
        "sidebar",
      ]);
      await queryClient.refetchQueries([
        ApiModels.SkillData,
        skillDesignSlug,
        "table",
        activeModule?.slug,
        primaryTable?.slug,
      ]);
    },
    [
      primaryRecordData?.id,
      selectedSidebar,
      sidebarData?.id,
      skillDesignSlug,
      tableSlug,
      activeModule,
      primaryTable,
      tables,
      value,
      editData,
    ]
  );

  const getComponents: Config["getComponents"] = useCallback(
    (gotoComponent, goBack) => {
      return {
        main: (
          <>
            <SkillUserTableTabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={false}
              aria-label="basic tabs example"
            >
              {tables.map((m, idx) => (
                <Tab
                  icon={<Icon iconName={m.icon || "Menu"} />}
                  label={m.name}
                  iconPosition="start"
                  {...a11yProps(idx)}
                />
              ))}
            </SkillUserTableTabs>
            <Box
              sx={{
                height: "calc(100vh - 108px)",
              }}
            >
              <Scrollbar>
                <Box height="100%">
                  <SkillDrawerDataWidget
                    title={tables[value]?.name}
                    fields={tables[value]?.fields?.fields || []}
                    data={primaryRecordData || {}}
                    onEditClick={(fields, data) => {
                      setEditData({ fields, data });
                      gotoComponent({
                        name: "skill-fields-editor",
                        id: tables[value].id,
                      });
                    }}
                  />
                  {sidebars.map((s) => (
                    <SidebarDataWidget
                      title={s.name}
                      key={s.id}
                      fields={s.fields?.fields || []}
                      skillDesignSlug={skillDesignSlug}
                      sidebar={s}
                      tableSlug={tables[value].slug}
                      fullTableSlug={tableSlug}
                      parentTableId={primaryRecordData?.id as string}
                      skillUserSidebars={skillUserSidebars}
                      onEditClick={(fields, data) => {
                        setSelectedSidebar(s);
                        setSidebarData(data);
                        setEditData({ fields, data });
                        gotoComponent({
                          name: "skill-fields-editor",
                          id: s.id,
                        });
                      }}
                    />
                  ))}
                  {/* <SkillDrawerDataWidget
                    title={"Skill Intents"}
                    fields={}
                    data={primaryRecordData || {}}
                    onEditClick={(fields, data) => {
                      setEditData({ fields, data });
                      gotoComponent({
                        name: "skill-fields-editor",
                        id: tables[value].id,
                      });
                    }}
                  /> */}
                </Box>
              </Scrollbar>
            </Box>
          </>
        ),
        "skill-fields-editor": (
          <SkillEditor
            selectedSidebar={selectedSidebar}
            skillUserSidebars={skillUserSidebars}
            setSelectedSidebar={setSelectedSidebar}
            editData={editData}
            setEditData={setEditData}
            skillUserTables={skillUserTables}
            goBack={goBack}
            tables={tables}
            value={value}
            fields={fields}
            submitHandler={(data) => {
              submitHandler(data);
              goBack();
            }}
            skillDesignSlug={skillDesignSlug}
            tableSlug={tableSlug}
            primaryRecordData={primaryRecordData}
            setSidebarData={setSidebarData}
            gotoComponent={gotoComponent}
          />
        ),
        "skill-intent-editor": (
          <div></div>
          // <SkillIntentEditor
          //   goBack={goBack}
          //   skillDesignSlug={skillDesignSlug}
          // />
        ),
      };
    },
    [
      value,
      tables,
      primaryRecordData,
      sidebars,
      selectedSidebar,
      skillUserSidebars,
      editData,
      skillUserTables,
      fields,
      submitHandler,
      skillDesignSlug,
      tableSlug,
    ]
  );

  return (
    <Drawer
      sx={{
        width: 0,
        flexShrink: 0,
        // zIndex: theme.zIndex.appBar - 1,

        [`& .MuiDrawer-paper`]: {
          zIndex: theme.zIndex.appBar - 1,
          width: 450,
          boxSizing: "border-box",
          boxShadow: "none",
          background: "none",
          backgroundImage: "none",
          backgroundColor: theme.palette.background.GFRightNavBackground,

          ".MuiPaper-root": {
            boxShadow: "none",
            background: "none",
            backgroundImage: "none",
          },
        },
      }}
      anchor="right"
      hideBackdrop
      {...drawerProps}
    >
      <Toolbar
        sx={{
          background: "#112672",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            {skillUserTableModule?.icon && (
              <Icon iconName={skillUserTableModule.icon} />
            )}
            <Typography>{skillUserTableModule?.name}</Typography>
          </Stack>
          <IconButton
            onClick={(e) => drawerProps.onClose?.(e, "backdropClick")}
          >
            <Close />
          </IconButton>
        </Stack>
      </Toolbar>
      <ClickAwayListener
        onClickAway={(e) => drawerProps.onClose?.(e, "backdropClick")}
      >
        <Box height="100%" sx={{ background: "#181B1F" }}>
          <AnimationLayout
            config={{
              getComponents,
              initialComponent: getSearchParams().get("s_name") || "main",
            }}
            ref={rightSidebarRef}
            urlQueryKey="s"
          />
        </Box>
      </ClickAwayListener>
    </Drawer>
  );
};

type TableRowActionsProps = {
  index: number;
  item: Record<string, unknown>;
  onEditClick(): void;
};

const TableRowActions: React.FC<TableRowActionsProps> = (props) => {
  const { onEditClick } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        onClick={(e) => {
          handleMoreClick(e);
        }}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="edit-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            onEditClick();
            setAnchorEl(null);
          }}
        >
          <EditOutlined /> Edit
        </MenuItem>
      </Menu>
    </Box>
  );
};

type AddModelProps = {
  onSubmit(data: Record<string, unknown>): void;
  onClose(): void;
  skillDesignModule?: SkillUserTableModule | null;
  skillDesignTables: SkillUserTable[];
} & Omit<DialogProps, "onSubmit">;

const AddModel: React.FC<AddModelProps> = (props) => {
  const {
    onSubmit,
    onClose,
    open,
    skillDesignModule,
    skillDesignTables,
    ...dialogProps
  } = props;

  const formRef = useRef<FormRefAttribute | undefined>();

  const submitHandler = (data: Record<string, unknown>) => {
    onSubmit(data);
  };

  const handleClose = () => {
    onClose?.();
  };

  const fields = useMemo(() => {
    if (!open) return [];
    let fields: DataField[] = [];
    const primaryTable = skillDesignTables.find(
      (t) =>
        t.module_id === skillDesignModule?.id && t.slug === "primary_record"
    );
    if (primaryTable?.fields?.fields?.length) {
      fields = fields.concat(
        transformFieldsOptions(primaryTable.fields.fields || [], {
          prefixName: "fields",
        })
      );
    }
    return fields;
  }, [open, skillDesignModule?.id, skillDesignTables]);

  return (
    <Dialog
      onClose={handleClose}
      disableEscapeKeyDown
      scroll="body"
      fullWidth
      maxWidth={false}
      open={open}
      {...dialogProps}
    >
      <DialogTitle>Add Gui</DialogTitle>

      <Scrollbar className="form-scroller">
        <DialogContent>
          <DynamicCreateForm
            name={"fields"}
            fields={fields as any}
            ref={formRef}
            submitButton={false}
            onFormEvent={(e) => {
              if (e.name === "table-edit-complete") {
                formRef.current?.setValue(e.field, e.data.array);
              }
            }}
          />
        </DialogContent>
      </Scrollbar>

      <DialogActions>
        <LoadingButton
          onClick={handleClose}
          // loading={isLoading}
          loadingPosition="start"
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          onClick={(e) => {
            formRef.current?.handleSubmit(submitHandler)(e);
          }}
          variant="contained"
          // loading={isLoading}
          loadingPosition="start"
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const Skills: React.FC<Props> = () => {
  const { slug: skillDesignSlug } = useParams<{ slug: string }>();

  const [isOpen, open, close] = useOpenClose();

  const { data: skillDesign } = useFusion(skillDesignSlug);

  const [activeModule, setActiveModule] = useState<SkillUserTableModule | null>(
    skillDesign?.skill_user_table_modules?.[0] || null
  );
  const [primaryRecordData, setPrimaryRecordData] =
    useState<Record<string, unknown>>();
  const [selectedModule, setSelectedModule] =
    useState<SkillUserTableModule | null>(null);

  const primaryTable = useMemo(() => {
    return skillDesign?.skill_user_tables?.find(
      (t) => t.module_id === activeModule?.id && t.slug === "primary_record"
    );
  }, [skillDesign, activeModule]);

  const tableSlug =
    activeModule?.slug && primaryTable?.slug
      ? `${activeModule?.slug}.${primaryTable?.slug}`
      : "";

  const { data: primaryTableData } = useListItems({
    modelName: ApiModels.SkillData,
    requestOptions: {
      query: {
        skill_design_slug: skillDesignSlug,
        table_slug: tableSlug,
        type: "table",
      },
    },
    queryKey: [
      ApiModels.SkillData,
      skillDesignSlug,
      "table",
      activeModule?.slug,
      primaryTable?.slug,
    ],
    queryOptions: {
      enabled: !!skillDesignSlug && !!tableSlug,
    },
  });

  const { mutate: createSkillData } = useCreateItem({
    modelName: ApiModels.SkillData,
    requestOptions: {
      query: {
        skill_design_slug: skillDesignSlug,
        table_slug: tableSlug,
        type: "table",
      },
    },
  });

  const form = useForm<{ data_table: SkillData[] }>({
    defaultValues: {
      data_table: [],
    },
  });

  const tableData = useMemo(() => {
    return primaryTableData?.map((t) => ({ ...t, _id: t.id })) || [];
  }, [primaryTableData]);

  useEffect(() => {
    if (tableData) {
      form.setValue("data_table", tableData);
    }
  }, [tableData]);

  const handleAddClick = () => {
    open();
  };

  const handleAddSubmit = (data: Record<string, unknown>) => {
    console.log(data.fields);

    createSkillData(
      { fields: data.fields },
      {
        onSuccess: (resData) => {
          // const listData = queryClient.getQueryData([
          //   ApiModels.SkillData,
          //   skillDesignSlug,
          //   "table",
          //   activeModule?.slug,
          //   primaryTable?.slug,
          // ]);
          // console.log(
          //   "🚀 ~ file: index.tsx:787 ~ handleAddSubmit ~ listData:",
          //   listData
          // );
          // queryClient.setQueryData<SkillData[]>(
          //   [
          //     ApiModels.SkillData,
          //     skillDesignSlug,
          //     "table",
          //     activeModule?.slug,
          //     primaryTable?.slug,
          //   ],
          //   (prev) => [...(prev || []), resData]
          // );
        },
      }
    );

    close();
  };

  return (
    <SkillsBlock>
      <SubHeader
        icon={<Icon iconName={skillDesign?.fusion_icon || "Menu"} />}
        title={skillDesign?.fusion_title || "Skills"}
        rightSide={
          <SkillUserTableModuleTabs
            skillUserTableModules={skillDesign?.skill_user_table_modules || []}
            onTabChange={(m) => setActiveModule(m)}
            onAddClick={handleAddClick}
          />
        }
      />
      <SkillsBoxes>
        <Scrollbar>
          <BoxesRow container spacing={"20px"}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: "100%" }}
            >
              <TextField
                variant="filled"
                size="small"
                InputProps={{ endAdornment: <Search fontSize="small" /> }}
                placeholder="Search..."
              />
              <Stack direction="row" alignItems="center" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontSize: "12px" }}>
                    {"Sort:   "}
                  </Typography>
                  <Select
                    variant="outlined"
                    size="small"
                    value="last_viewed"
                    sx={{
                      background: "none",
                      ".MuiSelect-select": {
                        paddingLeft: "0px",
                        paddingRight: "25px !important",
                        fontSize: "12px !important",
                      },
                      ".MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      ".MuiSvgIcon-root": {
                        fontSize: "18px",
                      },
                    }}
                  >
                    <MenuItem value="last_viewed">Last Viewed</MenuItem>
                  </Select>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar
                    variant="square"
                    sx={{
                      width: "26px",
                      height: "26px",
                      background: (theme) => theme.palette.background.GF10,
                      borderRadius: "4px",
                      color: "#fff",
                    }}
                  >
                    <ViewHeadline fontSize="small" />
                  </Avatar>
                  <Avatar
                    variant="square"
                    sx={{
                      width: "26px",
                      height: "26px",
                      background: (theme) => theme.palette.background.GF10,
                      borderRadius: "4px",
                      color: (theme) => theme.palette.background.GF40,
                    }}
                  >
                    <GridView fontSize="small" />
                  </Avatar>
                </Stack>
              </Stack>
            </Stack>
            <FormProvider {...form}>
              <DataTable
                name="data_table"
                fields={primaryTable?.fields?.fields || []}
                items={tableData}
                pagination={false}
                tableActions={<></>}
                rowActions={(idx, item) => (
                  <TableRowActions
                    index={idx}
                    item={item}
                    onEditClick={() => {
                      setPrimaryRecordData(item);
                      setSelectedModule(activeModule);
                    }}
                  />
                )}
              />
            </FormProvider>
            {/* {Array(8)
              .fill(null)
              .map((_, idx) => {
                return (
                  <SkillsBox item xs={6} md={4} lg={3} key={idx}>
                    <SkillsBadge />
                  </SkillsBox>
                );
              })} */}
          </BoxesRow>
        </Scrollbar>
      </SkillsBoxes>
      <SkillUserTableSidebar
        skillUserTableModule={selectedModule}
        skillUserTables={skillDesign?.skill_user_tables || []}
        skillUserSidebars={skillDesign?.skill_user_table_sidebars || []}
        open={!!selectedModule}
        primaryRecordData={primaryRecordData}
        skillDesignSlug={skillDesignSlug || ""}
        tableSlug={tableSlug || ""}
        activeModule={activeModule}
        primaryTable={primaryTable}
        onClose={() => {
          setSearchParams((prev) => ({ ...prev, s: "", s_name: "" }));
          setSelectedModule(null);
        }}
      />
      <AddModel
        onSubmit={handleAddSubmit}
        onClose={close}
        open={isOpen}
        skillDesignModule={activeModule}
        skillDesignTables={skillDesign?.skill_user_tables || []}
      />
    </SkillsBlock>
  );
};

export default Skills;
