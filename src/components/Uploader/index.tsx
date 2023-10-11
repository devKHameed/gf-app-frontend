import {
  ArrowDropDown,
  ArrowDropUp,
  DescriptionOutlined,
  ImageOutlined,
  InsertDriveFileOutlined,
  VideoFileOutlined,
} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Card,
  IconButton,
  Stack,
  SxProps,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { upload } from "api/upload";
import { Upload } from "assets/icons";
import accept from "attr-accept";
import axios, { AxiosProgressEvent, CancelTokenSource } from "axios";
import { S3_CLOUD_FRONT_URL } from "configs/AppConfig";
import { AnimatePresence, motion } from "framer-motion";
import { useSnackbar } from "notistack";
import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DropzoneOptions, FileRejection, useDropzone } from "react-dropzone";
import { useStore } from "store";
import { v4 } from "uuid";
import { RcBox } from "./FileUploader.style";
import UploadedItems, { UploadedItemsProps } from "./UploadedItems";
const CancelTokens = new Map<string, CancelTokenSource>();

type FileUploaderProps = {
  title?: string;
  extra?: {
    icon?: React.ReactElement | ReactNode;
    subtitle?: string | ReactElement;
    description?: string | ReactElement;
  };
  sxProps?: SxProps;
  uploadPathPrefix?: string;
} & DropzoneOptions &
  (
    | {
        single: true;
        files?: FileMeta;
        onChange?: (_: FileMeta) => void;
      }
    | { single?: false; files?: FileMeta[]; onChange?: (_: FileMeta[]) => void }
  );

const FileUploaderWrap = styled(Card)(({ theme }) => ({}));

const ViewButton = styled(LoadingButton)(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.background.GF60,
  height: "40px",
  borderColor: theme.palette.action.selected,

  "&:hover": {
    color: theme.palette.background.GF80,
    borderColor: theme.palette.background.GF60,
    background: "none",
  },

  ".MuiButton-startIcon": {
    marginRight: "6px",
    width: "24px",

    svg: {
      width: "100%",
      height: "auto",
    },
  },
}));

const pageSize = 5;
const FileUploader: React.FC<React.PropsWithChildren<FileUploaderProps>> = ({
  title = "",
  files,
  onChange: handleChange,
  children,
  extra = {},
  single,
  sxProps = {},
  uploadPathPrefix,
  ...rest
}) => {
  const theme = useTheme();
  const selectedAccount = useStore((state) => state.selectedAccount);
  const accountId = selectedAccount?.slug;
  const [uploadedFiles, setUploadedFiles] = useState<FileMeta[]>(
    single ? (files ? [files] : []) : files || []
  );
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const filesRef = useRef(uploadedFiles);

  useEffect(() => {
    if (files) setUploadedFiles(single ? (files ? [files] : []) : files || []);
  }, [files, single]);

  useEffect(() => {
    filesRef.current = uploadedFiles;
  }, [filesRef, uploadedFiles]);

  const onChange = (files: FileMeta[]) => {
    if (single) {
      handleChange?.(files[0]);
    } else {
      handleChange?.(files);
    }
  };
  const beforeStart = useCallback((file: File, options: FileMeta) => {
    setUploadedFiles((files) => [
      {
        name: file.name,
        type: file.type,
        status: "start",
        ...options,
        originalFile: file,
        size: file.size,
      },
      ...files,
    ]);
  }, []);

  const handleProgress = (
    progressEvent: AxiosProgressEvent,
    file: FileMeta
  ) => {
    file.uploadingProgress = Math.floor(
      (progressEvent.loaded * 100) / (progressEvent?.total || 1)
    );
    file.status = "uploading";

    setUploadedFiles((files) =>
      files.map((f) => (f.id !== file.id ? f : { ...f, ...file }))
    );
  };
  const onComplete = (file: FileMeta) => {
    file.uploadingProgress = 100;
    file.status = "completed";

    setUploadedFiles((files) =>
      files.map((f) => (f.id !== file.id ? f : { ...f, ...file }))
    );

    const newFiles = filesRef.current.map((f) =>
      f.id !== file.id ? f : { ...f, ...file }
    );
    onChange?.(newFiles);
  };
  const onError = (file: FileMeta) => {
    file.uploadingProgress = 0;
    file.status = "error";

    setUploadedFiles((files) =>
      files.map((f) => (f.id !== file.id ? f : { ...f, ...file }))
    );
  };
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        await Promise.all(
          acceptedFiles.map(async (file) => {
            const id = v4();
            const nameChunks = file.name.split(".");
            const extension = nameChunks.pop();
            const name = nameChunks.join(".");
            const key = `${name}-${id}.${extension}`;
            beforeStart(file, { id });

            const cancelToken = axios.CancelToken.source();

            upload(
              {
                file,
                filename: key,
                pathPrefix: uploadPathPrefix || undefined,
              },
              {
                onUploadProgress: (PE) => handleProgress(PE, { id }),
                cancelToken: cancelToken.token,
              }
            )
              .then(() => {
                const url = `${S3_CLOUD_FRONT_URL}/${accountId}/${
                  uploadPathPrefix || "uploads"
                }/${key}`;
                onComplete({ id, url });
              })
              .catch((er) => {
                console.error(er);
                onError({ id });
              });
            CancelTokens.set(id, cancelToken);
          })
        );
      } catch (e) {
        console.error(e);
      }
    },
    [accountId]
  );
  const onDropRejected = useCallback(
    async (acceptedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        file.errors.forEach((error) =>
          enqueueSnackbar(error.message, { variant: "error" })
        );
      });
    },
    [accountId]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...rest,
    onDrop,
    onDropRejected,
  });

  const handleDelete = (id: string) => {
    CancelTokens.get(id)?.cancel();
    setUploadedFiles((files) => files.filter((file) => file.id !== id));

    const newFiles = filesRef.current.filter((file) => file.id !== id);
    onChange?.(newFiles);
  };
  const handleLoadMore = () => {
    setPage(page + 1);
  };
  const handlkeShowLess = () => {
    setPage(1);
  };
  const paginatedItems = useMemo(() => {
    return uploadedFiles.slice(0, page * pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, uploadedFiles]);
  return (
    <FileUploaderWrap
      sx={{
        background: theme.palette.background.GFRightNavBackground,
        padding: "20px",
        ...sxProps,
      }}
    >
      <Stack direction={"column"} spacing={2}>
        {title && (
          <Typography component="div" variant="subtitle1">
            {title}
          </Typography>
        )}
        <Stack spacing={2.5}>
          <RcBox className={`${isDragActive ? "dragging" : ""}`}>
            <Stack
              className="uploader-box"
              // divider={<Divider orientation="vertical" flexItem />}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {children || (
                <React.Fragment>
                  <IconButton
                    color="inherit"
                    aria-label="upload picture"
                    component="label"
                    disableRipple
                    className="btn-holder"
                  >
                    {extra.icon || <Upload />}
                  </IconButton>

                  <Typography
                    component="div"
                    variant="subtitle1"
                    className="heading"
                  >
                    {extra.subtitle || (
                      <React.Fragment>
                        Click to browse or drop here
                      </React.Fragment>
                    )}
                  </Typography>
                  <Typography
                    component="div"
                    variant="body2"
                    className="description-text"
                  >
                    {extra.description || (
                      <React.Fragment>
                        jpg, png, svg or gif{" "}
                        {rest.maxSize ? (
                          <React.Fragment>
                            (max {rest.maxSize / (1024 * 1024)}
                            mb)
                          </React.Fragment>
                        ) : null}
                      </React.Fragment>
                    )}
                  </Typography>
                </React.Fragment>
              )}
            </Stack>
          </RcBox>
          {paginatedItems.length > 0 && (
            <Stack spacing={1.25}>
              <AnimatePresence>
                {paginatedItems.map((file) => {
                  let leftIcon = <InsertDriveFileOutlined />;
                  if (accept({ name: file.name, type: file.type }, "image/*")) {
                    if (file.url) {
                      leftIcon = <img src={file.url} alt="thumbnail" />;
                    } else {
                      leftIcon = <ImageOutlined />;
                    }
                  } else if (
                    accept({ name: file.name, type: file.type }, "video/*")
                  ) {
                    leftIcon = <VideoFileOutlined />;
                  } else if (
                    accept({ name: file.name, type: file.type }, [
                      ".pdf",
                      ".doc",
                      ".docx",
                      ".txt",
                      ".rtf",
                      ".odt",
                      ".wpd",
                      ".ppt",
                      ".pptx",
                      ".xls",
                      ".xlsx",
                      ".csv",
                      ".ods",
                      ".xml",
                      ".html",
                      ".md",
                    ])
                  ) {
                    leftIcon = <DescriptionOutlined />;
                  }

                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      //exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.6,
                        type: "tween",
                        ease: "linear",
                      }}
                      key={file.id}
                    >
                      <UploadedItems
                        key={file.id}
                        id={file.id}
                        name={file.name}
                        leftIcon={leftIcon}
                        size={((file.size || 1000) / 1000)
                          .toString()
                          .concat("KB")}
                        options={{
                          edit: false,
                          progress: file.status === "uploading",
                        }}
                        onDelete={handleDelete}
                        progress={file.uploadingProgress}
                        status={file.status as UploadedItemsProps["status"]}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {paginatedItems.length < uploadedFiles.length && (
                <ViewButton
                  fullWidth
                  variant="outlined"
                  size="large"
                  disableRipple
                  startIcon={<ArrowDropDown />}
                  onClick={handleLoadMore}
                >
                  View more
                </ViewButton>
              )}
              {page > 1 && paginatedItems.length === uploadedFiles.length && (
                <ViewButton
                  fullWidth
                  variant="outlined"
                  size="large"
                  disableRipple
                  startIcon={<ArrowDropUp />}
                  onClick={handlkeShowLess}
                >
                  View Less
                </ViewButton>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </FileUploaderWrap>
  );
};
export default FileUploader;
