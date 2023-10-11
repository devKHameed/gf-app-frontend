import { Avatar, Box, Button, Stack, Typography, styled } from "@mui/material";
import { ArrowUp, PlayTriangle } from "assets/icons";
import useAppNavigate from "hooks/useAppNavigate";
import { useState } from "react";
import { SystemNavRoutes } from "routes";
import { getRouteColor, getSystemRouteModule } from "utils/getColorPresets";

const SettingWidget = styled(Box)(({ theme }) => ({
  margin: "0 0 36px",
}));

const WidgetTitlte = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  lineHeight: "24px",
  margin: "0 0 30px",
  fontWeight: "600",
}));

const CardBox = styled(Box)(({ theme }) => ({
  background: theme.palette.background.GFRightNavBackground,
  padding: "19px 30px 43px",
  borderRadius: "8px",
}));

const CardHead = styled(Stack)(({ theme }) => ({
  margin: "0 0 23px",
}));

const BoxTitle = styled(Typography)(({ theme }) => ({
  fontSize: "22px",
  lineHeight: "40px",
  fontWeight: "600",
}));

const Video = styled(Box)(({ theme }) => ({
  color: theme.palette.text.secondary,
  cursor: "pointer",
  transition: "all 0.4s ease",

  "&:hover": {
    color: theme.palette.text.primary,
  },

  svg: {
    color: theme.palette.text.primary,
    width: "13px",
    height: "auto",
    margin: "4px 10px 0 0",
    display: "inline-block",
    verticalAlign: "top",

    path: {
      fill: "none",
    },
  },
}));

const ItemsBlock = styled(Stack)(({ theme }) => ({
  // gap: "30px",
}));

const ButtonWrap = styled(Button)(({ theme }) => ({
  margin: "0 -30px",
  padding: "15px 30px",
  height: "auto",
  textAlign: "left",
  color: theme.palette.text.primary,

  "&:hover": {
    ".MuiAvatar-root": {
      borderColor: theme.palette.text.primary,
    },

    ".arrow": {
      opacity: "1",
    },
  },
}));

const ItemHolder = styled(Stack)(({ theme }) => ({
  cursor: "pointer",
  width: "100%",

  ".MuiAvatar-root": {
    border: "1px solid transparent",
    transition: "all 0.4s ease",
  },
}));

const DetailArea = styled(Stack)(({ theme }) => ({
  gap: "12px",
}));

const DetailBox = styled(Box)(({ theme }) => ({}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: "400",
  margin: "0 0 -4px",
}));

const Description = styled(Box)(({ theme }) => ({
  fontSize: "14px",
  lineHeight: "18px",
  color: theme.palette.text.primary,
  opacity: "0.6",
}));

const Arrow = styled(Box)(({ theme }) => ({
  width: "10px",
  height: "auto",
  cursor: "pointer",
  color: theme.palette.text.primary,
  opacity: "0.6",
  transition: "all 0.4s ease",

  svg: {
    width: "100%",
    height: "auto",

    path: {
      fill: "none",
    },
  },
}));

type NavItemProps = {
  route: typeof SystemNavRoutes[number];
};

const NavItem: React.FC<NavItemProps> = (props) => {
  const { route } = props;

  const appNavigate = useAppNavigate();

  const [raised, setRaised] = useState(false);

  const routeModule = getSystemRouteModule(route.path);
  const color = getRouteColor(routeModule).toRgbString();

  return (
    <ButtonWrap variant="text">
      <ItemHolder
        key={route.path}
        className="item-holder"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => appNavigate(`${route.path}`)}
      >
        <DetailArea
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="detail-area"
        >
          <Avatar
            sx={{
              background: color,
              color: "#fff",
              ".MuiSvgIcon-root": {
                width: 18,
                height: 18,
              },
            }}
            alt={route.name}
          >
            {route.icon || ""}
          </Avatar>
          <DetailBox className="detail">
            <Title variant="subtitle1" className="title">
              {route.name}
            </Title>
            <Description className="description">
              {route.description}
            </Description>
          </DetailBox>
        </DetailArea>
        <Arrow className="arrow">
          <ArrowUp />
        </Arrow>
      </ItemHolder>
    </ButtonWrap>
  );
};

const ManagementSettings = () => {
  return (
    <SettingWidget className="settings-widget">
      <WidgetTitlte variant="subtitle1" className="widget-title">
        Management Settings{" "}
      </WidgetTitlte>
      <CardBox className="cardBox">
        <CardHead
          className="card-head"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <BoxTitle variant="subtitle1" className="box-title">
            Manage Your Settings
          </BoxTitle>
          <Video className="video-link">
            <PlayTriangle />
            Watch Tutorials
          </Video>
        </CardHead>
        <ItemsBlock>
          {SystemNavRoutes.map((route) => {
            return <NavItem route={route} />;
          })}
        </ItemsBlock>
      </CardBox>
    </SettingWidget>
  );
};

export default ManagementSettings;
