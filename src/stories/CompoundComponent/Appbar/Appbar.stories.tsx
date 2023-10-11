import AccountCircle from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import LaptopIcon from '@mui/icons-material/Laptop';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TvIcon from '@mui/icons-material/Tv';
import {
  alpha,
  Box,
  Breadcrumbs,
  Button,
  IconButton,
  InputBase,
  Link,
  MenuItem,
  Select,
  styled,
  SvgIcon,
} from '@mui/material';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ComponentMeta } from '@storybook/react';
import AppBar from 'module/Appbar';
import AccountMenu from 'module/Menu';
import * as React from 'react';

const menuId = 'primary-search-account-menu';
const Search = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export const AppBarDefaut = (props: any) => {
  const theme = useTheme();
  return (
    <AppBar
      {...props}
      centeredComponent={
        <Breadcrumbs aria-label='breadcrumb' color='white'>
          <Link underline='hover' href='/' color='white'>
            MUI
          </Link>
          <Link
            underline='hover'
            color='white'
            href='/material-ui/getting-started/installation/'
          >
            Core
          </Link>
        </Breadcrumbs>
      }
      DropDown={
        <AccountMenu
          DropDown={
            <Box>
              <Button
                variant='outlined'
                aria-label='account of current user'
                aria-haspopup='true'
                color='inherit'
                sx={{
                  borderRadius: '4px',
                  gap: '5px',
                  px: '5px',
                  borderColor: theme.palette.background.GF20,
                  background: theme.palette.background.GF7,
                }}
              >
                <GridViewOutlinedIcon />
                <ExpandMoreIcon sx={{ width: '12px', height: 'auto' }} />
              </Button>
            </Box>
          }
        />
      }
    />
  );
};
export const AppBarWithSelect = (props: any) => {
  return (
    <AppBar
      {...props}
      DropDown={
        <Select
          disableUnderline
          variant='standard'
          size='small'
          name='name'
          renderValue={(value: any) => {
            return (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <SvgIcon color='inherit'>
                  <PermContactCalendarOutlinedIcon />
                </SvgIcon>
                {value}
              </Box>
            );
          }}
        >
          <MenuItem value='User Settings'>User Settings</MenuItem>
        </Select>
      }
    />
  );
};
export const AppBarWithSearch = (props: any) => {
  return (
    <AppBar
      {...props}
      leftIcon={<MenuIcon />}
      DropDown={
        <Stack direction={'row'} alignItems={'center'} ml='auto'>
          <Stack
            direction={'row'}
            alignItems={'center'}
            display={{ xs: 'none', md: 'flex' }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder='Search…'
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <IconButton
              size='large'
              aria-label='show 17 new notifications'
              color='inherit'
            >
              <Badge badgeContent={17} color='error'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Stack>
          <IconButton
            size='large'
            edge='end'
            aria-label='account of current user'
            aria-controls={menuId}
            aria-haspopup='true'
            //   onClick={handleProfileMenuOpen}
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
        </Stack>
      }
    />
  );
};
export const AppBarWithVariantTwo = (props: any) => {
  const theme = useTheme();
  const [devices, setDevices] = React.useState(() => ['phone']);
  const handleDevices = (
    event: React.MouseEvent<HTMLElement>,
    newDevices: string[]
  ) => {
    if (newDevices.length) {
      setDevices(newDevices);
    }
  };
  return (
    <AppBar
      {...props}
      sx={{ background: theme.palette.background.GFRightNavBackground }}
      centeredComponent={
        <ToggleButtonGroup
          value={devices}
          size='small'
          onChange={handleDevices}
          aria-label='device'
        >
          <ToggleButton value='laptop' aria-label='laptop'>
            <LaptopIcon />
          </ToggleButton>
          <ToggleButton value='tv' aria-label='tv'>
            <TvIcon />
          </ToggleButton>
          <ToggleButton value='phone' aria-label='phone'>
            <PhoneAndroidIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      }
      DropDown={
        <AccountMenu
          DropDown={
            <Box
              sx={{
                position: 'absolute',
                right: '0',
                top: '0',
                bottom: '0',
                minWidht: '84px',
              }}
            >
              <Button
                aria-label='account of current user'
                aria-haspopup='true'
                color='inherit'
                sx={{
                  height: '100%',
                  borderRadius: '0',
                  gap: '5px',
                  px: '16px',
                  py: '18px',
                  background: theme.palette.background.Setting,
                }}
              >
                <ExpandMoreIcon sx={{ width: '18px', height: 'auto' }} />
                <SettingsOutlinedIcon />
              </Button>
            </Box>
          }
        />
      }
    />
  );
};
export default {
  title: 'CompoundComponent/Appbar',
  component: AppBarDefaut,
  argTypes: {
    title: {
      type: 'string',
      defaultValue: 'App Bar',
    },
  },
} as ComponentMeta<typeof AppBarDefaut>;
