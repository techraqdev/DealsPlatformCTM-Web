import React, { FC } from 'react';
import UserList from './UserList';
import UserStateProvider from './providers/UserStateProvider';

const UserContainer: FC = () => {
  return (
    <div>
      <UserStateProvider>
        <UserList />
      </UserStateProvider>
    </div>
  );
};
export default UserContainer;
