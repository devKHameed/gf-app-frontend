import { IconButton } from "@mui/material";
import React, { FC } from "react";
import AddIcon from "@mui/icons-material/Add";
import { RcStack } from "./IconVariant.style";
import CreateIcon from "@mui/icons-material/Create";
import {useTheme} from '@mui/material/styles';
interface IIconVariant {}

const IconVariant: FC<IIconVariant> = (props) => {
  const theme = useTheme();
  const {} = props;
  return (
    <RcStack width="100px" height="100px" position='relative'>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{
          p: '0', width: '100%', height: '100%', background: theme.palette.primary.shades?.["12p"], color: "primary.main", fontSize: '36px',
          "&:hover": {
            background: theme.palette.primary.shades?.["8p"]
          }
        }}
      >
        <AddIcon sx={{width: '36px', height: '36px'}}/>
      </IconButton>
      <CreateIcon sx={{width: '24px', height: '24px', color: 'primary.main', position: 'absolute', right: '-0', bottom: '-4px'}}/>
    </RcStack>
  );
};

export default IconVariant;
