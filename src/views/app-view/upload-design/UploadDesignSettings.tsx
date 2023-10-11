import { Box, Button, Card, Stack, Typography } from "@mui/material";
import useAccountSlug from "hooks/useAccountSlug";
import { ApiModels } from "queries/apiModelMapping";
import useDeleteItem from "queries/useDeleteItem";
import useGetItem from "queries/useGetItem";
import React from "react";
import { Link, useParams } from "react-router-dom";

type UploadDesignSettingsProps = {};

const UploadDesignSettings: React.FC<UploadDesignSettingsProps> = (props) => {
  const { slug } = useParams<{ slug: string }>();
  const accountSlug = useAccountSlug();

  const { data: uploadDesign } = useGetItem({
    modelName: ApiModels.UploadDesign,
    slug,
  });

  const { mutate: deleteDesign } = useDeleteItem({
    modelName: ApiModels.UploadDesign,
  });

  const handleDeleteDesign = () => {
    if (slug) {
      deleteDesign({ slug });
    }
  };

  return uploadDesign ? (
    <Box sx={{ padding: 2.5 }}>
      <Card
        sx={{
          padding: 2.5,
          background: "#2F2F36",
        }}
      >
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle1">Upload Settings</Typography>
          <Typography variant="body2">Name: {uploadDesign?.title}</Typography>
          <Typography variant="body2">Type: {uploadDesign?.type}</Typography>
          <Typography variant="body2">
            Sample File:{" "}
            <Link to={uploadDesign?.sample_file?.url || ""}>
              {uploadDesign?.sample_file?.name}
            </Link>
          </Typography>
          <Typography variant="body2">
            Is Active: {!!uploadDesign?.is_active}
          </Typography>
          <Link
            to={`/${accountSlug}/fusion/flow-designer/${uploadDesign?.fusion_slug}`}
            style={{ color: "#fff" }}
          >
            <Button variant="outlined" fullWidth>
              Edit Upload Fusion
            </Button>
          </Link>
          <Button variant="outlined" fullWidth onClick={handleDeleteDesign}>
            Delete Upload Design
          </Button>
        </Stack>
      </Card>
    </Box>
  ) : null;
};

export default UploadDesignSettings;
