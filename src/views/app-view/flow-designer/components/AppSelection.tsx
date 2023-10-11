import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
  useTheme,
} from "@mui/material";
import Scrollbar from "components/Scrollbar";
import Spin from "components/Spin";
import {
  SkillsOperators,
  SystemModuleGroups,
  SystemModules,
} from "constants/Fusion";
import { FusionType } from "enums/Fusion";
import use3pAppModules from "queries/3p-app/use3pAppModules";
import use3pApps from "queries/3p-app/use3pApps";
import useFusion from "queries/fusion/useFusion";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNameInitial } from "utils";

type Props = {
  parentOperatorSlug: string;
  onAppSelect?(
    data:
      | { app: ThreePApp; appModule: ThreePAppAction }
      | { app: null; appModule: SystemModule }
  ): void;
};

const AppSelection: React.FC<Props> = (props) => {
  const { fusionSlug } = useParams<{ fusionSlug: string }>();
  const { onAppSelect, parentOperatorSlug } = props;

  const theme = useTheme();

  const [searchText, setSearchText] = useState("");
  const [selectedApp, setSelectedApp] = useState<ThreePApp>();
  const [systemModules, setSystemModules] = useState(SystemModules);

  const { data: apps } = use3pApps();
  const { data: appModules, isFetching } = use3pAppModules(
    selectedApp?.slug,
    selectedApp?.id
  );

  const { data: fusion } = useFusion(fusionSlug);

  const filteredApps = React.useMemo(() => {
    if (!searchText) {
      return apps;
    }
    return (
      apps?.filter((app) =>
        app.app_label.toLowerCase().includes(searchText.toLowerCase())
      ) || []
    );
  }, [searchText, apps]);

  const filteredModules = React.useMemo(() => {
    if (!searchText) {
      return appModules;
    }
    return (
      appModules?.filter((m) =>
        m.label.toLowerCase().includes(searchText.toLowerCase())
      ) || []
    );
  }, [appModules, searchText]);

  useEffect(() => {
    // const operators = fusion?.fusion_operators || [];
    // const sourceOperator = operators.find(
    //   (op) => op.operator_slug === parentOperatorSlug
    // );

    let sysModules = SystemModules;
    // const loopAlreadyAttached = !!operators.find(
    //   (op) =>
    //     op.app_module === SystemModuleType.Loop &&
    //     op.operator_input_settings?.iterator_slug === parentOperatorSlug
    // );
    // if (
    //   sourceOperator?.module_type !== ModuleType.Search ||
    //   loopAlreadyAttached
    // ) {
    //   sysModules = sysModules.filter((m) => m.slug !== SystemModuleType.Loop);
    // }
    if (fusion?.fusion_type !== FusionType.Skills) {
      sysModules = sysModules.filter(
        (m) => !SkillsOperators.find((sop) => sop.slug === m.slug)
      );
    }
    if (searchText) {
      setSystemModules(
        sysModules.filter((s) =>
          s.label.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setSystemModules(sysModules);
    }
  }, [fusion, parentOperatorSlug, searchText]);

  return (
    <Spin spinning={isFetching}>
      <Box>
        <Scrollbar autoHeight autoHeightMax={500}>
          {!selectedApp || (selectedApp && isFetching) ? (
            <>
              <List
                subheader={
                  <ListSubheader
                    component="div"
                    sx={{
                      backgroundColor:
                        theme.palette.background.GFRightNavBackground,
                    }}
                  >
                    Apps
                  </ListSubheader>
                }
              >
                {filteredApps?.map((app) => (
                  <ListItemButton
                    key={app.slug}
                    onClick={() => {
                      setSelectedApp(app);
                      setSearchText("");
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        src={app.app_color_logo || app.app_logo}
                        variant="rounded"
                      >
                        {getNameInitial(app.app_label)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={app.app_label} />
                  </ListItemButton>
                ))}
              </List>
              {SystemModuleGroups.map((group) => {
                if (
                  group.name === "Skills Operators" &&
                  fusion?.fusion_type !== FusionType.Skills
                ) {
                  return null;
                }
                return (
                  <List
                    subheader={
                      <ListSubheader
                        component="div"
                        sx={{
                          backgroundColor:
                            theme.palette.background.GFRightNavBackground,
                        }}
                      >
                        {group.name}
                      </ListSubheader>
                    }
                  >
                    {group.modules?.map((m) => {
                      if (systemModules.find((s) => s.slug === m.slug)) {
                        return (
                          <ListItemButton
                            key={m.slug}
                            onClick={() => {
                              setSelectedApp(undefined);
                              setSearchText("");
                              onAppSelect?.({ app: null, appModule: m });
                            }}
                          >
                            <ListItemIcon>
                              <Avatar variant="rounded">
                                {getNameInitial(m.label)}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={m.label} />
                          </ListItemButton>
                        );
                      }

                      return null;
                    })}
                  </List>
                );
              })}
            </>
          ) : (
            <List>
              {filteredModules?.map((m) => (
                <ListItemButton
                  key={m.slug}
                  onClick={() => {
                    setSelectedApp(undefined);
                    setSearchText("");
                    onAppSelect?.({ app: selectedApp, appModule: m });
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      src={selectedApp.app_color_logo || selectedApp.app_logo}
                      variant="rounded"
                    >
                      {getNameInitial(selectedApp.app_label)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={m.label} />
                </ListItemButton>
              ))}
            </List>
          )}
        </Scrollbar>
        <TextField
          fullWidth
          variant="standard"
          placeholder={!selectedApp ? "Search application" : "Search modules"}
          sx={{ p: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {!selectedApp ? (
                  <SearchIcon sx={{ color: "#fff" }} />
                ) : (
                  <IconButton
                    onClick={() => {
                      setSelectedApp(undefined);
                      setSearchText("");
                    }}
                  >
                    <ArrowCircleLeftOutlinedIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            disableUnderline: true,
          }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>
    </Spin>
  );
};

export default AppSelection;
