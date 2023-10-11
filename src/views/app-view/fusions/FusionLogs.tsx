import { Box, MenuItem, Select, Stack } from "@mui/material";
import FormField from "components/FormField";
import { ApiModels } from "queries/apiModelMapping";
import useFusionSessions from "queries/fusion/useFusionSessions";
import useListItems from "queries/useListItems";
import { useState } from "react";

const FusionLogs: React.FC = () => {
  const [selectedFusion, setSelectedFusion] = useState<string>("");

  const { data: fusions } = useListItems({
    modelName: ApiModels.Fusion,
  });
  const { data: fusionSessions } = useFusionSessions(selectedFusion);

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-evenly">
        <FormField label="Fusion">
          <Select
            size="small"
            variant="filled"
            placeholder="Fusion"
            fullWidth
            value={selectedFusion}
            onChange={(e) => setSelectedFusion(e.target.value)}
          >
            {fusions?.map((fusion) => (
              <MenuItem key={fusion.fusion_slug} value={fusion.fusion_slug}>
                {fusion.fusion_title}
              </MenuItem>
            ))}
          </Select>
        </FormField>
        <FormField label="Session">
          <Select size="small" variant="filled" fullWidth>
            {fusionSessions?.map((session) => (
              <MenuItem key={session.slug} value={session.slug}>
                {session.created_at}
              </MenuItem>
            ))}
          </Select>
        </FormField>
      </Stack>
    </Box>
  );
};

export default FusionLogs;
