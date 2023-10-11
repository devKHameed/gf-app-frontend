import {
  Box,
  Button,
  ButtonProps,
  Grid,
  Typography,
  styled,
} from "@mui/material";
import { Builder } from "assets/icons";

const WidgetTitlte = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  lineHeight: "24px",
  margin: "0 0 28px",
  fontWeight: "600",
}));

const CardBox = styled(Box)(({ theme }) => ({
  background: theme.palette.background.GFRightNavBackground,
  padding: "22px 35px",
  borderRadius: "8px",
  height: "100%",
  position: "relative",
  overflow: "hidden",
}));

const BoxTitle = styled(Typography)(({ theme }) => ({
  fontSize: "22px",
  lineHeight: "40px",
  fontWeight: "600",
  margin: "0 0 8px",
}));

const Description = styled(Box)(({ theme }) => ({
  fontSize: "15px",
  lineHeight: "22px",
  color: theme.palette.text.primary,
  opacity: "0.6",
  margin: "0 0 22px",
}));

const CardFooter = styled(Box)(({ theme }) => ({
  margin: "17px -35px 0",
  padding: "25px 32px 3px",
  textAlign: "right",
  borderTop: `1px solid ${theme.palette.background.CardsCustomBG}`,
}));

const CustomWidgetText = styled(Box)(({ theme }) => ({
  padding: "18px",
  textAlign: "center",
  borderRadius: "6px",
  fontSize: "18px",
  lineHeight: "22px",
  fontWeight: "600",
  margin: "0 0 34px",
  background: theme.palette.background.CardsCustomBG,
}));

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  fontSize: "15px",
  lineHeight: "22px",
  borderRadius: "4px",
  color: "#000",
  fontWeight: "600",
  padding: "9px 13px",
  background: "#FBC400",
  boxShadow: "none",
  height: "42px",

  "&:hover": {
    background: "#FBC400",
    color: "#000",
  },
}));

const OutlinedButton = styled(Button)<ButtonProps>(({ theme }) => ({
  border: `1px solid ${theme.palette.blue.GFDarkBlue}`,
  color: "#36C5F0",
  fontSize: "15px",
  lineHeight: "22px",
  background: theme.palette.background.GF36,
  height: "42px",

  "&:hover": {
    border: `1px solid ${theme.palette.blue.GFDarkBlue}`,
    color: "#36C5F0",
  },
}));

const FusionBox = styled(Box)(({ theme }) => ({
  background: theme.palette.background.CardsCustomBG,
  borderRadius: "6px",
  height: "100%",
  textAlign: "center",
  padding: "14px 10px 23px",
  fontSize: "14px",
  lineHeight: "18px",
  fontWeight: "600",
}));

const FusionTitle = styled(Box)(({ theme }) => ({
  margin: "0 0 20px",
}));

const FusionImage = styled(Box)(({ theme }) => ({
  img: {
    margin: "0 auto",
  },
}));

const DocumentImage = styled(Box)(({ theme }) => ({
  width: "80px",
  margin: "0 0 0 -10px",

  img: {
    width: "100%",
    height: "auto",
    display: "block",
  },
}));

const DeveloperSettings = () => {
  return (
    <Box className="settings-widget">
      <WidgetTitlte variant="subtitle1" className="widget-title">
        For Developers
      </WidgetTitlte>
      <Grid container spacing="30px">
        <Grid item xs={12} sm={4}>
          <CardBox className="cardBox">
            <BoxTitle variant="subtitle1" className="box-title">
              Developer Documentation
            </BoxTitle>
            <Description className="description">
              View our API documentation to build your own integration into our
              platform.
            </Description>
            <DocumentImage className="document">
              <img src="/assets/images/documentation.svg" alt="documentation" />
            </DocumentImage>
            <CardFooter>
              <ColorButton variant="contained">Manage Users</ColorButton>
            </CardFooter>
          </CardBox>
        </Grid>
        <Grid item xs={12} sm={4}>
          <CardBox className="cardBox">
            <BoxTitle variant="subtitle1" className="box-title">
              Custom Fusions
            </BoxTitle>
            <Description className="description">
              Create custom fusions for your own flows, or to make them
              available for other Guifusion users.
            </Description>
            <Grid container spacing="20px">
              <Grid item xs={12} sm={4}>
                <FusionBox className="fusion-box">
                  <FusionTitle className="fusion-title">Docs</FusionTitle>
                  <FusionImage className="fusion-image">
                    <img src="/assets/images/docs.svg" alt="docs" />
                  </FusionImage>
                </FusionBox>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FusionBox className="fusion-box">
                  <FusionTitle className="fusion-title">
                    View Builder
                  </FusionTitle>
                  <FusionImage className="fusion-image">
                    <img
                      src="/assets/images/edit_document.svg"
                      alt="edit document"
                    />
                  </FusionImage>
                </FusionBox>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FusionBox className="fusion-box">
                  <FusionTitle className="fusion-title">
                    Sample Code
                  </FusionTitle>
                  <FusionImage className="fusion-image">
                    <img
                      src="/assets/images/code_blocks.svg"
                      alt="edit document"
                    />
                  </FusionImage>
                </FusionBox>
              </Grid>
            </Grid>
          </CardBox>
        </Grid>
        <Grid item xs={12} sm={4}>
          <CardBox className="cardBox">
            <BoxTitle variant="subtitle1" className="box-title">
              Custom Widgets
            </BoxTitle>
            <Description className="description">
              Create custom widgets for your own dashboards, or to make them
              available for other Guifusion users.
            </Description>
            <CustomWidgetText>0 Custom Widgets</CustomWidgetText>
            <CardFooter>
              <OutlinedButton variant="outlined" endIcon={<Builder />}>
                Go to Builder
              </OutlinedButton>
            </CardFooter>
          </CardBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeveloperSettings;
