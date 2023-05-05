export interface IBaseCard {
  title: string;
  children?: JSX.Element | JSX.Element[];
}
export interface IBaseFeed {
  img: string;
  userName: string;
  time: any;
  children?: JSX.Element | JSX.Element[];
}
export interface IDashboardCard {
  custompadding?: string;
  customheaderpadding?: string;
  customdisplay?: string;
  custommargin?: string;
  title?: string;
  subtitle?: string;
  action?: any;
  children?: JSX.Element | JSX.Element[];
}
export interface IWidgetCard {
  title: string;
}
export interface IPageContainer {
  title?: string;
  description?: string;
  children?: JSX.Element | JSX.Element[];
}

export interface IBreadCrumb {
  subtitle?: string;
  items?: INavItems[];
  title?: string;
  children?: JSX.Element | JSX.Element[];
}
export interface INavItems {
  to?: string;
  title?: string;
}

export interface ISimpleDialog {
  onClose: (e: boolean) => void;
  open: boolean;
}

export interface ISidebar {
  isMobileSidebarOpen: boolean;
  onSidebarClose: () => void;
  isSidebarOpen: boolean;
  isSidebardir: string;
}

export interface IMenu {
  title: string;
  hRef?: string;
  icon?: string;
  collapse?: boolean;
  children?: IMenu[];
}
