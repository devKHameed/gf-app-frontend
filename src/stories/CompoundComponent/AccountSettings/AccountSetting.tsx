import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import ShieldIcon from "@mui/icons-material/Shield";
import { Avatar, Box, Button, Card, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomizedInputBase from "components/CustomInput";
import { IOSSwitch } from "stories/CompoundComponent/ProfileCard/ProfileCard.stories";
interface Props {
  leftIcon?: React.ReactElement | React.ReactNode;
  rightIcon?: React.ReactElement | React.ReactNode;
  label?: string;
  className?: string;
  placeholder?: string;
}
export const GetLabel = ({ leftIcon, label, rightIcon, className }: Props) => {
  return (
    <Stack
      className={className}
      direction={"row"}
      justifyContent="space-between"
      alignItems={"center"}
      spacing={1.5}
      py={0.75}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
        {leftIcon && leftIcon}
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ whiteSpace: "pre" }}
        >
          {label}
        </Typography>{" "}
      </Stack>
      {rightIcon && rightIcon}
    </Stack>
  );
};
const AccountSettings: React.FC<Props> = (props) => {
  const { label, leftIcon, rightIcon, placeholder } = props;
  const theme = useTheme();
  return (
    <>
      <Box sx={{ mb: 0.75 }}>
        <GetLabel leftIcon={leftIcon} label={label} rightIcon={rightIcon} />
      </Box>
      <Box
        sx={{
          background: theme.palette.background.GF7,
          px: 1,
          py: 0.25,
          mb: 0.75,
        }}
      >
        <CustomizedInputBase
          rightIcon={rightIcon}
          leftIcon={leftIcon}
          placeholder={placeholder}
        />
      </Box>
    </>
  );
};

export const AccountSettingsComponent = () => {
  const theme = useTheme();
  return (
    <Card sx={{ px: 2.5, py: 2 }}>
      <AccountSettings
        rightIcon={<CreateOutlinedIcon />}
        leftIcon={<ShieldIcon />}
        label="Designer Admin"
        placeholder="Designer Admin"
      />
      <AccountSettings
        rightIcon={<SettingsBackupRestoreOutlinedIcon />}
        leftIcon={<LockOutlinedIcon />}
        label="********"
        placeholder="********"
      />
      <GetLabel
        leftIcon={<></>}
        label="Designer Admin"
        rightIcon={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
      />
      <GetLabel
        leftIcon={<Avatar />}
        label="Designer Admin"
        rightIcon={<DeleteOutlineIcon />}
      />
      <Box sx={{ mt: 0.75 }}>
        <CustomizedInputBase
          bgColor={theme.palette.background.GF7}
          rightIcon={
            <Button
              color="inherit"
              endIcon={<SettingsBackupRestoreOutlinedIcon />}
            >
              Reset
            </Button>
          }
          leftIcon={<LockOutlinedIcon />}
          placeholder={"*******"}
        />
      </Box>
    </Card>
  );
};
export default AccountSettings;
