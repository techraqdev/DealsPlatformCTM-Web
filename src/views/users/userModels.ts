export type UserListItemType = {
  projectId: number;
  projectCode: string;
  taskCode: string;
};

export type UserContextState = {
  users: UserListItemType[];
};

export interface IUserSearchFilter {
  name: string;
}

export interface IAddUsers {
  roleId: string;
  email: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  designation: string;
  costCenterName: string;
  costCenterLevel1: string;
  costCenterLevel2: string;
  reportingPartner: string;
  activeUser: string;
}

export interface IRoles {
  name: string;
  roleId: string;
}

export interface userSearch {
  name?: string;
  email?: string;
  role?: string;  
  designation?: string;
  active?: string;
  userId?: string;
  resetGrid?: boolean;
}

export const UserRoleId = 'c41121ed-b6fb-c9a6-bc9b-574c82929e7b';
export const AdminRoleId = 'c41121ed-b6fb-c9a6-bc9b-574c82929e7e';
export const ClientRoleId = 'c016fa95-9f0b-47d6-ad67-23720d3c8b19';
