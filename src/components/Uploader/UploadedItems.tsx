import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import DeleteOutline from "assets/icons/DeleteOutline";
import React from "react";
import { LinearProgressWrap, RcStack } from "./FileUploader.style";

interface Props {
  id: string;
  size?: string;
  name?: string;
  leftIcon?: React.ReactElement | React.ReactNode;
  options?: { edit?: boolean; delete?: boolean; progress?: boolean };
  onDelete?: (id: string) => void;
  progress?: number;
  status?: "complete" | "error" | "uploading";
}
export type UploadedItemsProps = Props;

const UploadedItems: React.FC<Props> = (props) => {
  const {
    id,
    size = "100KB",
    name = "document_file_name.pdf",
    leftIcon = <ImageIcon />,
    options,
    onDelete,
    progress,
    status,
  } = props;
  const {
    edit = true,
    delete: deleteAlt = true,
    progress: showProgress = false,
  } = options || {};

  const handleDelete = () => {
    onDelete?.(id);
  };
  return (
    <RcStack
      direction="row"
      alignItems="center"
      borderRadius={"4px"}
      py={1.25}
      px={2}
      className={`${status} uploaded-item`}
    >
      <Stack direction="row" alignItems="center" flexGrow={1} flexBasis={0}>
        <Box className="icon-holder">{leftIcon}</Box>
        <Stack className="file-detail">
          <Typography component="div" variant="subtitle1" className="file-name">
            {name}
          </Typography>
          <Typography component="div" variant="body2" className="file-size">
            {size}
          </Typography>
        </Stack>
      </Stack>
      {showProgress ? (
        <IconButton
          aria-label="upload picture"
          component="label"
          disableRipple
          onClick={handleDelete}
        >
          <DeleteOutline />
        </IconButton>
      ) : (
        <Box className="action-btns">
          {deleteAlt && (
            <IconButton
              aria-label="upload picture"
              component="label"
              disableRipple
              onClick={handleDelete}
            >
              <DeleteOutline />
            </IconButton>
          )}
          {edit && (
            <IconButton
              aria-label="upload picture"
              component="label"
              disableRipple
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>
      )}
      {showProgress && (
        <LinearProgressWrap
          variant="determinate"
          value={progress!}
          {...props}
        />
      )}
    </RcStack>
  );
};

export default UploadedItems;
