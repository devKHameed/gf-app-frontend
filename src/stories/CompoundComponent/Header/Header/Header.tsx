import {
  Box,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import * as React from "react";
import { ListBox } from "./Header.styled";
interface Props {
  rightIcon?: React.ReactElement;
  leftIcon?: React.ReactElement;
  title?: string;
  subtitle?: string;
}

const GFHeaderWithIcons: React.FC<Props> = (props) => {
  const { rightIcon, leftIcon, title, subtitle } = props;

  return (
    <ListBox>
      <List sx={{ p: "0" }}>
        <ListItem
          sx={{ p: "20px 0 18px" }}
          secondaryAction={
            rightIcon && (
              <IconButton
                disableRipple
                edge="end"
                aria-label="delete"
                sx={{ color: "grey.500", p: "0" }}
              >
                {rightIcon}
              </IconButton>
            )
          }
        >
          <Stack direction={"row"} alignItems="center" spacing={0.75}>
            {leftIcon && <>{leftIcon}</>}
            <Box>
              {title && (
                <Typography variant="subtitle1" component="div">
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="400"
                  component="div"
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>
        </ListItem>
      </List>
    </ListBox>
  );
};
export default GFHeaderWithIcons;
