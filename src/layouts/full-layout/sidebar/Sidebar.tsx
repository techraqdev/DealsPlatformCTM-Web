import React, { useEffect } from 'react';
import { matchRoutes, useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  Typography,
  ListItem,
  Collapse,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { SidebarWidth } from '../../../assets/global/Theme-variable';
// import Menuitems from './MenuItems';
import Scrollbar from '../../../components/custom-scroll/Scrollbar';
import { IMenu, ISidebar } from '../../../models/LayoutModels';
import { clearStorage, getStorage, setStorage } from '../../../common/helpers/storage.helper';
import { projectSearchToken, pwc_menu, userSearchToken, Project_Wf_StatusTypes } from '../../../common/constants/common.constant';
import Router from '../../../routes/Router';

const Sidebar = (props: ISidebar) => {
  const menu: IMenu[] = [];
  const [open, setOpen] = React.useState(true);
  const { pathname } = useLocation();
  const [menuItems, setMenuItems] = React.useState(menu);
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));

  useEffect(() => {
    setMenuItems(getStorage(pwc_menu));
    const menuSelectionTimer = setTimeout(() => {
      const storageMenuItems = getStorage(pwc_menu);
      if (storageMenuItems != null) {
        storageMenuItems.map((items: any, index: any) => {
          const item = items.children?.find(x => x.hRef == pathDirect);
          if (item != null) {
            setOpen(index);
          }
        });
      }
    }, 1000);
    return () => clearTimeout(menuSelectionTimer);

  }, []);

  // const location = useLocation();

  //Reset Filter Storage on page level
  // useEffect(() => {
  //   const path = location.pathname;
  //   const letRoute = Router.filter(x => x.path == "/");
  //   const chiildrens = letRoute[0].children.filter(x => x.path != "/");
  //   const route2 = matchRoutes(chiildrens, location);
  //   if (route2 != null) {
  //     const letPathRoute = route2[0].route;
  //     if (letPathRoute != null && letPathRoute['storageDependent']) {
  //       if (letPathRoute['storageDependent'] == projectSearchToken) {
  //         clearStorage(userSearchToken);
  //       }
  //       else if (letPathRoute['storageDependent'] == userSearchToken) {
  //         clearStorage(projectSearchToken);
  //       }
  //     }
  //     else {
  //       clearStorage(projectSearchToken);
  //       clearStorage(userSearchToken);
  //     }
  //   }
  // }, [location]);
  const defaultProjList = [
    Project_Wf_StatusTypes.NotResponded,
    Project_Wf_StatusTypes.Quotable,
    Project_Wf_StatusTypes.NotQuotable,
    Project_Wf_StatusTypes.Restricted,
    Project_Wf_StatusTypes.PartnerApprovalPending,
    Project_Wf_StatusTypes.RejectedbyPartner,
    Project_Wf_StatusTypes.ClientApprovalPending,
    Project_Wf_StatusTypes.RejectedbyClient,
    Project_Wf_StatusTypes.ClientSeekingMoreInfo,
  ];

  const getProjectSearchStorage = () => {
    debugger;
    const storage = getStorage(projectSearchToken);
    if (storage != null) {
      const searchFilterLocal = {
        sbu: [],
        projectStatusList: defaultProjList,
        projectName: '',
        clientName: '',
        projectCode: '',
        isNavigationFromOtherPage: false,
      };
      setStorage(projectSearchToken, searchFilterLocal);
      // const filteredStorage = storage;
      // filteredStorage.isNavigationFromOtherPage = false;
      // setStorage(projectSearchToken, filteredStorage);
    }
  };

  const handleClick = (index: any) => {
    if (open === index) {
      setOpen((prevopen) => !prevopen);
    } else {
      setOpen(index);
    }
    getProjectSearchStorage();
  };

  const SidebarContent = (
    <Scrollbar
      style={{
        height: 'calc(100vh - 5px)',
        background: '#2d2d2d',
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* <LogoIcon /> */}
        <Box>
          <List
            style={{
              background: '#2d2d2d',
              color: '#fff',
              marginTop: 70,
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            {menuItems &&
              menuItems.map((item: any, index: any) => {

                if (item && item.children) {
                  return (
                    <React.Fragment key={item.title}>
                      <ListItem
                        button
                        component="li"
                        onClick={() => handleClick(index)}
                        selected={pathWithoutLastPart === item.hRef}
                        sx={{
                          mb: 1,
                          borderRadius: '0 !important',
                          borderTop: '1px solid rgb(255, 182, 0)',
                          marginBottom: '0 !important',
                          paddingLeft: '0 !important',
                          ...(pathWithoutLastPart === item.hRef && {
                            color: '#fff !important',
                            backgroundColor: (theme) => `${theme.palette.primary.main}!important`,
                          }),
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: '18px !important',
                            ...(pathWithoutLastPart === item.hRef && {
                              color: '#fff !important',
                            }),
                          }}
                        >
                          <FeatherIcon icon={item.icon} width="20" height="20" />
                        </ListItemIcon>
                        <ListItemText>{item.title}</ListItemText>
                        {index === open || pathWithoutLastPart === item.hRef ? (
                          <FeatherIcon icon="chevron-down" size="16" />
                        ) : (
                          <FeatherIcon icon="chevron-right" size="16" />
                        )}
                      </ListItem>
                      <Collapse in={index === open} timeout="auto" unmountOnExit>
                        <List component="li" disablePadding>
                          {item.children.map((child: any) => {
                            return (
                              <ListItem
                                key={child.title}
                                button={true}
                                component={NavLink}
                                to={child.hRef}
                                onClick={props && props.onSidebarClose}
                                selected={pathDirect === child.hRef}
                                className="sub-menu"
                                sx={{
                                  mb: 1,
                                  borderRadius: '0 !important',
                                  marginBottom: '0 !important',
                                  ...(pathDirect === child.hRef && {
                                    color: '#fff !important',
                                    backgroundColor: 'transparent!important',
                                  }),
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: '18px !important',
                                    svg: { width: '14px', marginLeft: '3px' },
                                    ...(pathDirect === child.hRef && {
                                      color: '#fff !important',
                                    }),
                                  }}
                                >
                                  <FeatherIcon icon={child.icon} width="20" height="20" />
                                </ListItemIcon>
                                <ListItemText>{child.title}</ListItemText>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Collapse>
                    </React.Fragment>
                  );
                  // {/********If Sub No Menu**********/}
                } else {
                  return (
                    <List component="li" disablePadding key={item.title}>
                      <ListItem
                        onClick={() => handleClick(index)}
                        button
                        component={NavLink}
                        to={item.hRef}
                        selected={pathDirect === item.hRef}
                        sx={{
                          mb: 1,
                          borderRadius: '0 !important',
                          borderTop: '1px solid rgb(255, 182, 0)',
                          marginBottom: '0 !important',
                          ...(pathDirect === item.hRef && {
                            color: '#fff !important',
                            backgroundColor: (theme) => `${theme.palette.primary.main}!important`,
                          }),
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: '18px !important',
                            ...(pathDirect === item.hRef && { color: '#fff !important' }),
                          }}
                        >
                          <FeatherIcon icon={item.icon} width="20" height="20" />
                        </ListItemIcon>
                        <ListItemText onClick={props && props.onSidebarClose}>
                          {item.title}
                        </ListItemText>
                      </ListItem>
                    </List>
                  );
                }
              })}
          </List>
        </Box>
        {/* <Buynow /> */}
      </Box>
    </Scrollbar>
  );
  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={props && props.isSidebarOpen}
        variant="persistent"
        className="side-muidrawer-paper"
        PaperProps={{
          sx: {
            width: SidebarWidth,
            border: '0 !important',
            boxShadow: '0px 7px 30px 0px rgb(113 122 131 / 11%)',
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }
  return (
    <Drawer
      anchor="left"
      open={props && props.isMobileSidebarOpen}
      onClose={props && props.onSidebarClose}
      PaperProps={{
        sx: {
          width: SidebarWidth,
          border: '0 !important',
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

export default Sidebar;
