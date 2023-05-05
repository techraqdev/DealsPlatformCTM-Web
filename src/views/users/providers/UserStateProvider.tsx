import React, { createContext, FC, useEffect, useState } from 'react';
import { get } from '../../../common/api-middleware/commonData.api';
import { config } from '../../../common/environment';
import { UserContextState, UserListItemType } from '../userModels';

const contextDefaultValues: UserContextState = {
  users: [],
};


export const UserContext = createContext<UserContextState>(contextDefaultValues);

const UserStateProvider: FC = ({ children }) => {
  const [users, setProjects] = useState<UserListItemType[]>(contextDefaultValues.users);

  useEffect(() => {
    //getUserList();
  }, []); 

  const getUserList = async () => {
    const result = await getUsers();
    const d = result.data;
    //console.log(d);
    setProjects(d);
  };

  const getUsers = async () => {
    const queryUrl = `${config.Resource_Url}api/project`;
    return await get(queryUrl, '');
  };

  return <UserContext.Provider value={{ users }}>{children}</UserContext.Provider>;
};
export default UserStateProvider;
