import { Box, Stack, styled, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

type Props = {};

const StepperParent = styled(Stack)(({ theme }) => {
  return {
    gap: "44px",
    margin: "-8px 0 0",

    ".stepper-item": {
      "&:last-child": {
        ".circle": {
          "&:before": {
            display: "none",
          },
        },
      },
    },
  };
});

const TextBoxWrap = styled(Stack)(({ theme }) => {
  return {
    padding: "0 0 0 30px",
  };
});

const StepperItem = styled(Stack)(({ theme }) => {
  return {
    width: "100%",
    gap: "16px",
    padding: "8px 0",
  };
});

const Circle = styled(Box)(({ theme }) => {
  return {
    width: "30px",
    height: "30px",
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.background.GF7,
    color: theme.palette.background.GF80,
    position: "relative",

    "&:before": {
      position: "absolute",
      left: "50%",
      top: "calc(100% + 8px)",
      background: theme.palette.background.GF20,
      width: "1px",
      height: "44px",
      content: `""`,
    },
  };
});

const TextBox = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    lineHeight: "28px",
    color: theme.palette.text.primary,
  };
});

const Title = styled(Box)(({ theme }) => {
  return {};
});

const DescriptionText = styled(Box)(({ theme }) => {
  return {
    color: theme.palette.background.GF60,
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: "400",
    padding: "0 0 0 4px",
  };
});

const TexBox = styled(Stack)(({ theme }) => {
  return {
    background: theme.palette.background.GFRightNavBackground,
    padding: "6px 20px 22px",
    borderRadius: "8px",
    border: `1px solid ${theme.palette.background.GF20}`,

    "&.active": {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  };
});

const Heading = styled(Box)(({ theme }) => {
  return {
    fontSize: "18px",
    lineHeight: "40px",
    fontWeight: "600",
    margin: "0 0 -2px",

    "&.active": {
      color: theme.palette.primary.main,
    },
  };
});

const HeadingSmall = styled(Box)(({ theme }) => {
  return {
    fontSize: "16px",
    lineHeight: "28px",
    fontWeight: "600",
  };
});

const AppFlowComponent = ({}: Props) => {
  return (
    <Grid container>
      <Grid item xs={12} sm={3}>
        <Stack direction="row">
          <StepperParent className="stepper">
            <StepperItem direction="row" className="stepper-item">
              <Circle className="circle">1</Circle>
              <TextBox>
                <Title>Private</Title>
              </TextBox>
            </StepperItem>
            <StepperItem direction="row" className="stepper-item">
              <Circle className="circle">2</Circle>
              <TextBox>
                <Title>Published </Title>
                <DescriptionText>( approval not requested )</DescriptionText>
              </TextBox>
            </StepperItem>
            <StepperItem direction="row" className="stepper-item">
              <Circle className="circle">3</Circle>
              <TextBox>
                <Title>Published </Title>
                <DescriptionText>( pending approval )</DescriptionText>
              </TextBox>
            </StepperItem>
            <StepperItem direction="row" className="stepper-item">
              <Circle className="circle">4</Circle>
              <TextBox>
                <Title>Approved </Title>
              </TextBox>
            </StepperItem>
          </StepperParent>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={9}>
        <TextBoxWrap gap={2}>
          <TexBox gap={1}>
            <Box>
              <Heading>Private</Heading>
              <Typography variant="body1" color="text.secondary">
                After creating your app, it will be set to private by default.
                In the My Apps section, the private app is visible only to you -
                the author. You can use your private app in a scenario as long
                as you have administration rights or app install permission
                granted for the selected organization. Other members of this
                organization will not be able to use your private app when
                building scenarios until you create at least one scenario using
                this app.
              </Typography>
            </Box>
          </TexBox>
          <TexBox gap={1}>
            <Box>
              <Heading>Published (approval not requested)</Heading>
              <Typography variant="body1" color="text.secondary">
                Once you publish your app, you can use the invitation link to
                share the app with users from any organization. Users who
                receive the shared link need to have administration rights or
                app install permission granted to install the app and use it in
                the scenario builder. If sharing your app via link is sufficient
                for you and you don't want to have your app publicly available
                for all users, you do not need to go through the further
                publishing stages.
              </Typography>
            </Box>
          </TexBox>
          <TexBox gap={1}>
            <Box>
              <Heading>Published (approval not requested)</Heading>
              <Typography variant="body1" color="text.secondary">
                Once you publish your app, you can use the invitation link to
                share the app with users from any organization. Users who
                receive the shared link need to have administration rights or
                app install permission granted to install the app and use it in
                the scenario builder. If sharing your app via link is sufficient
                for you and you don't want to have your app publicly available
                for all users, you do not need to go through the further
                publishing stages. publishing stages.
              </Typography>
            </Box>
            <Box>
              <HeadingSmall>Review request received</HeadingSmall>
              <Typography variant="body1" color="text.secondary">
                The review request was received and a member of our review team
                will be assigned to it as soon as possible. Any significant
                changes made to the code at this point may slow down the review
                process.
              </Typography>
            </Box>
            <Box>
              <HeadingSmall>Review in progress</HeadingSmall>
              <Typography variant="body1" color="text.secondary">
                A member of our review team has been assigned to the request and
                will provide feedback via e-mail after checking your app. Any
                significant changes made to the code at this point may slow down
                the review process.
              </Typography>
            </Box>
            <Box>
              <HeadingSmall>Changes required</HeadingSmall>
              <Typography variant="body1" color="text.secondary">
                Feedback about the app was sent to the author of the app via
                e-mail. Changes need to be made to continue the review process.
              </Typography>
            </Box>
            <Box>
              <HeadingSmall>App accepted (waiting for release)</HeadingSmall>
              <Typography variant="body1" color="text.secondary">
                The review has been completed and your app will be released
                soon. Once released, the app can be found on thetimeline. If you
                need to make any changes at this point, the review team or the
                administrator must be contacted.
              </Typography>
            </Box>
            <Box>
              <HeadingSmall>App declined</HeadingSmall>
              <Typography variant="body1" color="text.secondary">
                Unfortunately, the app did not meet our requirements and cannot
                be released. The explanation is provided via e-mail. If needed,
                a new review can be requested by clicking the Update review
                button.
              </Typography>
            </Box>
          </TexBox>
          <TexBox gap={1} className="active">
            <Box>
              <Heading className="active">Approved</Heading>
              <Typography variant="body1" color="text.secondary">
                The approved status is added to your app after the administrator
                approves and compiles the app. The approved app does not appear
                in the scenario builder automatically but it is ready to be
                installed and then enabled to show in scenarios by the
                organizations' administrator.
              </Typography>
            </Box>
          </TexBox>
        </TextBoxWrap>
      </Grid>
    </Grid>
  );
};

export default AppFlowComponent;
