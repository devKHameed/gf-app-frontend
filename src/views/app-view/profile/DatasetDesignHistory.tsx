import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import {
  Box,
  Select,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import useListItems from "queries/useListItems";
import { useParams } from "react-router-dom";
import PurchaseToaster from "stories/CompoundComponent/PurchaseToaster/PurchaseToaster";

const SelectStyled = styled(Select)(({ theme }) => ({
  color: theme.palette.blue.LightBlue,

  ".MuiSelect-icon": {
    color: theme.palette.blue.LightBlue,
  },

  "&:before": {
    borderBottom: "none !important",
  },

  "&:after": {
    borderBottom: "none !important",
  },

  "&:hover": {
    ":before": {
      borderBottom: "none !important",
    },

    ":after": {
      borderBottom: "none !important",
    },
  },
}));

const getIcon = (type: string) => {
  switch (type) {
    case "delete":
      return <DeleteOutlined />;
    default:
      return <EditOutlined />;
  }
};

type Props = {};

const DatasetDesignHistory = (props: Props) => {
  const theme = useTheme();
  const slug = useParams<{ slug?: string }>()?.slug || "";

  const { data: designHistory } = useListItems({
    modelName: "universal-event",
    requestOptions: {
      path: "dataset_design",
      query: {
        record_id: slug,
      },
    },
    queryOptions: {
      enabled: !!slug,
    },
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Recent Activities</Typography>
        {/* <SelectStyled
          id="demo-simple-select-standard"
          label="Age"
          variant="standard"
          defaultValue="latest"
        >
          <MenuItem value="latest">latest</MenuItem>
          <MenuItem value="oldest">oldest</MenuItem>
        </SelectStyled> */}
      </Stack>
      <Stack gap={1.25}>
        {designHistory?.map((dh) => (
          <PurchaseToaster
            title={`${
              dh.event_data?.title ||
              dh.event_slug
                ?.split("_")
                .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                .join(" ")
            }`}
            subtitle={`${dh.event_data?.user_id || dh.user_id}`}
            timestamp={dh.created_at}
            icon={getIcon(dh.event_slug)}
            iconSx={{
              background: theme.palette.orange.GFOrange,
              ":hover": {
                background: theme.palette.orange.GFOrange,
              },
              color: "#fff",
            }}
          />
        ))}
        {/* <Button
          fullWidth
          variant="outlined"
          color="inherit"
          sx={{ borderColor: theme.palette.background.GF10 }}
          size="large"
        >
          View more
        </Button> */}
      </Stack>
    </Box>
  );
};

export default DatasetDesignHistory;
