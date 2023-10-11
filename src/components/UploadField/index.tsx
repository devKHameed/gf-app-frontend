import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { upload } from "api/upload";
import { S3_CLOUD_FRONT_URL } from "configs/AppConfig";
import React, { useState } from "react";
import { useStore } from "store";
import { v4 } from "uuid";

type Props = {
  accept?: string;
  onChange?(url: string, file?: File): void;
} & TextFieldProps;

const UploadField: React.FC<Props> = (props) => {
  const { accept = "image/*", onChange, ...fieldProps } = props;

  const selectedAccount = useStore((state) => state.selectedAccount);
  const accountId = selectedAccount?.slug;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const handleInputChange = (value: string) => {
    onChange?.(value);
  };

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
          inputRef.current.value = url;
        }
        onChange?.(url, file);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <TextField
      id="outlined-adornment-password"
      type="text"
      variant="outlined"
      fullWidth
      inputRef={inputRef}
      disabled={uploading}
      onChange={(e) => handleInputChange(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton disabled={uploading} edge="end" component="label">
              <input
                onChange={(e) => handleFileChange(e.target.files)}
                hidden
                accept={accept}
                type="file"
              />
              {uploading ? <CircularProgress /> : <FileUploadIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...fieldProps}
    />
  );
};

export default UploadField;
