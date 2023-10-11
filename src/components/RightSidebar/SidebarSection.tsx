import PlaylistAdd from "@mui/icons-material/PlaylistAdd";
import { Box, styled } from "@mui/material";
import AddButton from "assets/icons/AddButton";
import React, { PropsWithChildren } from "react";
import GFHeaderWithIcons from "stories/CompoundComponent/Header/Header/Header";

const SideBarBox = styled(Box)(({ theme }) => {
  return {};
});

const SidebarSection: React.FC<
  PropsWithChildren<{
    title?: string;
    rightIcon?: false | React.ReactElement;
    leftIcon?: false | React.ReactElement;
    onRightIconClick?(): void;
    onLeftIconClick?(): void;
    className?: string;
  }>
> = (props) => {
  const {
    title,
    children,
    rightIcon,
    onRightIconClick,
    leftIcon,
    onLeftIconClick,
    className,
  } = props;

  const rightIconComponent = React.useMemo(() => {
    if (rightIcon === false) {
      return <></>;
    }

    return (
      <Box sx={{ lineHeight: 0 }} onClick={onRightIconClick}>
        {rightIcon || <AddButton />}
      </Box>
    );
  }, [rightIcon, onRightIconClick]);

  const leftIconComponent = React.useMemo(() => {
    if (leftIcon === false) {
      return <></>;
    }

    return (
      <Box sx={{ lineHeight: 0 }} onClick={onLeftIconClick}>
        {leftIcon || <PlaylistAdd />}
      </Box>
    );
  }, [leftIcon, onLeftIconClick]);

  return (
    <SideBarBox className={className}>
      <GFHeaderWithIcons
        leftIcon={leftIconComponent}
        title={title}
        rightIcon={rightIconComponent}
      />
      {children}
    </SideBarBox>
  );
};

export default SidebarSection;
