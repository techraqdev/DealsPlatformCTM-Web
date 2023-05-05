import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Menu,
  Typography,
  Chip,
  Avatar,
  Button,
  Drawer,
  MenuItem,
  Divider,
  ListItemIcon,
} from '@mui/material';
import PropTypes from 'prop-types';
// Dropdown Component
import ProfileDropdown from './ProfileDropdown';
import CustomTextField from '../../../components/forms/custom-elements/CustomTextField';
import userimg from '../../../assets/images/users/user2.jpg';
import LogoIcon from '../logo/LogoIcon';
import { clearLocalStorage, clearAll, getStorage } from '../../../common/helpers/storage.helper';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { pwc_username } from '../../../common/constants/common.constant';
import { useAuth, UserManager } from 'oidc-react';
import { useNavigate } from 'react-router';
import { config } from '../../../common/environment';
import { get, post } from '../../../common/api-middleware/commonData.api';
const baseUrl = `${config.Resource_Url}`;

const Header = ({ sx, customClass, toggleSidebar, toggleMobileSidebar }) => {
  const [userName, setUserName] = useState('');
  const authInfo = useAuth();
  const isAuthenticated = authInfo && authInfo.userData != null;
  const navigate = useNavigate();
  const queryUrl = 'identity/logoutlogs';

  useEffect(() => {
    if (isAuthenticated) {
      setUserName((authInfo?.userData?.profile != null && authInfo?.userData?.profile?.name) || '');
    }
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // 2
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // 4
  const [anchorEl4, setAnchorEl4] = React.useState(null);

  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };

  // drawer
  const [showDrawer, setShowDrawer] = useState(false);

  const handleDrawerClose = () => {
    setShowDrawer(false);
  };

  // drawer top
  const [showDrawer2, setShowDrawer2] = useState(false);

  const handleDrawerClose2 = () => {
    setShowDrawer2(false);
  };
  const LogOutDetails = async () => {
    //debugger;
    // e.preventDefault();
    //const response = await get(baseUrl, queryUrl);
  };

  const handleLogout = (logoutType) => {
    debugger;
    try {
      LogOutDetails();      
      authInfo.signOut().then((resp) => {
        clearLocalStorage();
        clearAll();
        navigate('/');
        // window.location.reload();
      });
    }
    catch (ex) {
      clearLocalStorage();
      clearAll();
      window.location.reload();
    }
  };
  const open = Boolean(anchorEl);

  return (
    <AppBar sx={sx} elevation={0} className={customClass}>
      <Toolbar style={{ paddingLeft: '10px' }}>
        <LogoIcon logoWidth={150}></LogoIcon>

        <IconButton
          edge="start"
          className="toggle-menu"
          aria-label="menu"
          onClick={toggleSidebar}
          size="large"
          sx={{
            display: {
              lg: 'flex',
              xs: 'none',
            },
          }}
        >
          <FeatherIcon icon="menu" />
        </IconButton>

        <IconButton
          size="large"
          className="toggle-menu"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'flex',
            },
          }}
        >
          <FeatherIcon icon="menu" width="20" height="20" />
        </IconButton>
        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        {/* <IconButton
          aria-label="show 4 new mails"
          color="inherit"
          aria-controls="search-menu"
          aria-haspopup="true"
          onClick={() => setShowDrawer2(true)}
          size="large"
        >
          <FeatherIcon icon="search" width="20" height="20" />
        </IconButton> */}
        <Drawer
          anchor="top"
          open={showDrawer2}
          onClose={() => setShowDrawer2(false)}
          sx={{
            '& .MuiDrawer-paper': {
              padding: '15px 30px',
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <CustomTextField
              id="tb-search"
              size="small"
              placeholder="Search here"
              fullWidth
              inputProps={{ 'aria-label': 'Search here' }}
            />
            <Box
              sx={{
                ml: 'auto',
              }}
            >
              <IconButton
                color="inherit"
                sx={{
                  color: (theme) => theme.palette.grey.A200,
                }}
                onClick={handleDrawerClose2}
              >
                <FeatherIcon icon="x-circle" />
              </IconButton>
            </Box>
          </Box>
        </Drawer>
        {/* ------------ End Menu icon ------------- */}

        <Box flexGrow={1} />
        {/* ------------------------------------------- */}
        {/* Ecommerce Dropdown */}
        {/* ------------------------------------------- */}
        {/* <IconButton size="large" color="inherit" onClick={() => setShowDrawer(true)}>
          <FeatherIcon icon="shopping-cart" width="20" height="20" />
        </IconButton>
        <Drawer
          anchor="right"
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: {
                xs: '100%',
                sm: '395px',
              },
              padding: '30px',
            },
          }}
        >
          {/* <Box display="flex" alignItems="center">
            <Typography variant="h4" fontWeight="500">
              Shopping Cart
            </Typography>
            <Box
              sx={{
                ml: 'auto',
              }}
            >
              <IconButton
                color="inherit"
                sx={{
                  color: (theme) => theme.palette.grey.A200,
                }}
                onClick={handleDrawerClose}
              >
                <FeatherIcon icon="x-circle" />
              </IconButton>
            </Box>
          </Box> 

        </Drawer> */}
        {/* ------------------------------------------- */}
        {/* End Ecommerce Dropdown */}
        {/* ------------------------------------------- */}
        {/* ------------------------------------------- */}
        {/* Messages Dropdown */}
        {/* ------------------------------------------- */}
        {/* <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
          onClick={handleClick2}
        >
          <Badge variant="dot" color="primary">
            <FeatherIcon icon="message-square" width="20" height="20" />
          </Badge>
        </IconButton>
        <Menu
          id="msgs-menu"
          anchorEl={anchorEl2}
          keepMounted
          open={Boolean(anchorEl2)}
          onClose={handleClose2}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          sx={{
            '& .MuiMenu-paper': {
              width: '385px',
              right: 0,
              top: '70px !important',
            },
            '& .MuiList-padding': {
              p: '30px',
            },
          }}
        >
          <Box
            sx={{
              mb: 1,
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h4" fontWeight="500">
                Messages
              </Typography>
              <Box
                sx={{
                  ml: 2,
                }}
              >
                <Chip
                  size="small"
                  label="5 new"
                  sx={{
                    borderRadius: '6px',
                    pl: '5px',
                    pr: '5px',
                    backgroundColor: (theme) => theme.palette.secondary.main,
                    color: '#fff',
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Button
            sx={{
              mt: 2,
              display: 'block',
              width: '100%',
            }}
            variant="contained"
            color="primary"
            onClick={handleClose2}
          >
            <Link
              to="/email"
              style={{
                color: '#fff',
                width: '100%',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              See all messages
            </Link>
          </Button>
        </Menu> */}
        {/* ------------------------------------------- */}
        {/* End Messages Dropdown */}
        {/* ------------------------------------------- */}
        {/* ------------------------------------------- */}
        {/* Notifications Dropdown */}
        {/* ------------------------------------------- */}
        {/* <IconButton
          size="large"
          aria-label="menu"
          color="inherit"
          aria-controls="notification-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Badge variant="dot" color="secondary">
            <FeatherIcon icon="bell" width="20" height="20" />
          </Badge>
        </IconButton>
        <Menu
          id="notification-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          sx={{
            '& .MuiMenu-paper': {
              width: '385px',
              right: 0,
              top: '70px !important',
            },
            '& .MuiList-padding': {
              p: '30px',
            },
          }}
        >
          <Box
            sx={{
              mb: 1,
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h4" fontWeight="500">
                Notifications
              </Typography>
              <Box
                sx={{
                  ml: 2,
                }}
              >
                <Chip
                  size="small"
                  label="5 new"
                  sx={{
                    borderRadius: '6px',
                    pl: '5px',
                    pr: '5px',
                    backgroundColor: (theme) => theme.palette.warning.main,
                    color: '#fff',
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Button
            sx={{
              mt: 2,
              display: 'block',
              width: '100%',
            }}
            variant="contained"
            color="primary"
            onClick={handleClose}
          >
            <Link
              to="/email"
              style={{
                color: '#fff',
                width: '100%',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              See all notifications
            </Link>
          </Button>
        </Menu> */}
        {/* ------------------------------------------- */}
        {/* End Notifications Dropdown */}
        {/* ------------------------------------------- */}

        {/* <Box
          sx={{
            width: '1px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: '25px',
            ml: 1,
            mr: 1,
          }}
        /> */}
        {/* ------------------------------------------- */}
        {/* Profile Dropdown */}
        {/* ------------------------------------------- */}
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'flex',
              },
              alignItems: 'center',
            }}
          >
            <Typography color="textSecondary" variant="h5" fontWeight="400" sx={{ ml: 1 }}>
              <a href="https://docs.google.com/forms/d/16wxsjIqwQXN_nAv9lAbg3py64xbfAiQEhbMGmjTdzwk/edit" className="bg_color" target="_blank" rel="noreferrer">
                Help & Feedback
              </a>
            </Typography>
          </Box>
          <Box
          sx={{
            width: '1px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: '25px',
            ml: 1,
            mr: 1,
          }}
        />
          <Avatar
            src="/broken-image.jpg"
            sx={{
              width: '30px',
              height: '30px',
            }}
          />
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'flex',
              },
              alignItems: 'center',
            }}
          >
            <Typography color="textSecondary" variant="h5" fontWeight="400" sx={{ ml: 1 }}>
              Hi,
            </Typography>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                ml: 1,
              }}
            >
              {getStorage(pwc_username)}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: '1px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: '25px',
            ml: 1,
            mr: 1,
          }}
        />
        <Logout
          fontSize="small"
          onClick={() => handleLogout('popup')}
          style={{ cursor: 'pointer' }}
        />
        <Button
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          style={{ display: 'none' }}
        >
          <Box display="flex" alignItems="center">
            <Avatar
              src={userimg}
              alt={userimg}
              sx={{
                width: '30px',
                height: '30px',
              }}
            />
            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'flex',
                },
                alignItems: 'center',
              }}
            >
              <Typography color="textSecondary" variant="h5" fontWeight="400" sx={{ ml: 1 }}>
                Hi,
              </Typography>
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{
                  ml: 1,
                }}
              >
                {getStorage(pwc_username)}
              </Typography>
              <FeatherIcon icon="chevron-down" width="20" height="20" />
            </Box>
          </Box>
        </Button>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 2.8,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <Avatar /> Profile
          </MenuItem>
          <MenuItem>
            <Avatar /> My account
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={() => handleLogout('popup')}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  customClass: PropTypes.string,
  toggleSidebar: PropTypes.func,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;
