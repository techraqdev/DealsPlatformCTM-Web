import { THEME_COLOR, NAVBAR_BG, SIDEBAR_BG, DIRECTION, DARK_THEME } from '../constants';

export const setTheme = (payload: any) => ({
  type: THEME_COLOR,
  payload,
});
export const setDarkMode = (payload: any) => ({
  type: DARK_THEME,
  payload,
});
export const setNavbarBg = (payload: any) => ({
  type: NAVBAR_BG,
  payload,
});

export const setSidebarBg = (payload: any) => ({
  type: SIDEBAR_BG,
  payload,
});

export const setDir = (payload) => ({
  type: DIRECTION,
  payload,
});
