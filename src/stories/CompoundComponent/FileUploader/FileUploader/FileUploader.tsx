import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Button,
  Card,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { RcBox } from "./FileUploader.style";
import UploadedItems from "./UploadedItems";
interface Props {
  title?: string;
}
const FileUploader: React.FC<Props> = (props) => {
  const { title = "File upload" } = props;
  const theme = useTheme();
  return (
    <Card
      sx={{
        background: theme.palette.background.GFRightNavBackground,
        padding: "20px",
      }}
    >
      <Stack direction={"column"} spacing={2}>
        <Typography component="div" variant="subtitle1">
          {title}
        </Typography>
        <RcBox mb={1}>
          <Stack
            p={3}
            borderRadius="4px"
            direction="column"
            alignItems={"center"}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <IconButton
              color="inherit"
              aria-label="upload picture"
              component="label"
              disableRipple
              sx={{
                background: theme.palette.primary.shades?.["50p"],
                mb: 1,
              }}
            >
              <UploadFileIcon />
            </IconButton>

            <Typography component="div" variant="subtitle1" mb={1}>
              <Link href="#">Click up upload</Link> or drag and drop
            </Typography>
            <Typography
              component="div"
              variant="body2"
              color={"text.secondary"}
            >
              SVG,PNG,JPG or GIF (max. 3MB)
            </Typography>
          </Stack>
        </RcBox>
        <UploadedItems />
        <Stack
          direction={"row"}
          alignContent="center"
          alignItems={"center"}
          justifyContent="center"
          spacing={2}
        >
          <Button variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button variant="contained">Save Changes</Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default FileUploader;
