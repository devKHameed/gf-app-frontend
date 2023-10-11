import Add from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import Search from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import IconPicker from "components/IconPicker";
import GenericIcon from "components/util-components/Icon";
import { Icons as IconType } from "constants/index";
import InnerPageLayout from "layouts/inner-app-layout";
import IconModel from "models/Icon";
import React, { useState } from "react";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
import AddIconModal from "./components/AddIconModal";

type Props = {};

const SearchBox = styled(FormControl)(({ theme }) => ({
  ".MuiInputBase-root": {
    paddingRight: "8px",
  },

  "&:hover": {
    ".MuiOutlinedInput-notchedOutline ": {
      borderColor: theme.palette.background.GF60,
    },
  },

  ".Mui-focused": {
    ".MuiOutlinedInput-notchedOutline ": {
      borderColor: theme.palette.background.GF60,
      borderWidth: "1px",
    },
  },

  ".MuiInputBase-input": {
    fontSize: "14px",
    fontWeight: "400",
    color: theme.palette.background.GF50,
    boxSizing: "border-box",
    height: "30px",
    padding: "7px 8px 7px 11px",
  },

  ".MuiInputAdornment-root": {
    width: "19px",
    cursor: "pointer",

    "&:hover": {
      color: theme.palette.text.primary,
    },

    svg: {
      width: "100%",
      height: "auto",
      display: "block",
    },
  },

  ".MuiOutlinedInput-notchedOutline ": {
    borderColor: theme.palette.background.GF40,
  },
}));

export const RStack = styled(Stack)(({ theme }) => ({
  marginBottom: "24px",

  [`${theme.breakpoints.down("sm")}`]: {
    marginBottom: "16px",
  },
}));

const Icons: React.FC<Props> = (props) => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: icons } = useQuery(["icons"], async () => {
    const res = await IconModel.list();
    return res.data;
  });

  const deleteMutation = useMutation<
    { slug: string },
    unknown,
    { iconType: string; slug: string }
  >({
    mutationFn: async ({
      iconType,
      slug,
    }: {
      iconType: string;
      slug: string;
    }) => {
      await IconModel.delete(`${iconType}/${slug}`);
      return { slug };
    },
    onSuccess: (data) => {
      queryClient.setQueriesData(["icons"], (icons: Icon[] = []) => {
        return icons.filter((ic) => ic.slug !== data.slug);
      });
    },
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <InnerPageLayout
        icon={
          <ForumOutlined
            sx={{
              width: "40px",
              height: "40px",
              color: "text.secondary",
            }}
          />
        }
        title="Icons"
        onChange={handleChange}
        tabList={[
          {
            label: (
              <Stack direction="row" spacing={1}>
                <Typography sx={{ color: "#fff" }}>Icons</Typography>
                <Typography sx={{ color: theme.palette.background.GF40 }}>
                  1
                </Typography>
              </Stack>
            ),
            value: 0,
          },
        ]}
      >
        {value === 0 && (
          <>
            <RStack direction="row" justifyContent="space-between">
              <Box sx={{ maxWidth: "192px" }}>
                <SearchBox
                  sx={{ width: "100%" }}
                  variant="outlined"
                  size="small"
                  hiddenLabel
                >
                  {/* <InputLabel htmlFor="outlined-adornment-password">
                    Search
                  </InputLabel> */}
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type="search"
                    size="small"
                    placeholder="Search..."
                    sx={{ m: 0 }}
                    endAdornment={
                      <InputAdornment position="end">
                        <Search />
                      </InputAdornment>
                    }
                    // label="Search"
                  />
                </SearchBox>
              </Box>
              <Button
                variant="contained"
                onClick={() => setOpen(true)}
                size="small"
              >
                <Add /> New Records
              </Button>
            </RStack>
            <Stack gap={1.25}>
              {icons?.map((icon) => (
                <ProfileCard
                  options={{ draggable: false, switcher: false }}
                  title={icon.title}
                  subTitle={
                    <Stack
                      gap={2}
                      direction="row"
                      alignItems="center"
                      sx={{ height: 24 }}
                    >
                      <Box component={"span"}>{icon.category_name}</Box>{" "}
                      <Box component={"span"}>
                        {icon.tags.map((tag) => (
                          <Chip
                            label={tag}
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                        ))}
                      </Box>
                    </Stack>
                  }
                  AvatarImage={
                    icon.native_ref ? (
                      <GenericIcon iconName={icon.native_ref as IconType} />
                    ) : (
                      <Avatar
                        src={icon.svg}
                        variant="square"
                        sx={{
                          background: "transparent",
                          width: "30px",
                          height: "30px",
                        }}
                      >
                        <Box
                          component="div"
                          dangerouslySetInnerHTML={{ __html: icon.svg }}
                          sx={{
                            width: "30px",
                            height: "30px",
                            "> svg": {
                              maxWidth: "100%",
                              maxHeight: "100%",
                            },
                          }}
                        ></Box>
                      </Avatar>
                    )
                  }
                  rightIcon={
                    <Stack gap={2} direction="row">
                      {/* <SettingsOutlined
                        sx={{
                          color: "success.dark",
                          width: "16px",
                          height: "auto",
                        }}
                      /> */}
                      <DeleteOutline
                        sx={{
                          width: "16px",
                          height: "auto",
                        }}
                        onClick={() => {
                          deleteMutation.mutate({
                            iconType: icon.icon_type || icon.id.split(":")[0],
                            slug: icon.slug,
                          });
                        }}
                      />
                    </Stack>
                  }
                />
              ))}
              {/* 
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                sx={{ borderColor: theme.palette.background.GF10 }}
                size="large"
              >
                View more
              </Button> */}
              <IconPicker
                icons={icons}
                onChange={(iconSlug) => console.log({ iconSlug })}
              />
            </Stack>
          </>
        )}
      </InnerPageLayout>
      <AddIconModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={() => setOpen(false)}
      />
    </Box>
  );
};

export default Icons;
