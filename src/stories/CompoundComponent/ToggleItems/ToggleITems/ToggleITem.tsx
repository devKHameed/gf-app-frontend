import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { Stack, Switch, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { ToggleItem } from "./ToggleItem.styled";
interface Props {
  title?: string;
  description?: string;
}

const ToggleItems: React.FC<Props> = (props) => {
  const {
    title = "Developer access",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod.",
  } = props;
  const [value, setValue] = useState(false);
  const theme = useTheme();
  return (
    <ToggleItem
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      bgcolor={theme.palette.background.GFRightNavBackground}
      border="1px solid"
      borderColor={theme.palette.background.GF20}
      borderRadius="6px"
      px={3}
      py={1.25}
      mb={1.25}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Switch
          size="small"
          onChange={(e) => {
            setValue(e.target.checked);
          }}
        />
        <Stack direction="column">
          <Typography
            gutterBottom
            variant="subtitle1"
            component="div"
            mb={0.25}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="body2" color="grey.500" component="span">
        <RemoveRedEyeOutlinedIcon />
      </Typography>
    </ToggleItem>
  );
};

export default ToggleItems;
