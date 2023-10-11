import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import { upload } from "api/upload";
import Spin from "components/Spin";
import { S3_CLOUD_FRONT_URL } from "configs/AppConfig";
import React, { useState } from "react";
import { useStore } from "store";
import { v4 } from "uuid";
import { RcProfileCard } from "./ProfileUploader.style";

type Props = {
  title?: string;
  image?: string;
  actionsButtons?: boolean;
  accept?: string;
  onChange?(url: string, file?: File): void;
};
const ProfileUploader: React.FC<Props> = (props) => {
  const {
    title = "Profile Photo",
    image = "/static/images/avatar/1.jpg",
    actionsButtons = true,
    accept = "image/*",
    onChange,
  } = props;
  const theme = useTheme();

  const selectedAccount = useStore((state) => state.selectedAccount);
  const accountId = selectedAccount?.slug;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    const nameChunks = file.name.split(".");
    const extension = nameChunks.pop();
    const name = nameChunks.join(".");
    const key = `${name}-${v4()}.${extension}`;
    upload({ file, filename: key })
      .then(() => {
        const url = `${S3_CLOUD_FRONT_URL}/${accountId}/uploads/${key}`;
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        onChange?.(url, file);
      })
      .finally(() => {
        setUploading(false);
      });
  };
  const handleClick = () => {
    inputRef?.current?.click();
  };
  return (
    <RcProfileCard
      sx={{
        background: theme.palette.background.GF5,
        borderRadius: "6px",
        "&:hover": {
          background: theme.palette.background.GF10,
        },
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" component="div">
          {title}
        </Typography>
        <Stack alignItems="center">
          <Spin spinning={uploading}>
            <Avatar
              alt="Remy Sharp"
              src={image}
              sx={{ width: "150px", height: "150px", mb: 1.25 }}
            />
          </Spin>
          {actionsButtons && (
            <Stack direction="row" alignItems="center" spacing={1}>
              {/* <IconButton size='small' disableRipple>
                <ImageIcon />
              </IconButton> */}
              <input
                onChange={(e) => handleFileChange(e.target.files)}
                hidden
                accept={accept}
                type="file"
                ref={inputRef}
              />
              <IconButton
                size="small"
                disableRipple
                onClick={handleClick}
                disabled={uploading}
              >
                <CreateOutlinedIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </RcProfileCard>
  );
};

export default ProfileUploader;
