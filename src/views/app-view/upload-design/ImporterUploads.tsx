import { AddCircle, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import {
  QueryFunctionContext,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { TableContainerWrap, TableSecondary } from "components/DataTable";
import Scrollbar from "components/Scrollbar";
import Spin from "components/Spin";
import FileUploader from "components/Uploader";
import useAccountSlug from "hooks/useAccountSlug";
import useSocket from "hooks/useSocket";
import { InnerBoxWrap, SectionHeader } from "layouts/inner-app-layout";
import { capitalize } from "lodash";
import UploadDesignModel from "models/UploadDesign";
import moment from "moment";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import React, { useEffect, useState } from "react";
import { Accept } from "react-dropzone";
import { useParams } from "react-router-dom";

const ImportTable = styled(TableSecondary)({
  borderSpacing: "0 10px",
  borderCollapse: "separate",

  ".MuiTableBody-root .MuiTableRow-root .MuiTableCell-root:first-child": {
    borderRadius: "8px 0 0 8px !important",
  },

  ".MuiTableBody-root .MuiTableRow-root .MuiTableCell-root:last-child": {
    borderRadius: "0 8px 8px 0 !important",
  },
});

export const getAcceptedFileTypes = (type: UploadDesign["type"]): Accept => {
  switch (type) {
    case "audio":
      return { "audio/*": [] };
    case "csv":
      return { "text/*": [".csv"] };
    case "image":
      return { "image/*": [] };
    case "video":
      return { "video/*": [] };
    case "word_doc":
      return { "application/*": [".docx", ".doc"] };
  }
};

type TimeLapseCounterProps = {
  createdAt: string | null;
  status: string;
};

const TimeLapseCounter: React.FC<TimeLapseCounterProps> = (props) => {
  const { createdAt, status } = props;

  const [timeElapsed, setTimeElapsed] = useState("00:00:00");

  useEffect(() => {
    if (status !== "Complete" && status !== "Failed") {
      const interval = setInterval(() => {
        const duration = moment.duration(moment().diff(moment(createdAt)));
        const hours = Math.floor(duration.asHours())
          .toString()
          .padStart(2, "0");
        const minutes = moment.utc(duration.asMilliseconds()).format("mm");
        const seconds = moment.utc(duration.asMilliseconds()).format("ss");
        setTimeElapsed(`${hours}:${minutes}:${seconds}`);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      const duration = moment.duration(moment().diff(moment(createdAt)));
      const hours = Math.floor(duration.asHours()).toString().padStart(2, "0");
      const minutes = moment.utc(duration.asMilliseconds()).format("mm");
      const seconds = moment.utc(duration.asMilliseconds()).format("ss");
      setTimeElapsed(`${hours}:${minutes}:${seconds}`);
    }
  }, [status, createdAt]);

  return <Box>{timeElapsed} Elapsed</Box>;
};

type ImportRecordRowProps = {
  value: UploadDesignImport;
};

const ImportRecordRow: React.FC<ImportRecordRowProps> = (props) => {
  const { value } = props;
  const accountId = useAccountSlug();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onUnprocessedRecordsClick = () => {
    const url = value.error_file_url;
    const chunks = url.split("/");
    const name = chunks.pop() as string;
    const errorUrl = [...chunks, "unprocessed-data", name].join("/");

    const link = document.createElement("a");
    link.href = errorUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell sx={{}}>{capitalize(value.status)}</TableCell>
      {/* <TableCell>{moment(value.created_at).fromNow()} Elapsed</TableCell> */}
      <TableCell>
        <TimeLapseCounter createdAt={value.created_at} status={value.status} />
      </TableCell>
      <TableCell>
        {moment(value.created_at).format("MM/DD/YYYY HH:mm A")}
      </TableCell>
      <TableCell>
        {value.processed_records} of {value.records_count} Processed
      </TableCell>
      <TableCell>
        <Avatar
          variant="circular"
          sx={{ width: "26px", height: "26px" }}
          src="https://d25zknbdn963oa.cloudfront.net/master-account/uploads/free-coin-icon-794-thumb-62731cbb-8071-4fb3-8766-c3e2b42a7d29.png"
        />
      </TableCell>
      <TableCell
        align="right"
        sx={{
          position: "sticky",
          right: 0,
          // background: theme.palette.background.default,
        }}
      >
        <IconButton
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="edit-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => onUnprocessedRecordsClick()}>
            Unprocessed Records
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

type ImporterUploadsProps = {};

const getImports = async (ctx: QueryFunctionContext) => {
  const [_, slug] = ctx.queryKey;
  const res = await UploadDesignModel.listImport(`${slug}`);
  return res.data;
};

const ImporterUploads: React.FC<ImporterUploadsProps> = () => {
  const { slug } = useParams<{ slug: string }>();

  const { subscribe, unsubscribe } = useSocket();
  const queryClient = useQueryClient();

  const [importFiles, setImportFiles] = useState<FileMeta[]>([]);
  const [importing, setImporting] = useState(false);

  // const [imports, setImports] = useState<UploadDesignImport[]>([]);

  const { data: uploadDesign } = useGetItem({
    modelName: ApiModels.UploadDesign,
    slug,
  });

  const { data: imports } = useQuery({
    queryKey: [ApiModels.UploadDesign, slug, "import"],
    queryFn: getImports,
    enabled: !!slug,
  });

  // useEffect(() => {
  //   if (importsData) {
  //     setImports(importsData);
  //   }
  // }, [importsData]);

  useEffect(() => {
    if (slug) {
      subscribe("import-data", slug, (data) => {
        const updatedImport = data.data as UploadDesignImport;

        if (updatedImport) {
          queryClient.setQueryData<UploadDesignImport[]>(
            [ApiModels.UploadDesign, slug, "import"],
            (prev) => {
              return (
                prev?.map((v) =>
                  v.slug === updatedImport.slug && v.status !== "Complete"
                    ? { ...v, ...updatedImport }
                    : v
                ) || []
              );
            }
          );
        }
      });

      return () => {
        unsubscribe("import-data", slug);
      };
    }
  }, []);

  const handleUploadImport = (files: FileMeta[]) => {
    setImportFiles(files);
  };

  const handleImport = () => {
    if (
      slug &&
      importFiles.length > 0 &&
      importFiles.every((f) => f.name && f.url && f.type)
    ) {
      setImporting(true);
      UploadDesignModel.createImport(
        slug,
        importFiles.map((f) => ({
          filename: f.name!,
          file_url: f.url!,
          type: f.type!,
        }))
      )
        .then((res) => {
          setImportFiles([]);
          const importItem = res.data;
          queryClient.setQueryData<UploadDesignImport[]>(
            [ApiModels.UploadDesign, slug, "import"],
            (prev) => {
              return [...(prev || []), importItem];
            }
          );
        })
        .finally(() => {
          setImporting(false);
        });
    }
  };

  return uploadDesign ? (
    <Scrollbar>
      <InnerBoxWrap>
        <SectionHeader
          title={uploadDesign?.title}
          subtitle={
            <Typography variant="body1" color="text.secondary">
              File Type:{" "}
              <Typography
                component="span"
                variant="subtitle1"
                color="text.primary"
              >
                <>{uploadDesign?.type}</>
              </Typography>
            </Typography>
          }
        />
        <Stack alignItems="flex-end" spacing={2}>
          <FileUploader
            onChange={handleUploadImport}
            files={importFiles}
            accept={getAcceptedFileTypes(uploadDesign.type)}
            multiple
            extra={{
              description: ".jpg, .png, .csv, .doc, or .docx",
            }}
            sxProps={{
              width: "100% !important",
              maxWidth: "100% !important",
              margin: "0 !important",
              background: "rgba(0, 0, 0, 0.12)",
            }}
            uploadPathPrefix="imports"
          />
          {importFiles.length > 0 && (
            <>
              <Spin
                spinning={importing}
                iconProps={{
                  sx: {
                    width: "24px !important",
                    height: "24px !important",
                    color: "#fff",
                  },
                }}
              >
                <Button variant="contained" onClick={handleImport}>
                  Continue Import
                </Button>
              </Spin>
              <Divider sx={{ width: "100%" }} />
            </>
          )}
        </Stack>
        <TableContainerWrap sx={{ mt: 4 }} className="table-holder">
          <ImportTable>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Select value="all" variant="filled" size="small">
                    <MenuItem key="all" value="all">
                      All Uploads
                    </MenuItem>
                  </Select>
                </TableCell>
                <TableCell>4 Uploads</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell>Processed Records</TableCell>
                <TableCell>Uploaded By</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    position: "sticky",
                    right: 0,
                    // background: theme.palette.background.default,
                  }}
                >
                  <IconButton>
                    <AddCircle />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ mt: 4 }}>
              {imports?.map((i) => (
                <ImportRecordRow value={i} />
              ))}
            </TableBody>
          </ImportTable>
        </TableContainerWrap>
      </InnerBoxWrap>
    </Scrollbar>
  ) : null;
};

export default ImporterUploads;
